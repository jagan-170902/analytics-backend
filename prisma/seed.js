const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function main(){
  const app = await prisma.app.create({
    data: {
      name: 'Demo App',
      email: 'demo@example.com'
    }
  });
  const key = crypto.randomBytes(32).toString('hex');
  await prisma.apiKey.create({
    data: {
      key,
      appId: app.id
    }
  });
  console.log('Seeded appId:', app.id, ' apiKey:', key);
}

main().catch(e=>{
  console.error(e);
  process.exit(1);
}).finally(()=>prisma.$disconnect());