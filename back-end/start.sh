#!/bin/sh
set -e

if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-interaction --no-progress
fi

php artisan storage:link --force >/dev/null 2>&1 || true
php artisan migrate --seed --force

if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

frankenphp run --config /etc/frankenphp/Caddyfile
