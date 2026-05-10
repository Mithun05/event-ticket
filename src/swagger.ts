
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Event Ticketing API',
        version: '1.0.0'
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs'
  });
}
