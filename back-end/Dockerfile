FROM php:8.4-cli-bookworm AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      git unzip libzip4 libpng16-16 libonig5 libxml2 libsqlite3-0 \
      libjpeg62-turbo libfreetype6 \
    && apt-get install -y --no-install-recommends \
      git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
      libsqlite3-dev libjpeg62-turbo-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
      pdo_mysql pdo_sqlite zip bcmath gd exif pcntl \
    && apt-get purge -y --auto-remove \
      libzip-dev libpng-dev libonig-dev libxml2-dev libsqlite3-dev \
      libjpeg62-turbo-dev libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2.8.8 /usr/bin/composer /usr/bin/composer

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
