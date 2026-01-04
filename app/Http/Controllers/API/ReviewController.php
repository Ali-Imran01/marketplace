<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Transaction;
use App\Enums\TransactionStatus;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        // Get reviews for a specific item if item_id is provided
        $query = Review::query();
        if ($request->has('item_id')) {
            $query->whereHas('transaction', function ($q) use ($request) {
                $q->where('item_id', $request->item_id);
            });
        }
        
        return response()->json($query->with('transaction.buyer')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);

        // Only buyer can review
        $userId = $request->user()->id;
        if ($transaction->buyer_id != $userId) {
            return response()->json(['message' => 'Only the buyer can leave a review'], 403);
        }

        // Only completed transactions can be reviewed
        if ($transaction->status !== TransactionStatus::COMPLETED) {
            return response()->json(['message' => 'Transaction must be completed to leave a review'], 422);
        }

        // Check if review already exists
        if (Review::where('transaction_id', $transaction->id)->exists()) {
            return response()->json(['message' => 'You have already reviewed this transaction'], 422);
        }

        $review = Review::create($validated);

        return response()->json($review, 201);
    }
}
