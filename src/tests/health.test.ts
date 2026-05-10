
import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';

describe('Health API', () => {
  it('should return ok', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);

    expect(body.status).toBe('ok');
  });
});
