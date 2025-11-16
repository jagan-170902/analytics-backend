Website Analytics Backend

This is a Node.js backend API for a Website Analytics platform. It allows clients to collect analytics events (clicks, visits, referrer info, device details) and provides endpoints for API key management, event aggregation, and reporting.

The backend supports email-based registration or Google OAuth login for onboarding users.

🔹 Features:

User onboarding using Google OAuth or email registration

App registration with API key generation

API key management: get, revoke, regenerate

Event collection endpoint with authentication using API key

Analytics endpoints: event summary, user stats

Redis caching for faster analytics queries

PostgreSQL for storing users, apps, and events

Dockerized for easy deployment

💻 Tech Stack:

Node.js (Express)

PostgreSQL (via Prisma ORM)

Redis (caching)

JWT (authentication)

Docker (containerization)

Google OAuth for login

Postman for API testing

📡 API Usage (with sample cURL commands):

Below are real working examples showing how to call each endpoint.

🔐 AUTH & APP MANAGEMENT
1. Register an App

Use this to create a new app and generate an API key.

Request
curl --location 'https://websites-insight.netlify.app/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "ABC",
  "email": "abc@gmail.com"
}'

2. Get API Key (by App ID)
curl --location 'https://websites-insight.netlify.app/api/auth/api-key?appId=cmi0c6wtj0000qegomm5knz4r' \
--data ''

3. Revoke API Key
curl --location 'https://websites-insight.netlify.app/api/auth/revoke' \
--header 'Content-Type: application/json' \
--data '{
    "apiKey": "9dc99c3b42b1f78d8355c333b4aa69024f6f7e8decfc316b38478e3bb81b7d16"
}'

4. Regenerate API Key
curl --location 'https://websites-insight.netlify.app/api/auth/regenerate' \
--header 'Content-Type: application/json' \
--data '{
  "appId": "cmi0c6wtj0000qegomm5knz4r"
}'

📥 EVENT COLLECTION
5. Collect Analytics Event

Send events like clicks, visits, CTA actions, etc.

curl --location 'https://websites-insight.netlify.app/api/analytics/collect' \
--header 'x-api-key: f06963a08e99fc67a3697a91e83562fa201f62a936fe6700ebc03e72f4b22ee5' \
--header 'Content-Type: application/json' \
--data '{
  "event": "login_form_cta_click",
  "url": "https://example.com/page",
  "referrer": "https://google.com",
  "device": "mobile",
  "ipAddress": "....",
  "timestamp": "2024-02-20T12:34:56Z",
  "metadata": {
    "browser": "Chrome",
    "os": "Android",
    "screenSize": "1080x1920"
  },
  "userId": "1"
}'

📈 ANALYTICS ENDPOINTS
6. Event Summary

Get count, unique users & device breakdown.

curl --location 'https://websites-insight.netlify.app/api/analytics/event-summary?event=login_form_cta_click&startDate=2023-02-15&endDate=2026-02-15&app_id=cmi0c6wtj0000qegomm5knz4r' \
--header 'x-api-key: f06963a08e99fc67a3697a91e83562fa201f62a936fe6700ebc03e72f4b22ee5' \
--data ''

7. User Stats

Example:

curl --location 'https://websites-insight.netlify.app/api/analytics/user-stats?userId=1' \
--header 'x-api-key: f06963a08e99fc67a3697a91e83562fa201f62a936fe6700ebc03e72f4b22ee5' \
--data ''


How to run it locally:

1. Clone Repository
git clone https://github.com/jagan-170902/analytics-backend.git
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