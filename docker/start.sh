#!/usr/bin/env sh
set -eu
docker compose up -d
echo "Aplicação disponível em http://localhost:8000"
