<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Enums\ItemStatus;
use App\Http\Resources\ItemResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Calculate average rating from transactions' reviews
        $ratings = $this->sellerTransactions->map(fn($t) => $t->review?->rating)->filter();
        $avgRating = $ratings->isNotEmpty() ? round($ratings->average(), 1) : 0;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'joined_at' => $this->created_at->format('M Y'),
            'email_verified_at' => $this->email_verified_at,
            'avg_rating' => $avgRating,
            'review_count' => $ratings->count(),
            'active_items_count' => $this->items()->where('status', ItemStatus::AVAILABLE)->count(),
            'reviews' => $this->sellerTransactions->map(fn($t) => $t->review ? [
                'id' => $t->review->id,
                'rating' => $t->review->rating,
                'comment' => $t->review->comment,
                'buyer_name' => $t->buyer->name,
                'date' => $t->review->created_at->format('d M Y'),
                'item_title' => $t->item->title
            ] : null)->filter()->values()
        ];
    }
}
