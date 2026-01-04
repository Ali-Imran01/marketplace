<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
echo "Category Count: " . Category::count() . "\n";
foreach (Category::all() as $cat) {
    echo "- " . $cat->name . "\n";
}
