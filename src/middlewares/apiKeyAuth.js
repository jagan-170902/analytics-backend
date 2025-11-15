const keyService = require('../services/keyService');

async function apiKeyAuth(req, res, next){
  try {
    const apiKey = req.header('x-api-key');
    if(!apiKey) return res.status(401).json({ error: 'API key required in x-api-key header' });
    const app = await keyService.validateKey(apiKey);
    if(!app) return res.status(403).json({ error: 'Invalid or revoked API key' });
    req.appData = app;
    next();
  } catch (err){ next(err) }
}

module.exports = apiKeyAuth;