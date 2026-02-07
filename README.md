# ATLAS - AI-Powered Post-Mortem Analysis System

> Automated Incident Post-Mortem Generator for SRE Teams

ATLAS transforms raw incident data into comprehensive, actionable post-mortem reports using AI. Built for the Deriv AI Talent Sprint 2026 hackathon.

## Features

- **AI-Powered Analysis**: Leverages Google Gemini to analyze incidents and generate structured reports
- **Comprehensive Reports**: Generates executive summaries, root cause analysis, timelines, and action items
- **Export Options**: Export reports to Markdown, PDF, or JSON
- **Sample Incidents**: Pre-loaded examples for quick demos
- **Severity Classification**: Automatic P0-P3 severity categorization

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express.js
- **AI**: Google Gemini API (Free Tier)

## Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API Key (free at [Google AI Studio](https://aistudio.google.com/))

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY to .env

npm start
```

Server runs at `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze-incident` | Analyze incident and generate post-mortem |

## Post-Mortem Output Structure

```json
{
  "executive_summary": "Brief overview of the incident",
  "root_cause": "Primary cause of the incident",
  "contributing_factors": ["Factor 1", "Factor 2"],
  "timeline": [
    {"time": "14:30 UTC", "event": "Alert triggered"}
  ],
  "impact": {
    "affected_systems": ["Trading Platform"],
    "severity": "P1",
    "user_impact": "Description of user impact",
    "business_impact": "Description of business impact"
  },
  "what_went_well": ["Quick detection", "Effective communication"],
  "action_items": [
    {
      "priority": "URGENT",
      "description": "Action description",
      "owner": "Team/Person",
      "effort": "Small|Medium|Large"
    }
  ]
}
```

## Project Structure

```
atlas-postmortem-ai/
├── frontend/           # React frontend
│   ├── public/
│   └── src/
│       ├── components/ # UI components
│       ├── pages/      # Page components
│       ├── utils/      # Helper functions
│       └── styles/     # CSS styles
├── backend/            # Express backend
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── prompts/        # LLM prompts
│   ├── utils/          # Utilities
│   └── middleware/     # Express middleware
├── demo-data/          # Sample incidents
└── docs/               # Documentation
```

## Demo

1. Start both servers (backend and frontend)
2. Click "Load Sample" to use a pre-built incident
3. Click "Generate Post-Mortem"
4. View the AI-generated analysis
5. Export to your preferred format

## License

MIT License - See [LICENSE](LICENSE) for details.

## Team

Built with passion for the Deriv AI Talent Sprint 2026
