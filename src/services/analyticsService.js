const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function saveEvent(event){
  const rec = await prisma.event.create({
    data: {
      appId: event.appId,
      eventName: event.event,
      url: event.url,
      referrer: event.referrer,
      device: event.device,
      ipAddress: event.ipAddress,
      timestamp: new Date(event.timestamp),
      metadata: event.metadata ? event.metadata : null,
      userId: event.userId || null
    }
  });
  return rec;
}

function parseDate(s){
  if(!s) return null;
  return new Date(s);
}

async function eventSummary({ event, startDate, endDate, appId }){
  // cache key
  const cacheKey = `summary:${event}:${appId || 'all'}:${startDate || 'null'}:${endDate || 'null'}`;
  const cached = await redis.get(cacheKey);
  if(cached) return JSON.parse(cached);

  const where = {
    eventName: event
  };
  if(appId) where.appId = appId;
  if(startDate || endDate){
    where.timestamp = {};
    if(startDate) where.timestamp.gte = parseDate(startDate);
    if(endDate) {
      // include end-of-day: set next day midnight
      const d = new Date(endDate);
      d.setDate(d.getDate() + 1);
      where.timestamp.lt = d;
    }
  }

  const totalCount = await prisma.event.count({ where });
  const uniqueUsers = await prisma.event.aggregate({
    where: { ...where, userId: { not: null } },
    _count: { userId: true }
  });

  // device breakdown (group by device)
  const deviceAgg = await prisma.$queryRawUnsafe(`
    SELECT device, count(*) as cnt FROM "Event"
    WHERE "eventName" = $1
    ${ appId ? `AND "appId" = '${appId}'` : ''}
    ${ startDate ? `AND "timestamp" >= '${new Date(startDate).toISOString()}'` : '' }
    ${ endDate ? `AND "timestamp" < '${new Date(new Date(endDate).setDate(new Date(endDate).getDate()+1)).toISOString()}'` : '' }
    GROUP BY device
  `, event);

  const deviceData = {};
  (deviceAgg || []).forEach(r=>{
    deviceData[r.device || 'unknown'] = Number(r.cnt);
  });

  const result = {
    event,
    count: totalCount,
    uniqueUsers: (uniqueUsers._count?.userId) || 0,
    deviceData
  };

  // cache for short time (e.g., 60s)
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

  return result;
}

async function userStats(userId){
  const cacheKey = `userStats:${userId}`;
  const cached = await redis.get(cacheKey);
  if(cached) return JSON.parse(cached);

  const events = await prisma.event.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: 20
  });
  const totalEvents = await prisma.event.count({ where: { userId } });
  const recent = events.map(e => ({
    id: e.id,
    event: e.eventName,
    timestamp: e.timestamp,
    device: e.device,
    url: e.url
  }));
  const deviceDetails = {};
  events.forEach(e=>{
    if(e.metadata && e.metadata.browser) deviceDetails.browser = e.metadata.browser;
    if(e.metadata && e.metadata.os) deviceDetails.os = e.metadata.os;
  });

  const ipAddress = events.length ? events[0].ipAddress : null;

  const result = {
    userId,
    totalEvents,
    deviceDetails,
    ipAddress,
    recentEvents: recent
  };

  await redis.set(cacheKey, JSON.stringify(result), 'EX', 30);
  return result;
}

module.exports = { saveEvent, eventSummary, userStats };