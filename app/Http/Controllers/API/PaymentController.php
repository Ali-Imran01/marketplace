<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Payment;
use App\Services\OrderStateService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    protected $orderService;

    public function __construct(OrderStateService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Simulate creating a payment intent/session.
     */
    public function checkout(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        if ($transaction->status->value !== 'ACCEPTED') {
            return response()->json(['message' => 'Payment only possible for accepted offers.'], 422);
        }

        // Check if payment already exists/is paid
        if ($transaction->payments()->where('status', 'PAID')->exists()) {
            return response()->json(['message' => 'Order already paid.'], 422);
        }

        $payment = Payment::create([
            'transaction_id' => $transaction->id,
            'amount' => $transaction->offered_price,
            'status' => 'PENDING',
            'external_id' => 'mock_' . Str::random(10),
        ]);

        return response()->json([
            'message' => 'Checkout session created',
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
            'redirect_url' => '/mock-payment/' . $payment->id // Mock frontend route
        ]);
    }

    /**
     * Simulate a callback/webhook from a payment provider.
     */
    public function callback(Request $request, Payment $payment)
    {
        // In a real app, we would verify a signature here.
        
        $status = $request->input('status', 'success');

        if ($status === 'success') {
            $payment->update(['status' => 'PAID']);
            
            // Advance the order state to SHIPPED or similar (per project logic)
            // For simplicity, let's keep it at ACCEPTED but log it.
            // Or advance to a new status if required by state machine.
            $this->orderService->transition(
                $payment->transaction, 
                'SHIPPED', 
                "Payment received via {$payment->payment_method}. Marked as SHIPPED automatically."
            );

            return response()->json(['message' => 'Payment successful and order advanced.']);
        }

        $payment->update(['status' => 'FAILED']);
        return response()->json(['message' => 'Payment failed.'], 400);
    }
}
