<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $otp = random_int(100000, 999999);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'user',
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(4),
            'otp_attempts' => 0,
        ]);

        try {
            Mail::to($user->email)->send(new OtpMail($otp));
        } catch (\Exception $e) {
            \Log::error("Registration mail failure: " . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new \App\Http\Resources\UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
            'debug_otp' => config('app.env') === 'local' ? $otp : null,
            'requires_verification' => true,
            'message' => 'Registration successful. Please verify your email with the OTP sent.'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if (now()->isAfter($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP expired'], 422);
        }

        if ($user->otp_attempts >= 5) {
            return response()->json(['message' => 'Too many attempts. Please resend OTP.'], 429);
        }

        if ($user->otp_code !== $request->otp) {
            $user->increment('otp_attempts');
            return response()->json(['message' => 'Invalid OTP'], 422);
        }

        $user->email_verified_at = now();
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->otp_attempts = 0;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully.',
            'user' => new \App\Http\Resources\UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
            'requires_verification' => false,
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Cooldown: 60 seconds
        if ($user->otp_sent_at && now()->diffInSeconds($user->otp_sent_at) < 60) {
            return response()->json([
                'message' => 'Please wait before resending OTP.'
            ], 429);
        }

        $otp = random_int(100000, 999999);

        $user->update([
            'otp_code'        => $otp,
            'otp_expires_at'  => now()->addMinutes(4),
            'otp_attempts'   => 0,
            'otp_sent_at'    => now(),
        ]);

        try {
            Mail::to($user->email)->send(new OtpMail($otp));
        } catch (\Exception $e) {
            \Log::error("Resend mail failure: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'A new OTP has been sent to your email.',
            'debug_otp' => config('app.env') === 'local' ? $otp : null,
        ]);
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new \App\Http\Resources\UserResource($user),
            'requires_verification' => !$user->email_verified_at,
            'debug_otp' => (config('app.env') === 'local' && !$user->email_verified_at) ? $user->otp_code : null,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function me(Request $request)
    {
        return new \App\Http\Resources\UserResource($request->user());
    }
}
