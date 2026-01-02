<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TransactionPolicy
{
    public function view(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id || $user->id === $transaction->seller_id;
    }

    public function update(User $user, Transaction $transaction): bool
    {
        // Only seller can accept/reject or move to sent/completed
        // Or only buyer can move to received?
        // Let's simplify: both involved parties can update status for now, 
        // but typically seller initiates acceptance.
        return $user->id === $transaction->buyer_id || $user->id === $transaction->seller_id;
    }
}
