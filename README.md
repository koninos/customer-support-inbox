# Customer Support Inbox

A full-stack customer support inbox built with **Next.js, TypeScript, PostgreSQL, and TanStack Query**.

The project simulates a customer support system with separate **Agent** and **Customer** portals. It was built as a practical project for exploring frontend architecture, API design, database interactions, server/client boundaries, data fetching, caching, mutations, validation, and testing.

## Features

### Agent Portal

- View the customer support conversation inbox.
- View conversations and their messages.
- Send replies as an agent.
- Automatically refresh conversation data after sending a message.

### Customer Portal

- Select a customer.
- View that customer's conversations.
- Open and read individual conversations.
- Reply to existing conversations.
- Create a new conversation with an initial message.
- Automatically refresh the conversation list after creating a conversation or sending a message.

## Architecture

The application follows a feature-oriented frontend structure with a clear separation between the UI, data-fetching layer, API routes, and database.

```
React UI
   ↓
TanStack Query
   ↓
API client
   ↓
Next.js API routes
   ↓
PostgreSQL
```

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Sass / CSS Modules
- TanStack Query

### Backend

- Next.js API Routes
- PostgreSQL
- SQL

### Validation

- Zod

### Testing

- Vitest
- React Testing Library
- MSW
- JSDOM

## API

The frontend communicates with the backend through REST-style API endpoints.

### Conversations

```
GET  /api/conversations
GET  /api/conversations/:id
POST /api/conversations/:id/messages
```

### Customers

```
GET  /api/customers
GET  /api/customers/:id/conversations
```

### Customer conversations

```
POST /api/customers/conversations
POST /api/customers/conversations/:id/messages
```

## Local Development

### Prerequisites

- Node.js
- npm
- Docker

### 1. Clone the repository

```
git clone https://github.com/koninos/customer-support-inbox.git
cd customer-support-inbox
```

### 2. Install dependencies

`npm install`

### 3. Start PostgreSQL

The project includes a Docker Compose configuration for the PostgreSQL database.

Start the database with:

```
docker compose up -d
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

`DATABASE_URL=postgresql://support:support@localhost:5432/customer_support`

### 5. Run database migrations

The project includes SQL migrations for creating the database schema and inserting development data:

```text
migrations/
├── 001_create_customers.sql
├── 002_create_conversations.sql
├── 003_create_messages.sql
└── 004_seed_data.sql
```

Run:

`npm run migrate`

This executes the migrations in order and prepares the database with the required schema and sample data.

### 6. Start the development server

`npm run dev`

The application will be available at:

`http://localhost:3000`

The frontend and backend run together through Next.js. API requests are handled by the application's Next.js API routes.

### 7. Run tests

Run Vitest in watch mode:

`npm run test`

Run the test suite once:

`npm run test:run`

The tests use MSW to mock HTTP requests, so a running PostgreSQL database is not required to execute the test suite.

### 8. Build the application

`npm run build`
