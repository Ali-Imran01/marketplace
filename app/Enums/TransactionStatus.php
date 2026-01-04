<?php

namespace App\Enums;

enum TransactionStatus: string
{
    case REQUESTED = 'REQUESTED';
    case ACCEPTED = 'ACCEPTED';
    case ITEM_SENT = 'ITEM_SENT';
    case RECEIVED = 'RECEIVED';
    case COMPLETED = 'COMPLETED';
    case SHIPPED = 'SHIPPED';
    case DELIVERED = 'DELIVERED';
    case REJECTED = 'REJECTED';
    case CANCELLED = 'CANCELLED';
    case DISPUTED = 'DISPUTED';
    case REFUNDED = 'REFUNDED';
}
