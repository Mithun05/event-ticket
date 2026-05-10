import Fastify from 'fastify';
import { registerSwagger } from './swagger.js';

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  // Swagger
  await registerSwagger(app);

  // Root API
  app.get('/', async () => {
    return {
      message: 'Event Ticketing API Running'
    };
  });

  // Health API
  app.get('/health', async () => {
    return {
      status: 'ok'
    };
  });

  return app;
}
