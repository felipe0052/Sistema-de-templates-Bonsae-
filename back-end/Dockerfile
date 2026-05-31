FROM dunglas/frankenphp:8.4-alpine

RUN install-php-extensions pdo_mysql zip gd bcmath exif pcntl opcache intl

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY . .

COPY start.sh /start.sh
RUN chmod +x /start.sh

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

RUN chown -R unit:unit /app/storage /app/bootstrap/cache

EXPOSE 8080

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
