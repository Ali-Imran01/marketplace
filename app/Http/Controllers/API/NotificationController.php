<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'notifications' => $request->user()->unreadNotifications()->paginate(10),
            'unread_count' => $request->user()->unreadNotifications()->count()
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function destroy(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification deleted']);
    }

    public function markTransactionRead(Request $request, $transactionId)
    {
        $user = $request->user();
        
        // 1. Mark system notifications for this transaction as read
        $user->unreadNotifications
            ->filter(function($notification) use ($transactionId) {
                return isset($notification->data['transaction_id']) && 
                       $notification->data['transaction_id'] == $transactionId;
            })
            ->each->markAsRead();

        // 2. Mark chat messages in this transaction as read
        \App\Models\Message::where('transaction_id', $transactionId)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Transaction notifications marked as read']);
    }
}
