<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Item;
use App\Models\Category;
use Illuminate\Support\Str;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'seller@marketplace.com')->first();
        if (!$user) return;

        $categories = Category::all();
        if ($categories->isEmpty()) return;

        $conditions = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'];
        
        $titles = [
            'Mechanical Keyboard', 'Gaming Mouse', '27 inch Monitor', 'Desk Lamp',
            'Noise Cancelling Headphones', 'USB-C Hub', 'Ergonomic Chair', 'Laptop Stand',
            'Webcam 1080p', 'Microphone Boom Arm', 'Wireless Charger', 'Cable Organizer',
            'Action Camera', 'Bluetooth Speaker', 'External SSD 1TB', 'Power Bank',
            'Smart Watch', 'Phone Tripod', 'Graphic Tablet', 'Coffee Grinder',
            'Electric Kettle', 'Air Purifier', 'Yoga Mat', 'Resistance Bands',
            'Backpack', 'Minimalist Wallet', 'Notebook Set', 'Desk Pad',
            'LED Strip Lights', 'Portable Fan'
        ];

        foreach ($titles as $index => $title) {
            Item::create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
                'title' => $title,
                'description' => "This is a high-quality " . strtolower($title) . ". Well maintained and works perfectly. Great for everyday use.",
                'condition' => $conditions[array_rand($conditions)],
                'price' => rand(50, 2000),
                'status' => 'AVAILABLE',
            ]);
        }
    }
}
