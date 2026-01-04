<?php
include 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'aliimranrohaizi.air@gmail.com')->first();
if ($user) {
    file_put_contents('current_otp.txt', $user->otp_code);
} else {
    file_put_contents('current_otp.txt', 'USER_NOT_FOUND');
}
