<?php
$host = '127.0.0.1';
$db   = 'marketplace';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
try {
     $pdo = new PDO($dsn, $user, $pass);
     echo "Connected to DB successfully!\n";
     $stmt = $pdo->query('SELECT count(*) FROM categories');
     echo "Categories count: " . $stmt->fetchColumn();
} catch (\PDOException $e) {
     echo "Connection failed: " . $e->getMessage();
}
