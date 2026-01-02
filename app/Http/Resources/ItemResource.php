<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'category' => new CategoryResource($this->category),
            'title' => $this->title,
            'description' => $this->description,
            'condition' => $this->condition,
            'price' => (float) $this->price,
            'status' => $this->status,
            'images' => $this->images->pluck('path'),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
