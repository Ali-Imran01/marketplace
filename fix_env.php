<?php
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    die(".env not found");
}

$content = file_get_contents($envPath);

// Standard Laravel 9+
$content = preg_replace('/^MAIL_MAILER=.*$/m', 'MAIL_MAILER=log', $content);
// Legacy or secondary
$content = preg_replace('/^MAIL_DRIVER=.*$/m', 'MAIL_DRIVER=log', $content);

// Force host to null just in case
$content = preg_replace('/^MAIL_HOST=.*$/m', 'MAIL_HOST=127.0.0.1', $content);

file_put_contents($envPath, $content);
echo "Updated .env successfully\n";
