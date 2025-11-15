const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Auth endpoints', ()=>{
  afterAll(async ()=>{ await prisma.$disconnect(); });

  it('registers app and returns apiKey', async ()=>{
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test App', email: 'test@example.com' })
      .expect(201);
    expect(res.body.apiKey).toBeDefined();
    expect(res.body.appId).toBeDefined();
  });
});
