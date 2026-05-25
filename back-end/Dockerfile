FROM php:8.4-cli-alpine AS base

RUN apk add --no-cache git unzip libzip libpng oniguruma libxml2 sqlite-libs \
      libjpeg-turbo freetype \
    && apk add --no-cache --virtual .build-deps \
      libzip-dev libpng-dev oniguruma-dev libxml2-dev sqlite-dev \
      libjpeg-turbo-dev freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
      pdo_mysql pdo_sqlite zip bcmath gd exif pcntl \
    && apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

FROM base AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --optimize-autoloader

FROM base AS runner

WORKDIR /app

COPY --from=vendor /app/vendor ./vendor

COPY . .

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
