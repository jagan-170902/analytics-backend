const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

function generateKey(len = 32){
  return crypto.randomBytes(len).toString('hex');
}

async function findAppByNameAndEmail(name, email) {
  return prisma.app.findFirst({
    where: { name, email }
  });
}

async function createAppWithKey({ name, email, expiresAt }){
  const app = await prisma.app.create({
    data: { name, email }
  });
  const key = generateKey(Number(process.env.API_KEY_LENGTH) || 32);
  await prisma.apiKey.create({
    data: {
      key,
      appId: app.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }
  });
  return { appId: app.id, name: app.name, email: app.email, apiKey: key };
}

async function getApiKey(appId){
  const k = await prisma.apiKey.findFirst({
    where: { appId, revoked: false },
    orderBy: { createdAt: 'desc' }
  });
  return k?.key ?? null;
}

async function revokeApiKey(apiKey){
  await prisma.apiKey.updateMany({ where: { key: apiKey }, data: { revoked: true }});
}

async function regenerateApiKey(appId){
  // revoke existing keys
  await prisma.apiKey.updateMany({ where: { appId }, data: { revoked: true }});
  const key = generateKey(Number(process.env.API_KEY_LENGTH) || 32);
  await prisma.apiKey.create({ data: { key, appId }});
  return key;
}

async function validateKey(key){
  if(!key) return null;
  const rec = await prisma.apiKey.findFirst({
    where: { key },
    include: { app: true }
  });
  if(!rec || rec.revoked) return null;
  if(rec.expiresAt && rec.expiresAt < new Date()) return null;
  if(rec.app?.revoked) return null;
  return rec.app;
}

module.exports = { findAppByNameAndEmail, createAppWithKey, getApiKey, revokeApiKey, regenerateApiKey, validateKey };