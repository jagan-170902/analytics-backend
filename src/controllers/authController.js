const { v4: uuidv4 } = require('uuid');
const keyService = require('../services/keyService');

async function loginUser(req, res, next) {
  try {
    const { idToken, expiresAt } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google idToken required' });
    }

    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.emailVerified) {
      return res.status(401).json({ error: "Google email not verified" });
    }

    res.status(201).json({
      email: googleUser.email,
      name: googleUser.name
    });

  } catch (err) {
    next(err);
  }
}

async function registerApp(req, res, next){
  try {
    const { name, email, expiresAt } = req.body;
    if(!name || !email) return res.status(400).json({ error: 'name and email required' });

    const existing = await keyService.findAppByNameAndEmail(name, email);
    if (existing) {
      return res.status(409).json({
        error: `App '${name}' already exists.`
      });
    }
    const result = await keyService.createAppWithKey({ name, email, expiresAt });
    res.status(201).json(result);
  } catch (err) { next(err) }
}

async function getApiKey(req, res, next){
  try {
    const { appId } = req.query;
    if(!appId) return res.status(400).json({ error: 'appId required' });
    const key = await keyService.getApiKey(appId);
    if(!key) return res.status(404).json({ error: 'API key not found' });
    res.json({ apiKey: key });
  } catch(err){ next(err) }
}

async function revokeApiKey(req, res, next){
  try {
    const { apiKey } = req.body;
    if(!apiKey) return res.status(400).json({ error: 'apiKey required' });
    await keyService.revokeApiKey(apiKey);
    res.json({ revoked: true });
  } catch(err){ next(err) }
}

async function regenerateApiKey(req, res, next){
  try {
    const { appId } = req.body;
    if(!appId) return res.status(400).json({ error: 'appId required' });
    const newKey = await keyService.regenerateApiKey(appId);
    res.json({ apiKey: newKey });
  } catch(err){ next(err) }
}

module.exports = { loginUser, registerApp, getApiKey, revokeApiKey, regenerateApiKey };