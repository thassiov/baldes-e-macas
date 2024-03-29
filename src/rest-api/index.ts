import express from 'express';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

import { configs } from '../utils/configs';
import { logger } from '../utils/logger';
import { Services } from '../utils/types';
import { setRouter } from './routers';

const api = express();

api.use(express.json());
api.use(express.urlencoded());
api.use(pinoHttp());

async function startApi(services: Services): Promise<void> {
  const router = setRouter(services);
  api.use('/api/v1', router);

  const path = resolve('openapi-spec.yaml');
  const file = await readFile(path, 'utf8');
  const swaggerDocument = yaml.parse(file);
  api.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  api.listen(configs.API_PORT, () => {
    const endereco = `http://0.0.0.0:${configs.API_PORT}`;
    logger.info(`API REST iniciada no endereco ${endereco}/api/v1`);
    logger.info(
      `Para acessar a documentacao da API, acesse ${endereco}/api-docs`
    );
  });
}

export { startApi };
