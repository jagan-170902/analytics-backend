module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Website Analytics API",
    version: "1.0.0",
    description: "Collect analytics events and query aggregated data."
  },
  servers: [{ url: "http://localhost:4000" }],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new app and create API key",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, expiresAt: { type: "string", format: "date-time" } }, required: ["name","email"] } } } },
        responses: { "201": { description: "Created" } }
      }
    },
    "/api/analytics/collect": {
      post: {
        summary: "Collect analytics event",
        parameters: [{ name: "x-api-key", in: "header", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "201": { description: "Accepted" } }
      }
    },
    "/api/analytics/event-summary": {
      get: {
        summary: "Get event summary",
        parameters: [
          { name: "event", in: "query", required: true, schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "app_id", in: "query", schema: { type: "string" } }
        ],
        responses: { "200": { description: "OK" } }
      }
    }
  }
};