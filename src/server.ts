import { buildApp } from './app.js';

const start = async () => {
  try {
    const app = await buildApp();

    const port = Number(process.env.PORT) || 10000;

    await app.listen({
      port,
      host: '0.0.0.0'
    });

    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.error('Application failed to start');
    console.error(error);
    process.exit(1);
  }
};

start();
