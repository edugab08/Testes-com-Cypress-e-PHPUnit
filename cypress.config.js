// Exercício 1 (baseUrl) e Exercício 20 (task resetDb).
// O package.json do projeto usa "type": "module", então o arquivo de configuração é ESM.
import { defineConfig } from 'cypress';
import { execSync } from 'node:child_process';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    video: false,
    setupNodeEvents(on) {
      on('task', {
        // Recria o banco e roda o seeder dentro do container da aplicação.
        // Executa a partir da raiz do projeto, onde está o docker-compose.yml.
        resetDb() {
          execSync('docker compose exec -T app php artisan migrate:fresh --seed --force', {
            stdio: 'inherit',
          });
          return null; // tasks precisam retornar um valor (null é aceito)
        },
      });
    },
  },
});
