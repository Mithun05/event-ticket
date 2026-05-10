import Fastify from 'fastify';
import { prisma } from './prisma.js';
import { registerSwagger } from './swagger.js';

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await registerSwagger(app);

  app.get('/', async () => {
    return {
      message: 'Event Ticketing API Running'
    };
  });

  app.get('/health', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        database: 'connected'
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected'
      };
    }
  });

  // CREATE VENUE
  app.post('/venues', async (request, reply) => {
    const body = request.body as any;

    const venue = await prisma.venue.create({
      data: {
        name: body.name,
        address: body.address,
        capacity: body.capacity
      }
    });

    return reply.code(201).send(venue);
  });

  // CREATE EVENT
  app.post('/events', async (request, reply) => {
    const body = request.body as any;

    const event = await prisma.event.create({
      data: {
        venueId: body.venueId,
        name: body.name,
        description: body.description,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime)
      }
    });

    return reply.code(201).send(event);
  });

  // GET EVENTS
  app.get('/events', async () => {
    return prisma.event.findMany({
      include: {
        venue: true,
        tickets: true
      }
    });
  });

  // GET EVENT BY ID
  app.get('/events/:id', async (request, reply) => {
    const { id } = request.params as any;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        tickets: true
      }
    });

    if (!event) {
      return reply.code(404).send({
        message: 'Event not found'
      });
    }

    return event;
  });

  // UPDATE EVENT
  app.put('/events/:id', async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;

    const event = await prisma.event.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description
      }
    });

    return reply.send(event);
  });

  // DELETE EVENT
  app.delete('/events/:id', async (request, reply) => {
    const { id } = request.params as any;

    await prisma.event.delete({
      where: { id }
    });

    return reply.code(204).send();
  });

  // CREATE TICKET
  app.post('/tickets', async (request, reply) => {
    const body = request.body as any;

    const ticket = await prisma.ticket.create({
      data: {
        eventId: body.eventId,
        ticketType: body.ticketType,
        price: body.price,
        totalQuantity: body.totalQuantity,
        availableQuantity: body.availableQuantity
      }
    });

    return reply.code(201).send(ticket);
  });

  // GET EVENT TICKETS
  app.get('/events/:eventId/tickets', async (request) => {
    const { eventId } = request.params as any;

    return prisma.ticket.findMany({
      where: {
        eventId
      }
    });
  });

  // RESERVE TICKET
  app.post('/orders/reserve', async (request, reply) => {
    const body = request.body as any;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: body.ticketId
      }
    });

    if (!ticket) {
      return reply.code(404).send({
        message: 'Ticket not found'
      });
    }

    if (ticket.availableQuantity < body.quantity) {
      return reply.code(400).send({
        message: 'Insufficient inventory'
      });
    }

    await prisma.ticket.update({
      where: {
        id: ticket.id
      },
      data: {
        availableQuantity:
          ticket.availableQuantity - body.quantity
      }
    });

    const order = await prisma.order.create({
      data: {
        ticketId: body.ticketId,
        customerEmail: body.customerEmail,
        quantity: body.quantity,
        totalAmount:
          Number(ticket.price) * body.quantity,
        status: 'RESERVED'
      }
    });

    return reply.code(201).send(order);
  });

  // PURCHASE TICKET
  app.post('/orders/purchase', async (request, reply) => {
    const body = request.body as any;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: body.ticketId
      }
    });

    if (!ticket) {
      return reply.code(404).send({
        message: 'Ticket not found'
      });
    }

    if (ticket.availableQuantity < body.quantity) {
      return reply.code(400).send({
        message: 'Insufficient inventory'
      });
    }

    await prisma.ticket.update({
      where: {
        id: ticket.id
      },
      data: {
        availableQuantity:
          ticket.availableQuantity - body.quantity
      }
    });

    const order = await prisma.order.create({
      data: {
        ticketId: body.ticketId,
        customerEmail: body.customerEmail,
        quantity: body.quantity,
        totalAmount:
          Number(ticket.price) * body.quantity,
        status: 'PURCHASED'
      }
    });

    return reply.code(201).send(order);
  });

  // GET ORDER
  app.get('/orders/:id', async (request, reply) => {
    const { id } = request.params as any;

    const order = await prisma.order.findUnique({
      where: {
        id
      },
      include: {
        ticket: true
      }
    });

    if (!order) {
      return reply.code(404).send({
        message: 'Order not found'
      });
    }

    return order;
  });

  return app;
}
