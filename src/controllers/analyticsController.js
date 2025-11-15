const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const analyticsService = require('../services/analyticsService');

async function collectEvent(req, res, next){
  try {
    const app = req.appData;
    const {
      event,
      url,
      referrer,
      device,
      ipAddress,
      timestamp,
      metadata,
      userId
    } = req.body;

    if(!event || !timestamp) return res.status(400).json({ error: 'event and timestamp are required' });

    const saved = await analyticsService.saveEvent({
      appId: app.id,
      event,
      url,
      referrer,
      device,
      ipAddress: ipAddress || req.ip,
      timestamp,
      metadata,
      userId
    });

    res.status(201).json({ saved: true, id: saved.id });
  } catch(err){ next(err) }
}

async function eventSummary(req, res, next){
  try {
    const { event, startDate, endDate, app_id } = req.query;
    if(!event) return res.status(400).json({ error: 'event query param required' });
    const summary = await analyticsService.eventSummary({ event, startDate, endDate, appId: app_id });
    res.json(summary);
  } catch(err){ next(err) }
}

async function userStats(req, res, next){
  try {
    const { userId } = req.query;
    if(!userId) return res.status(400).json({ error: 'userId required' });
    const stats = await analyticsService.userStats(userId);
    res.json(stats);
  } catch(err){ next(err) }
}

module.exports = { collectEvent, eventSummary, userStats };