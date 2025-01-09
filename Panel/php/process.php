<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require_once '../db/db-config.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'create') {
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');
    $stmt = $pdo->prepare("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)");
    echo $stmt->execute([$name, $email, $phone]) ? "success" : "error";
} elseif ($action === 'read') {
    $stmt = $pdo->prepare("SELECT * FROM users");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($action === 'update') {
    $id = $_POST['id'];
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?");
    echo $stmt->execute([$name, $email, $phone, $id]) ? "success" : "error";
} elseif ($action === 'delete') {
    $id = $_POST['id'];
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    echo $stmt->execute([$id]) ? "success" : "error";
}
