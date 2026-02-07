const { generatePostMortem } = require('./llmService');
const logger = require('../utils/logger');

async function analyzeIncident(incidentData) {
  logger.info('Starting incident analysis...');

  // Normalize input data
  const normalizedIncident = normalizeIncidentData(incidentData);

  // Generate post-mortem using LLM
  const postMortem = await generatePostMortem(normalizedIncident);

  // Validate and enhance the response
  const enhancedPostMortem = enhancePostMortem(postMortem, normalizedIncident);

  return enhancedPostMortem;
}

function normalizeIncidentData(incident) {
  return {
    title: incident.title?.trim() || 'Untitled Incident',
    date: incident.date || new Date().toISOString(),
    duration: incident.duration?.trim() || 'Unknown',
    severity: normalizeSeverity(incident.severity),
    affectedSystems: normalizeArray(incident.affectedSystems),
    description: incident.description?.trim() || '',
    timeline: normalizeTimeline(incident.timeline),
    resolution: incident.resolution?.trim() || '',
    additionalContext: incident.additionalContext?.trim() || ''
  };
}

function normalizeSeverity(severity) {
  if (!severity) return 'P2';

  const normalized = severity.toUpperCase().trim();
  if (['P0', 'P1', 'P2', 'P3', 'SEV0', 'SEV1', 'SEV2', 'SEV3'].includes(normalized)) {
    return normalized.replace('SEV', 'P');
  }

  // Map descriptive severities
  const severityMap = {
    'CRITICAL': 'P0',
    'HIGH': 'P1',
    'MEDIUM': 'P2',
    'LOW': 'P3'
  };

  return severityMap[normalized] || 'P2';
}

function normalizeArray(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(s => s.trim()).filter(Boolean);
  if (typeof input === 'string') {
    return input.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function normalizeTimeline(timeline) {
  if (!timeline) return [];
  if (Array.isArray(timeline)) {
    return timeline.map(entry => ({
      time: entry.time || 'Unknown',
      event: entry.event || entry.description || ''
    }));
  }
  return [];
}

function enhancePostMortem(postMortem, incident) {
  // Ensure all required fields exist with defaults
  return {
    executive_summary: postMortem.executive_summary || 'Analysis pending',
    root_cause: postMortem.root_cause || 'Investigation required',
    contributing_factors: postMortem.contributing_factors || [],
    timeline: (postMortem.timeline || incident.timeline || []).map(entry => ({
      time: entry.time || 'Unknown',
      event: entry.event || '',
      phase: entry.phase || 'investigation'
    })),
    impact: {
      affected_systems: postMortem.impact?.affected_systems || incident.affectedSystems || [],
      severity: postMortem.impact?.severity || incident.severity || 'P2',
      user_impact: postMortem.impact?.user_impact || 'Not assessed',
      business_impact: postMortem.impact?.business_impact || 'Not assessed'
    },
    what_went_well: postMortem.what_went_well || [],
    action_items: (postMortem.action_items || []).map(item => ({
      priority: item.priority || 'MEDIUM',
      description: item.description || '',
      owner: item.owner || 'TBD',
      effort: item.effort || 'Medium'
    })),
    confidence_scores: postMortem.confidence_scores || {
      executive_summary: 75,
      root_cause: 70,
      contributing_factors: 70,
      timeline: 80,
      impact: 75,
      what_went_well: 65,
      action_items: 70
    },
    // Metadata
    incident_title: incident.title,
    generated_at: new Date().toISOString()
  };
}

module.exports = { analyzeIncident };
