<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item' => new ItemResource($this->item),
            'buyer' => [
                'id' => $this->buyer->id,
                'name' => $this->buyer->name,
            ],
            'seller' => [
                'id' => $this->seller->id,
                'name' => $this->seller->name,
            ],
            'offered_price' => (float) $this->offered_price,
            'status' => $this->status,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
