<?php

namespace App\Http\Controllers\API;

use App\Enums\ItemStatus;
use App\Enums\TransactionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\Item;
use App\Models\Transaction;
use Illuminate\Http\Request;
class TransactionController extends Controller
{
    protected $orderService;

    public function __construct(\App\Services\OrderStateService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $transactions = Transaction::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->with(['item', 'buyer', 'seller'])
            ->latest()
            ->paginate(20);

        return TransactionResource::collection($transactions);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'offered_price' => 'required|numeric|min:0',
        ]);

        $item = Item::findOrFail($validated['item_id']);

        if ($item->user_id == $userId) {
            return response()->json(['message' => 'You cannot buy your own item'], 403);
        }

        if ($item->status !== ItemStatus::AVAILABLE) {
            return response()->json(['message' => 'Item is no longer available'], 422);
        }

        $transaction = Transaction::create([
            'item_id' => $item->id,
            'buyer_id' => $userId,
            'seller_id' => $item->user_id,
            'offered_price' => $validated['offered_price'],
            'status' => TransactionStatus::REQUESTED,
        ]);

        return new TransactionResource($transaction->load(['item', 'buyer', 'seller']));
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
        return new TransactionResource($transaction->load(['item', 'buyer', 'seller']));
    }

    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'status' => 'required|string',
            'description' => 'sometimes|string|max:500'
        ]);

        try {
            $this->orderService->transition($transaction, $validated['status'], $validated['description'] ?? null);
            return new TransactionResource($transaction->fresh(['item', 'buyer', 'seller']));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Transaction Update Error: " . $e->getMessage(), [
                'transaction_id' => $transaction->id,
                'status' => $validated['status'],
                'user_id' => auth()->id()
            ]);
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
