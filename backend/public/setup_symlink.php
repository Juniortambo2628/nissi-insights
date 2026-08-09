<?php

/**
 * Storage Symlink Setup Script
 *
 * Upload this to /public_html/api/ and visit it in your browser:
 * https://api.nissi-insights.com/setup_symlink.php
 *
 * DELETE THIS FILE AFTER RUNNING IT.
 */

// Security: Only run from browser with a secret token
$secret = 'nissi-setup-2026';
if (! isset($_GET['token']) || $_GET['token'] !== $secret) {
    exit('Access denied. Use: ?token='.$secret);
}

echo "<h2>Nissi Insights - Storage Symlink Setup</h2><pre>\n";

$basePath = '/home/viafgsed/nissi-insights-core';
$publicPath = '/home/viafgsed/public_html/api';

// 1. Remove existing storage symlink/directory if present
$storageLinkPath = $publicPath.'/storage';

if (is_link($storageLinkPath)) {
    echo "Removing existing symlink at: $storageLinkPath\n";
    unlink($storageLinkPath);
    echo "✓ Old symlink removed.\n\n";
} elseif (is_dir($storageLinkPath)) {
    echo "WARNING: $storageLinkPath is a real directory, not a symlink.\n";
    echo "Please manually rename or remove it via File Manager first.\n\n";
}

// 2. Ensure the storage/app/public directory exists
$targetPath = $basePath.'/storage/app/public';

if (! is_dir($targetPath)) {
    echo "Creating directory: $targetPath\n";
    mkdir($targetPath, 0755, true);
    echo "✓ Directory created.\n\n";
} else {
    echo "✓ Target directory exists: $targetPath\n\n";
}

// 3. Create the symlink
echo "Creating symlink:\n";
echo "  Link: $storageLinkPath\n";
echo "  Target: $targetPath\n\n";

if (symlink($targetPath, $storageLinkPath)) {
    echo "✅ Storage symlink created successfully!\n\n";
} else {
    echo '❌ Failed to create symlink. Error: '.error_get_last()['message']."\n\n";
}

// 4. Verify the symlink
if (is_link($storageLinkPath)) {
    $resolvedTarget = readlink($storageLinkPath);
    echo "Verification:\n";
    echo "  Symlink exists: ✓\n";
    echo "  Points to: $resolvedTarget\n";
    echo '  Target is readable: '.(is_readable($targetPath) ? '✓' : '✗')."\n";
} else {
    echo "Verification: ✗ Symlink not found.\n";
}

// 5. Also run artisan commands via PHP if possible
echo "\n\n--- Running Cache Clear ---\n";
$artisan = $basePath.'/artisan';
if (file_exists($artisan)) {
    chdir($basePath);
    echo shell_exec('php artisan config:clear 2>&1')."\n";
    echo shell_exec('php artisan cache:clear 2>&1')."\n";
    echo shell_exec('php artisan route:clear 2>&1')."\n";
    echo "✓ Caches cleared.\n";
} else {
    echo "Artisan not found at: $artisan\n";
}

echo "\n\n⚠️  DELETE THIS FILE after running it!\n";
echo '</pre>';
