# ATLAS Architecture

## System Overview

ATLAS (AI-powered Tracking and Learning for Automated Summaries) is a post-mortem analysis system that leverages Google Gemini to transform incident data into comprehensive, actionable reports.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API    │────▶│  Google Gemini  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   User Interface          Business Logic          AI Analysis
```

## Components

### Frontend (React + Tailwind CSS)

**Location:** `/frontend`

| Component | Purpose |
|-----------|---------|
| `App.jsx` | Main application state management |
| `Header.jsx` | Branding and status indicator |
| `IncidentForm.jsx` | Incident data input form |
| `PostMortemDisplay.jsx` | Structured report display |
| `LoadingSpinner.jsx` | Loading state with progress messages |
| `ExportButtons.jsx` | MD/PDF/JSON export functionality |
| `SampleIncidents.jsx` | Pre-loaded demo incidents |

**Key Libraries:**
- React 18 - UI framework
- Tailwind CSS - Utility-first styling
- Axios - HTTP client
- jsPDF - PDF generation

### Backend (Node.js + Express)

**Location:** `/backend`

| Component | Purpose |
|-----------|---------|
| `server.js` | Express server setup, middleware configuration |
| `routes/incident.js` | API endpoint for incident analysis |
| `services/llmService.js` | Gemini API integration |
| `services/analysisService.js` | Business logic, data normalization |
| `prompts/` | System and user prompt templates |
| `utils/` | Logger, validators, error handlers |
| `middleware/` | Rate limiting |

**Key Libraries:**
- Express - Web framework
- @google/generative-ai - Gemini SDK
- Helmet - Security headers
- express-rate-limit - Rate limiting

## Data Flow

1. **User Input**
   - User fills incident form or loads sample
   - Frontend validates input

2. **API Request**
   - Frontend sends POST to `/api/analyze-incident`
   - Backend validates and normalizes data

3. **AI Processing**
   - LLM service formats prompt with incident data
   - Gemini generates structured JSON response
   - Response is validated and enhanced

4. **Result Display**
   - Frontend receives post-mortem data
   - Display component renders all sections
   - Export buttons enable download

## Security Considerations

- **Rate Limiting:** 10 requests/minute per IP for analysis endpoint
- **Input Validation:** Server-side validation of all inputs
- **CORS:** Restricted to frontend origin
- **Helmet:** Security headers enabled
- **No PII Storage:** No incident data is persisted

## Scalability

Current architecture supports:
- Single backend instance (suitable for demo/hackathon)
- Gemini free tier (15 RPM, 1M tokens/day)

For production scaling:
- Add Redis for session/cache
- Deploy multiple backend instances
- Upgrade to Gemini paid tier
- Add database for incident history
