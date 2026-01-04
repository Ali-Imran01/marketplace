<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function __construct()
    {
        // We'll add a custom middleware check here later or in the route group
    }

    // User Management
    public function users()
    {
        return response()->json(User::where('role', '!=', 'admin')->latest()->get());
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|string|in:user,admin',
        ]);

        $oldRole = $user->role;
        $user->update($validated);

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'actor_name' => auth()->user()->name,
            'actor_role' => auth()->user()->role,
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'action' => 'user_updated',
            'description' => "Admin updated user {$user->name}. Role changed from $oldRole to {$user->role}.",
            'properties' => ['old_role' => $oldRole, 'new_role' => $user->role],
        ]);

        return response()->json($user);
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete an admin'], 403);
        }

        $userId = $user->id;
        $userName = $user->name;
        $user->delete();

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'actor_name' => auth()->user()->name,
            'actor_role' => auth()->user()->role,
            'entity_type' => 'User',
            'entity_id' => $userId,
            'action' => 'user_deleted',
            'description' => "Admin deleted user $userName (ID: $userId).",
        ]);

        return response()->json(['message' => 'User deleted successfully']);
    }

    // Listing Management
    public function items()
    {
        return response()->json(Item::with(['user', 'category'])->latest()->get());
    }

    public function deleteItem(Item $item)
    {
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
            'description' => "Admin deleted item '$itemTitle' (ID: $itemId).",
        ]);

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
