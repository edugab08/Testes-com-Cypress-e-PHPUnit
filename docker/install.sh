#!/usr/bin/env sh
set -eu
cp -n .env.example .env || true
docker compose build
docker compose run --rm app php artisan key:generate --force
docker compose run --rm app php artisan migrate:fresh --seed --force
echo "Instalação concluída. Execute ./docker/start.sh e acesse http://localhost:8000"
