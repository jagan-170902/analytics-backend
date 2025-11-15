const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let apiKey, appId;

beforeAll(async ()=>{
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test2', email: 'a@b.com' });
  apiKey = res.body.apiKey;
  appId = res.body.appId;
});

afterAll(async ()=>{ await prisma.$disconnect(); });

describe('Collect events & query', ()=>{
  it('collects event with valid key', async ()=>{
    const res = await request(app)
      .post('/api/analytics/collect')
      .set('x-api-key', apiKey)
      .send({
        event: 'login_form_cta_click',
        url: 'https://example.com/page',
        referrer: 'https://google.com',
        device: 'mobile',
        ipAddress: '1.1.1.1',
        timestamp: new Date().toISOString(),
        metadata: { browser: 'Chrome' }
      })
      .expect(201);
    expect(res.body.saved).toBe(true);
  });

  it('fetches event summary', async ()=>{
    const res = await request(app)
      .get('/api/analytics/event-summary')
      .query({ event: 'login_form_cta_click', app_id: appId })
      .expect(200);
    expect(res.body.event).toBe('login_form_cta_click');
  });
});