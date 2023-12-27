# API Rate Limiter

## Overview

This Node.js application demonstrates a basic API rate limiter using Express and Redis. It includes middleware for system-wide, client-specific, and monthly quota rate limiting.

## Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Redis](https://redis.io/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/drayzii/api-rate-limiter.git
cd api-rate-limiter
```

2. Install dependencies

```bash
npm install
```

### Configuration

Create a `.env` file in the project root and set your environment variables:

```env
PORT=
CLIENT_LIMIT_PER_MINUTE=
CLIENT_MONTHLY_LIMIT=
SYSTEM_LIMIT_PER_MINUTE=
```

### Running the App

Start the server:

```bash
npm start
```

The server will run at `http://localhost:3000` (or the specified PORT).

### Running Tests

Run tests:

```bash
npm test
```

## API Routes

### GET /test

- **Description**: Test route to check the functionality.
- **Parameter**:
    - `id`: Client ID for rate limiting. Example: `/test?id=123`

## Rate Limiting

- The application implements rate limiting for system-wide, client-specific, and monthly quotas. The configured limits can be found in the `.env` file.
- **We can connect to a centralised Redis server to ensure that all instances of our application share the same rate limit counters.**
