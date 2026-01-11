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
    public function myItems(Request $request)
    {
        $userId = $request->user()->id;
        $items = Item::where('user_id', $userId)
            ->with(['user', 'category', 'images'])
            ->latest()
            ->get();

        return ItemResource::collection($items);
    }

    public function index(Request $request)
    {
        $query = Item::query()->where('status', ItemStatus::AVAILABLE);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('conditions')) {
            $conditions = explode(',', $request->conditions);
            $query->whereIn('condition', $conditions);
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

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = ItemStatus::AVAILABLE;

        $item = DB::transaction(function () use ($validated, $request) {
            $item = Item::create($validated);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('items', 'public');
                    $item->images()->create(['path' => '/storage/' . $path]);
                }
            }

            \App\Models\ActivityLog::create([
                'user_id' => $request->user()->id,
                'actor_name' => $request->user()->name,
                'actor_role' => $request->user()->role,
                'entity_type' => 'Item',
                'entity_id' => $item->id,
                'action' => 'item_created',
                'description' => "User listed a new item: {$item->title}",
            ]);

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

        $oldStatus = $item->status->value;
        $item->update($validated);

        if (array_key_exists('status', $validated)) {
            \App\Models\ActivityLog::create([
                'user_id' => $request->user()->id,
                'actor_name' => $request->user()->name,
                'actor_role' => $request->user()->role,
                'entity_type' => 'Item',
                'entity_id' => $item->id,
                'action' => 'item_status_changed',
                'description' => "Item status changed from $oldStatus to {$item->status->value}",
                'properties' => ['old_status' => $oldStatus, 'new_status' => $item->status->value],
            ]);
        }

        return new ItemResource($item->load(['user', 'category', 'images']));
    }

    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);
        
        $itemId = $item->id;
        $itemTitle = $item->title;
        $item->delete();

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'actor_name' => auth()->user()->name,
            'actor_role' => auth()->user()->role,
            'entity_type' => 'Item',
            'entity_id' => $itemId,
            'action' => 'item_deleted',
            'description' => "User deleted their item: $itemTitle",
        ]);

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
