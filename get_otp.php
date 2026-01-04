<?php
include 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'aliimranrohaizi.air@gmail.com')->first();
if ($user) {
    echo "OTP_CODE:" . $user->otp_code . "\n";
} else {
    echo "USER_NOT_FOUND\n";
}
