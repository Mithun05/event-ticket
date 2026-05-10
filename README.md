# Event Ticketing API

A simple Event Ticketing REST API built using Node.js, TypeScript, Fastify, Prisma ORM, and PostgreSQL.

---

# Functional Flows Supported

## 1. Venue Management
- Create venue
- Store venue capacity and address
- Associate events with venues

## 2. Event Management
- Create event
- Update event
- Delete event
- Fetch all events
- Fetch event by ID

## 3. Ticket Management
- Create tickets for events
- Configure ticket inventory
- Configure ticket pricing
- Retrieve tickets for an event

## 4. Ticket Reservation
- Reserve tickets
- Validate ticket inventory
- Reduce available inventory
- Create reservation order

## 5. Ticket Purchase
- Purchase tickets
- Validate availability
- Create purchased order
- Calculate total order amount

## 6. Order Management
- Retrieve order details
- View associated ticket information

## 7. Health Monitoring
- Health check endpoint
- Database connectivity validation

---

# API Endpoints

## Health APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Application and database health check |

---

## Venue APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/venues` | Create venue |

---

## Event APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/events` | Create event |
| GET | `/events` | Get all events |
| GET | `/events/:id` | Get event by ID |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |

---

## Ticket APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tickets` | Create ticket |
| GET | `/events/:eventId/tickets` | Get tickets for an event |

---

## Order APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/reserve` | Reserve tickets |
| POST | `/orders/purchase` | Purchase tickets |
| GET | `/orders/:id` | Get order details |

---

# Database Tables / Core Entities

| Entity | Purpose |
|---|---|
| Venue | Stores venue information |
| Event | Stores event details |
| Ticket | Stores ticket inventory and pricing |
| Order | Stores reservations and purchases |

---

# Technologies Used

## Backend

- Node.js 22+
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- Swagger / OpenAPI
- Docker

---

## Deployment

- Render
- GitHub

---

# Swagger URL

```text
https://YOUR_RENDER_APP.onrender.com/docs
```

Example:

```text
https://event-ticketing-api.onrender.com/docs
```

---

# Features Included

| Feature | Status |
|---|---|
| CRUD APIs | ✅ |
| PostgreSQL Integration | ✅ |
| Prisma ORM | ✅ |
| Swagger/OpenAPI | ✅ |
| Docker Support | ✅ |
| Render Deployment | ✅ |
| Request Validation | ✅ |
| JSON APIs | ✅ |
| Health Checks | ✅ |

---

# Architecture

```text
Client
   |
   v
Render Web Service
   |
   v
Fastify REST API
   |
   v
Prisma ORM
   |
   v
PostgreSQL Database
```

---

# Local Development

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create `.env`:

```env
DATABASE_URL="YOUR_POSTGRES_CONNECTION_URL"
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Push Prisma Schema

```bash
npx prisma db push
```

---

## Run Development Server

```bash
npm run dev
```

---

# Docker Commands

## Build Docker Image

```bash
docker build -t event-ticketing-api .
```

---

## Run Docker Container

```bash
docker run -p 3000:3000 event-ticketing-api
```

---

# Deployment

The application is deployed on Render using:
- Docker deployment
- PostgreSQL database
- GitHub auto deployments

---

# Example Health Check Response

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

# License

MIT
