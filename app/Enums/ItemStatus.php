<?php

namespace App\Enums;

enum ItemStatus: string
{
    case AVAILABLE = 'AVAILABLE';
    case RESERVED = 'RESERVED';
    case SOLD = 'SOLD';
}
