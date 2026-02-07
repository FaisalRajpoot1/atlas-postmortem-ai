function validateIncidentInput(incident) {
  const errors = [];

  if (!incident) {
    return {
      valid: false,
      errors: ['Incident data is required']
    };
  }

  // Required fields
  if (!incident.title || incident.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (incident.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!incident.description || incident.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (incident.description.length > 10000) {
    errors.push('Description must be less than 10,000 characters');
  }

  // Optional but validated fields
  if (incident.severity) {
    const validSeverities = ['P0', 'P1', 'P2', 'P3', 'SEV0', 'SEV1', 'SEV2', 'SEV3',
                            'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    if (!validSeverities.includes(incident.severity.toUpperCase())) {
      errors.push('Invalid severity level. Use P0-P3, SEV0-SEV3, or CRITICAL/HIGH/MEDIUM/LOW');
    }
  }

  if (incident.timeline && !Array.isArray(incident.timeline)) {
    errors.push('Timeline must be an array');
  }

  if (incident.affectedSystems) {
    if (!Array.isArray(incident.affectedSystems) && typeof incident.affectedSystems !== 'string') {
      errors.push('Affected systems must be an array or comma-separated string');
    }
  }

  if (incident.duration && typeof incident.duration !== 'string') {
    errors.push('Duration must be a string (e.g., "2 hours 30 minutes")');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = { validateIncidentInput };
