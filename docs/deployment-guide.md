# ATLAS Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/))

## Local Development

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
```

Backend runs at `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional, defaults to localhost:3001)
cp .env.example .env

# Start development server
npm start
```

Frontend runs at `http://localhost:3000`

---

## Production Deployment

### Backend - Railway/Render

#### Railway

1. Create new project at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-url.vercel.app`
5. Deploy

#### Render

1. Create new Web Service at [render.com](https://render.com)
2. Connect your repository
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

### Frontend - Vercel

1. Import project at [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Framework preset: Create React App
4. Add environment variables:
   - `REACT_APP_API_URL=https://your-backend-url.railway.app/api`
5. Deploy

---

## Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |
| `LOG_LEVEL` | Logging level (ERROR/WARN/INFO/DEBUG) | No |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | No (defaults to localhost:3001) |

---

## Verification Steps

### 1. Backend Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ATLAS Post-Mortem API",
  "timestamp": "2026-01-15T14:30:00.000Z"
}
```

### 2. Test Analysis Endpoint

```bash
curl -X POST http://localhost:3001/api/analyze-incident \
  -H "Content-Type: application/json" \
  -d '{
    "incident": {
      "title": "Test Incident",
      "description": "Testing the API endpoint",
      "severity": "P2"
    }
  }'
```

### 3. Frontend Verification

1. Open `http://localhost:3000`
2. Click on a sample incident
3. Click "Generate Post-Mortem"
4. Verify report displays correctly
5. Test export buttons

---

## Troubleshooting

### Common Issues

**"GEMINI_API_KEY is not configured"**
- Ensure `.env` file exists in backend directory
- Verify the API key is correct
- Restart the backend server

**CORS Errors**
- Check `FRONTEND_URL` in backend `.env`
- Ensure the URL matches exactly (including protocol)

**Rate Limit Errors**
- Wait 60 seconds between requests
- Gemini free tier: 15 requests per minute

**"Invalid response format from AI"**
- The AI response may have been malformed
- Try the request again
- Check backend logs for details

---

## Monitoring

### Logs

Backend logs to console with format:
```
[2026-01-15T14:30:00.000Z] [INFO] Message here
```

Log levels: ERROR, WARN, INFO, DEBUG

### Health Endpoint

Use `/api/health` for uptime monitoring services.
