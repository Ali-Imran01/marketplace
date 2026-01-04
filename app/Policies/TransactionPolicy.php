<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TransactionPolicy
{
    public function view(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id || 
               $user->id === $transaction->seller_id || 
               $user->role === 'admin';
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id || 
               $user->id === $transaction->seller_id || 
               $user->role === 'admin';
    }
}
