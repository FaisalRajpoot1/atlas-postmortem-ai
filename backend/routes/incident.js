const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { analyzeIncident } = require('../services/analysisService');
const { validateIncidentInput } = require('../utils/validators');
const { analysisRateLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

router.post('/analyze-incident', analysisRateLimiter, async (req, res, next) => {
  try {
    const { incident } = req.body;

    // Validate input
    const validation = validateIncidentInput(incident);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    logger.info(`Analyzing incident: ${incident.title || 'Untitled'}`);

    // Generate post-mortem
    const postMortem = await analyzeIncident(incident);

    logger.info('Post-mortem generated successfully');

    res.json({
      success: true,
      postMortem,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Analysis failed: ${error.message}`);
    next(error);
  }
});

// Get all sample incidents
router.get('/sample-incidents', (req, res, next) => {
  try {
    const demoDir = path.join(__dirname, '../../demo-data');
    const files = fs.readdirSync(demoDir).filter(f => f.endsWith('.json'));

    const samples = files.map((file, index) => {
      const data = JSON.parse(fs.readFileSync(path.join(demoDir, file), 'utf-8'));
      return {
        id: index + 1,
        filename: file,
        title: data.title,
        severity: data.severity,
        date: data.date,
        duration: data.duration,
        affectedSystems: data.affectedSystems,
        description: data.description,
        timeline: data.timeline,
        resolution: data.resolution,
        additionalContext: data.additionalContext
      };
    });

    res.json({ success: true, samples });
  } catch (error) {
    logger.error(`Failed to load sample incidents: ${error.message}`);
    next(error);
  }
});

module.exports = router;
