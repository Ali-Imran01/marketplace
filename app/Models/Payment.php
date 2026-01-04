<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'transaction_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'external_id',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
