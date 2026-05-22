#!/bin/bash
set -e

touch database/database.sqlite

# NOTA: Se migrar para MySQL no futuro:
# 1. Provisionar um serviço MySQL no Railway e vincular ao serviço
# 2. Adicionar DB_CONNECTION=mysql e demais variáveis de ambiente
# 3. Remover o 'touch database/database.sqlite' acima
# 4. O --seed é seguro porque o DatabaseSeeder usa updateOrInsert

php artisan migrate --seed --force

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
