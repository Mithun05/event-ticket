import Fastify from 'fastify';
import { prisma } from './prisma.js';
import { registerSwagger } from './swagger.js';

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await registerSwagger(app);

  // ROOT
  app.get('/', async () => {
    return {
      message: 'Event Ticketing API Running'
    };
  });

  // HEALTH
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
  app.post(
    '/venues',
    {
      schema: {
        tags: ['Venues'],
        body: {
          type: 'object',
          required: ['name', 'address', 'capacity'],
          properties: {
            name: {
              type: 'string'
            },
            address: {
              type: 'string'
            },
            capacity: {
              type: 'number'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        address: string;
        capacity: number;
      };

      const venue = await prisma.venue.create({
        data: {
          name: body.name,
          address: body.address,
          capacity: body.capacity
        }
      });

      return reply.code(201).send(venue);
    }
  );

  // CREATE EVENT
  app.post(
    '/events',
    {
      schema: {
        tags: ['Events'],
        body: {
          type: 'object',
          required: [
            'venueId',
            'name',
            'description',
            'startTime',
            'endTime'
          ],
          properties: {
            venueId: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            startTime: {
              type: 'string'
            },
            endTime: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        venueId: string;
        name: string;
        description: string;
        startTime: string;
        endTime: string;
      };

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
    }
  );

  // GET EVENTS
  app.get(
    '/events',
    {
      schema: {
        tags: ['Events']
      }
    },
    async () => {
      return prisma.event.findMany({
        include: {
          venue: true,
          tickets: true
        }
      });
    }
  );

  // GET EVENT BY ID
  app.get(
    '/events/:id',
    {
      schema: {
        tags: ['Events'],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id']
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      const event = await prisma.event.findUnique({
        where: {
          id
        },
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
    }
  );

  // UPDATE EVENT
  app.put(
    '/events/:id',
    {
      schema: {
        tags: ['Events'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string'
            }
          }
        },
        body: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      const body = request.body as {
        name: string;
        description: string;
      };

      const event = await prisma.event.update({
        where: {
          id
        },
        data: {
          name: body.name,
          description: body.description
        }
      });

      return reply.send(event);
    }
  );

  // DELETE EVENT
  app.delete(
    '/events/:id',
    {
      schema: {
        tags: ['Events'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      await prisma.event.delete({
        where: {
          id
        }
      });

      return reply.code(204).send();
    }
  );

  // CREATE TICKET
  app.post(
    '/tickets',
    {
      schema: {
        tags: ['Tickets'],
        body: {
          type: 'object',
          required: [
            'eventId',
            'ticketType',
            'price',
            'totalQuantity',
            'availableQuantity'
          ],
          properties: {
            eventId: {
              type: 'string'
            },
            ticketType: {
              type: 'string'
            },
            price: {
              type: 'number'
            },
            totalQuantity: {
              type: 'number'
            },
            availableQuantity: {
              type: 'number'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        eventId: string;
        ticketType: string;
        price: number;
        totalQuantity: number;
        availableQuantity: number;
      };

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
    }
  );

  // GET EVENT TICKETS
  app.get(
    '/events/:eventId/tickets',
    {
      schema: {
        tags: ['Tickets'],
        params: {
          type: 'object',
          required: ['eventId'],
          properties: {
            eventId: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request) => {
      const { eventId } = request.params as {
        eventId: string;
      };

      return prisma.ticket.findMany({
        where: {
          eventId
        }
      });
    }
  );

  // RESERVE TICKET
  app.post(
    '/orders/reserve',
    {
      schema: {
        tags: ['Orders'],
        body: {
          type: 'object',
          required: [
            'ticketId',
            'customerEmail',
            'quantity'
          ],
          properties: {
            ticketId: {
              type: 'string'
            },
            customerEmail: {
              type: 'string'
            },
            quantity: {
              type: 'number'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        ticketId: string;
        customerEmail: string;
        quantity: number;
      };

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
    }
  );

  // PURCHASE TICKET
  app.post(
    '/orders/purchase',
    {
      schema: {
        tags: ['Orders'],
        body: {
          type: 'object',
          required: [
            'ticketId',
            'customerEmail',
            'quantity'
          ],
          properties: {
            ticketId: {
              type: 'string'
            },
            customerEmail: {
              type: 'string'
            },
            quantity: {
              type: 'number'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        ticketId: string;
        customerEmail: string;
        quantity: number;
      };

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
    }
  );

  // GET ORDER
  app.get(
    '/orders/:id',
    {
      schema: {
        tags: ['Orders'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

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
    }
  );

  return app;
}
