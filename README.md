Website Analytics Backend

This is a Node.js backend API for a Website Analytics platform. It allows clients to collect analytics events (clicks, visits, referrer info, device details) and provides endpoints for API key management, event aggregation, and reporting.

The backend supports email-based registration or Google OAuth login for onboarding users.

🔹 Features

User onboarding using Google OAuth or email registration

App registration with API key generation

API key management: get, revoke, regenerate

Event collection endpoint with authentication using API key

Analytics endpoints: event summary, user stats

Redis caching for faster analytics queries

PostgreSQL for storing users, apps, and events

Dockerized for easy deployment

💻 Tech Stack

Node.js (Express)

PostgreSQL (via Prisma ORM)

Redis (caching)

JWT (authentication)

Docker (containerization)

Google OAuth for login

Postman for API testing


1. Clone Repository
git clone https://github.com/your-username/website-analytics-backend.git
cd website-analytics-backend

2. Install Dependencies
npm install

3. Create .env File

Example:

PORT=4000
NODE_ENV=development
API_KEY_LENGTH=32
DATABASE_URL=postgresql://username:password@localhost:5432/analytics_db
REDIS_URL=redis://localhost:6379
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX=300
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID

4. Setup Database
npx prisma migrate dev --name init
npx prisma generate

5. Start Server
npm run dev   # for development with nodemon
# or
npm start     # for production


Server should be running at:

http://localhost:3000