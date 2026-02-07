# ATLAS API Documentation

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Endpoints

### Health Check

Check if the API is running.

```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ATLAS Post-Mortem API",
  "timestamp": "2026-01-15T14:30:00.000Z"
}
```

---

### Analyze Incident

Generate a post-mortem report from incident data.

```
POST /analyze-incident
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "incident": {
    "title": "string (required)",
    "description": "string (required)",
    "date": "string (ISO date, optional)",
    "duration": "string (optional)",
    "severity": "string (P0-P3, optional)",
    "affectedSystems": ["string"] | "string (comma-separated)",
    "timeline": [
      {
        "time": "string",
        "event": "string"
      }
    ],
    "resolution": "string (optional)",
    "additionalContext": "string (optional)"
  }
}
```

**Example Request:**
```json
{
  "incident": {
    "title": "API Gateway Outage",
    "description": "Complete API gateway failure affecting all services",
    "date": "2026-01-15",
    "duration": "45 minutes",
    "severity": "P0",
    "affectedSystems": ["API Gateway", "Authentication", "User Service"],
    "timeline": [
      { "time": "10:00 UTC", "event": "Alerts triggered" },
      { "time": "10:05 UTC", "event": "Investigation started" },
      { "time": "10:45 UTC", "event": "Service restored" }
    ],
    "resolution": "Restarted API gateway pods",
    "additionalContext": "Memory limit was reached"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "postMortem": {
    "executive_summary": "string",
    "root_cause": "string",
    "contributing_factors": ["string"],
    "timeline": [
      {
        "time": "string",
        "event": "string"
      }
    ],
    "impact": {
      "affected_systems": ["string"],
      "severity": "P0|P1|P2|P3",
      "user_impact": "string",
      "business_impact": "string"
    },
    "what_went_well": ["string"],
    "action_items": [
      {
        "priority": "URGENT|HIGH|MEDIUM|LOW",
        "description": "string",
        "owner": "string",
        "effort": "Small|Medium|Large"
      }
    ],
    "incident_title": "string",
    "generated_at": "ISO timestamp"
  },
  "generatedAt": "ISO timestamp"
}
```

**Error Responses:**

**400 Bad Request** - Validation failed
```json
{
  "error": "Validation failed",
  "details": [
    "Title is required",
    "Description is required"
  ]
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "error": "Rate Limit Exceeded",
  "message": "Too many analysis requests. Please wait before generating another post-mortem.",
  "retryAfter": 60
}
```

**503 Service Unavailable** - AI service error
```json
{
  "error": "Service Configuration Error",
  "message": "AI service is not properly configured. Please check API keys."
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| All API routes | 20 requests/minute |
| `/analyze-incident` | 10 requests/minute |

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time until limit resets

---

## Severity Levels

| Level | Description |
|-------|-------------|
| P0 | Critical - Complete outage, all users affected |
| P1 | High - Major feature broken, significant impact |
| P2 | Medium - Minor impact, workaround available |
| P3 | Low - Minimal impact, cosmetic issues |

---

## Action Item Priorities

| Priority | Expected Response Time |
|----------|----------------------|
| URGENT | Within 24-48 hours |
| HIGH | Within 1-2 weeks |
| MEDIUM | Within 1 month |
| LOW | As capacity allows |
