<?php

namespace App\Enums;

enum ItemCondition: string
{
    case NEW = 'NEW';
    case LIKE_NEW = 'LIKE_NEW';
    case GOOD = 'GOOD';
    case FAIR = 'FAIR';
}
