<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use Illuminate\Http\Request;
use App\Enums\ItemStatus;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::query()->where('status', ItemStatus::AVAILABLE);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $items = $query->with(['user', 'category', 'images'])->latest()->paginate(12);

        return ItemResource::collection($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'condition' => 'required|string',
            'price' => 'required|numeric|min:0',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $validated['user_id'] = $request->user()?->id ?? 1; // Fallback for dev without auth
        $validated['status'] = ItemStatus::AVAILABLE;

        $item = DB::transaction(function () use ($validated, $request) {
            $item = Item::create($validated);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('items', 'public');
                    $item->images()->create(['path' => '/storage/' . $path]);
                }
            }

            return $item;
        });

        return new ItemResource($item->load(['user', 'category', 'images']));
    }

    public function show(Item $item)
    {
        return new ItemResource($item->load(['user', 'category', 'images']));
    }

    public function update(Request $request, Item $item)
    {
        $this->authorize('update', $item);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'condition' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string',
        ]);

        $item->update($validated);

        return new ItemResource($item->load(['user', 'category', 'images']));
    }

    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);
        $item->delete();
        return response()->json(['message' => 'Item deleted successfully']);
    }
}
