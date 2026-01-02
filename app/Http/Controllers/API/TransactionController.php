<?php

namespace App\Http\Controllers\API;

use App\Enums\ItemStatus;
use App\Enums\TransactionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\Item;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $transactions = Transaction::where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->with(['item', 'buyer', 'seller'])
            ->latest()
            ->paginate(10);

        return TransactionResource::collection($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'offered_price' => 'required|numeric|min:0',
        ]);

        $item = Item::findOrFail($validated['item_id']);

        if ($item->user_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot buy your own item'], 403);
        }

        if ($item->status !== ItemStatus::AVAILABLE) {
            return response()->json(['message' => 'Item is no longer available'], 422);
        }

        $transaction = Transaction::create([
            'item_id' => $item->id,
            'buyer_id' => $request->user()->id,
            'seller_id' => $item->user_id,
            'offered_price' => $validated['offered_price'],
            'status' => TransactionStatus::REQUESTED,
        ]);

        return new TransactionResource($transaction->load(['item', 'buyer', 'seller']));
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
        return new TransactionResource($transaction->load(['item', 'buyer', 'seller']));
    }

    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'status' => 'required|string', // Should validate against Enum
        ]);

        $newStatus = TransactionStatus::from($validated['status']);

        DB::transaction(function () use ($transaction, $newStatus) {
            $transaction->update(['status' => $newStatus]);

            // Update item status based on transaction status
            if ($newStatus === TransactionStatus::ACCEPTED) {
                $transaction->item->update(['status' => ItemStatus::RESERVED]);
            } elseif ($newStatus === TransactionStatus::COMPLETED) {
                $transaction->item->update(['status' => ItemStatus::SOLD]);
            }
        });

        return new TransactionResource($transaction->load(['item', 'buyer', 'seller']));
    }
}
