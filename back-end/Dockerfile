FROM dunglas/frankenphp:1-php8.4-alpine

RUN install-php-extensions pdo_mysql zip gd bcmath exif pcntl opcache intl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY . .

COPY start.sh /start.sh
RUN chmod +x /start.sh

COPY Caddyfile /etc/frankenphp/Caddyfile

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

RUN chown -R nobody:nobody /app/storage /app/bootstrap/cache

EXPOSE 8080

CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]
