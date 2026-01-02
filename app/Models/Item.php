<?php

namespace App\Models;

use App\Enums\ItemCondition;
use App\Enums\ItemStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'condition',
        'price',
        'status',
    ];

    protected $casts = [
        'condition' => ItemCondition::class,
        'status' => ItemStatus::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ItemImage::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
