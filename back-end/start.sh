#!/bin/sh
set -e

php artisan storage:link --force >/dev/null 2>&1 || true
php artisan migrate --seed --force

if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

exec frankenphp run --config /etc/frankenphp/Caddyfile
