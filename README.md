<div align="center">

# ATLAS

### AI-Powered Post-Mortem Analysis System

**Transform raw incident data into comprehensive, actionable post-mortem reports in seconds — not hours.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![AI](https://img.shields.io/badge/AI-Llama_3.3_70B-FF6B35?logo=meta&logoColor=white)](https://groq.com)

*Built for the Deriv AI Talent Sprint 2026*

</div>

---

## The Problem

Writing post-mortem reports after incidents is **critical but painful**:

- Takes **3-5 hours** of manual effort per incident
- Reports are often **incomplete, inconsistent, or delayed**
- Engineers spend time writing instead of **preventing the next outage**
- No standardized format across teams

## The Solution

ATLAS takes your raw incident data — title, timeline, affected systems, resolution — and uses **Llama 3.3 70B** to generate a complete, structured post-mortem report with:

- Executive summary & root cause analysis
- Contributing factors & impact assessment
- Prioritized action items with owners & effort estimates
- What went well & lessons learned
- AI confidence scores per section

**Result:** What used to take hours now takes **under 30 seconds**.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Analysis** | Groq-hosted Llama 3.3 70B generates structured, professional post-mortem reports |
| **Confidence Scores** | AI rates its confidence (0-100) per section — low scores are flagged for human review |
| **Interactive Timeline** | Visual scatter chart of incident phases with color-coded markers |
| **Multi-Format Export** | Copy, Markdown, PDF, JSON, and Print — one click each |
| **Share via Link** | LZ-string compressed URL encoding lets you share reports without a database |
| **Sample Incidents** | 3 pre-loaded real-world scenarios for instant demos |
| **Analysis History** | Last 10 analyses saved locally for quick access |
| **Dark Mode** | Full dark/light theme toggle |
| **Before/After Comparison** | Side-by-side view of manual vs ATLAS-generated reports |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS 3, Recharts |
| **Backend** | Node.js, Express.js |
| **AI Model** | Llama 3.3 70B Versatile (via Groq API) |
| **Export** | jsPDF, LZ-string |

---

## Quick Start

### Prerequisites

- **Node.js 18+**
- **Groq API Key** (free at [console.groq.com](https://console.groq.com/))

### 1. Clone the repo

```bash
git clone https://github.com/FaisalRajpoot1/atlas-postmortem-ai.git
cd atlas-postmortem-ai
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Add your Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
npm start
# Server runs at http://localhost:3001
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

---

## How It Works

```
                    ┌─────────────────┐
  Incident Data ──> │  Express API    │ ──> Groq API (Llama 3.3 70B)
  (title, timeline, │  /api/analyze   │         │
   severity, etc.)  └─────────────────┘         │
                                                v
                    ┌─────────────────┐   Structured JSON
  React Frontend <──│  Post-Mortem    │ <── (executive summary,
  (charts, export,  │  Report         │      root cause, timeline,
   share, history)  └─────────────────┘      action items, scores)
```

1. User fills in incident details (or loads a sample)
2. Backend formats the data into a structured prompt
3. Llama 3.3 70B analyzes the incident and returns a JSON report
4. Frontend renders the report with interactive charts, confidence badges, and export options

---

## Project Structure

```
atlas-postmortem-ai/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── IncidentForm.jsx        # Input form (Ctrl+Enter submit)
│   │   │   ├── PostMortemDisplay.jsx    # Report with confidence badges
│   │   │   ├── TimelineChart.jsx        # Recharts interactive timeline
│   │   │   ├── InsightsPanel.jsx        # Completeness score & follow-ups
│   │   │   ├── ExportButtons.jsx        # Copy/MD/PDF/JSON/Print/Share
│   │   │   ├── ComparisonView.jsx       # Manual vs ATLAS comparison
│   │   │   ├── SampleIncidents.jsx      # Pre-loaded demo incidents
│   │   │   ├── HistoryPanel.jsx         # Recent analyses
│   │   │   └── ...
│   │   ├── utils/           # API client, storage, toast context
│   │   └── styles/          # Tailwind CSS
│   └── tailwind.config.js
├── backend/                 # Express API server
│   ├── routes/              # API endpoints
│   ├── services/            # LLM integration & analysis logic
│   ├── prompts/             # System & user prompt templates
│   ├── middleware/          # Rate limiting
│   └── utils/               # Logger, validators, error handler
├── demo-data/               # 3 sample incident JSON files
└── docs/                    # API docs, architecture, deployment guide
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze-incident` | Analyze incident and generate post-mortem |
| `GET` | `/api/sample-incidents` | Fetch pre-loaded sample incidents |

---

## Demo

1. Start both servers (backend + frontend)
2. Click **"Try Sample Incident"** to load a pre-built scenario
3. Click **"Generate Post-Mortem"** (or press `Ctrl+Enter`)
4. Explore the AI-generated report with confidence scores and timeline chart
5. Export to your preferred format or share via link

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with passion for the Deriv AI Talent Sprint 2026**

</div>
