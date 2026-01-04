<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\ActivityLog;
use App\Enums\TransactionStatus;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderStateService
{
    /**
     * Transition a transaction to a new status.
     */
    public function transition(Transaction $transaction, string $newStatus, ?string $description = null)
    {
        $oldStatus = $transaction->status->value;
        $user = Auth::user();

        // 1. Validate the transition logic
        $this->validateTransition($transaction, $user, $newStatus);

        // 2. Perform the transition in a transaction
        return DB::transaction(function () use ($transaction, $oldStatus, $newStatus, $user, $description) {
            $transaction->update(['status' => $newStatus]);

            // If rejected or cancelled, make item available again
            if (in_array($newStatus, ['REJECTED', 'CANCELLED'])) {
                $transaction->item->update(['status' => \App\Enums\ItemStatus::AVAILABLE]);
            }

            // 3. Log the activity
            $this->logActivity($transaction, $user, $oldStatus, $newStatus, $description);

            return $transaction;
        });
    }

    /**
     * Define which roles can perform which transitions.
     */
    protected function validateTransition(Transaction $transaction, User $user, string $newStatus)
    {
        $isBuyer = $user->id == $transaction->buyer_id;
        $isSeller = $user->id == $transaction->seller_id;
        $isAdmin = $user->role == 'admin';

        // Basic workflow validation
        switch ($newStatus) {
            case 'ACCEPTED':
            case 'REJECTED':
                if (!$isSeller) abort(403, "Only sellers can accept or reject offers.");
                if ($transaction->status->value !== 'REQUESTED') abort(422, "Can only accept/reject a requested offer.");
                break;

            case 'SHIPPED':
            case 'ITEM_SENT':
                if (!$isSeller) abort(403, "Only sellers can mark as shipped.");
                if ($transaction->status->value !== 'ACCEPTED') abort(422, "Can only ship an accepted order.");
                break;

            case 'DELIVERED':
            case 'RECEIVED':
                if (!$isSeller && !$isBuyer) abort(403);
                if ($transaction->status->value !== 'SHIPPED' && $transaction->status->value !== 'ITEM_SENT') {
                    abort(422, "Can only mark as delivered/received after shipping.");
                }
                break;

            case 'COMPLETED':
                if (!$isBuyer) abort(403, "Only buyers can complete the order.");
                if (!in_array($transaction->status->value, ['DELIVERED', 'SHIPPED', 'ITEM_SENT', 'RECEIVED'])) {
                    abort(422, "Cannot complete order yet.");
                }
                break;

            case 'CANCELLED':
                if (!$isBuyer && !$isSeller && !$isAdmin) abort(403, "Not authorized to cancel.");
                // Cannot cancel completed or shipped orders
                if (in_array($transaction->status->value, ['COMPLETED', 'SHIPPED', 'DELIVERED', 'ITEM_SENT', 'RECEIVED'])) {
                    abort(422, "Cannot cancel a shipped or completed order.");
                }
                break;

            case 'DISPUTED':
                if (!$isBuyer && !$isSeller) abort(403);
                break;

            case 'REFUNDED':
                if (!$isAdmin) abort(403, "Only admins can process refunds.");
                if ($transaction->status->value !== 'DISPUTED') abort(422, "Can only refund disputed orders.");
                break;

            default:
                abort(422, "Invalid status transition.");
        }
    }

    protected function logActivity(Transaction $transaction, User $user, string $old, string $new, ?string $desc)
    {
        ActivityLog::create([
            'user_id' => $user->id,
            'actor_name' => $user->name,
            'actor_role' => $user->role,
            'entity_type' => 'Transaction',
            'entity_id' => $transaction->id,
            'action' => 'status_changed',
            'description' => $desc ?? "Order status changed from $old to $new",
            'properties' => [
                'old_status' => $old,
                'new_status' => $new,
            ],
        ]);
    }
}
