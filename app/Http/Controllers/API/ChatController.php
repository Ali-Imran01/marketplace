<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Transaction;
use App\Notifications\MessageReceived;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        
        // Get all conversations (last message per transaction/user)
        // For simplicity, we'll return all unique contact users
        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver', 'transaction.item'])
            ->latest()
            ->get();

        return response()->json($messages);
    }

    public function getChat(Request $request, $transactionId)
    {
        $userId = $request->user()->id;
        $transaction = Transaction::with(['item', 'seller', 'buyer'])->findOrFail($transactionId);

        if ($transaction->buyer_id != $userId && $transaction->seller_id != $userId) {
            abort(403);
        }

        $messages = Message::where('transaction_id', $transactionId)
            ->with(['sender', 'receiver'])
            ->oldest()
            ->get();

        return response()->json([
            'messages' => $messages,
            'buyer_id' => $transaction->buyer_id,
            'seller_id' => $transaction->seller_id,
            'transaction' => $transaction,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $userId = $request->user()->id;
        $transaction = Transaction::findOrFail($validated['transaction_id']);

        // Verify user is part of transaction
        if ($transaction->buyer_id != $userId && $transaction->seller_id != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'sender_id' => $userId,
            'receiver_id' => $validated['receiver_id'],
            'transaction_id' => $validated['transaction_id'],
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        $message->receiver->notify(new MessageReceived($message));

        // Trigger real-time event
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        return response()->json($message->load(['sender', 'receiver']));
    }

    public function markAsRead($messageId)
    {
        $message = Message::findOrFail($messageId);
        if ($message->receiver_id == auth()->id()) {
            $message->update(['is_read' => true]);
        }
        return response()->json(['message' => 'Updated']);
    }
}
