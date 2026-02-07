const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Lazy-initialized Groq client
let client = null;
function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return client;
}

// Load prompts
const systemPrompt = fs.readFileSync(
  path.join(__dirname, '../prompts/system-prompt.txt'),
  'utf-8'
);

const userPromptTemplate = fs.readFileSync(
  path.join(__dirname, '../prompts/user-prompt-template.txt'),
  'utf-8'
);

const MAX_RETRIES = 3;
const TIMEOUT_MS = 60000;

async function generatePostMortem(incidentData) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const userPrompt = formatUserPrompt(incidentData);
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    logger.info(`Sending request to Groq API (attempt ${attempt}/${MAX_RETRIES})...`);

    try {
      const completion = await withTimeout(
        getClient().chat.completions.create({
          model: model,
          temperature: 0.7,
          max_tokens: 8192,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
        TIMEOUT_MS
      );

      const text = completion.choices[0].message.content;
      logger.info('Received response from Groq API');

      // Parse JSON from response
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                        text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        logger.error('Failed to parse JSON from LLM response');
        throw new Error('Invalid response format from AI');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const postMortem = JSON.parse(jsonStr);

      return postMortem;
    } catch (error) {
      lastError = error;
      logger.error(`Groq API error: ${error.message}`);

      if (error.message.includes('API key') || error.message.includes('auth')) {
        throw new Error('Invalid API key. Please check your GROQ_API_KEY.');
      }
      if (error.message.includes('quota') || error.message.includes('rate')) {
        throw new Error('API quota/rate limit exceeded. Please try again later.');
      }

      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  logger.error(`All ${MAX_RETRIES} attempts failed`);
  throw lastError;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    )
  ]);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatUserPrompt(incident) {
  let prompt = userPromptTemplate;

  prompt = prompt.replace('{{TITLE}}', incident.title || 'Untitled Incident');
  prompt = prompt.replace('{{DATE}}', incident.date || new Date().toISOString());
  prompt = prompt.replace('{{DURATION}}', incident.duration || 'Unknown');
  prompt = prompt.replace('{{SEVERITY}}', incident.severity || 'Unknown');
  prompt = prompt.replace('{{AFFECTED_SYSTEMS}}',
    Array.isArray(incident.affectedSystems)
      ? incident.affectedSystems.join(', ')
      : incident.affectedSystems || 'Not specified'
  );
  prompt = prompt.replace('{{DESCRIPTION}}', incident.description || 'No description provided');
  prompt = prompt.replace('{{TIMELINE}}', formatTimeline(incident.timeline));
  prompt = prompt.replace('{{RESOLUTION}}', incident.resolution || 'Not specified');
  prompt = prompt.replace('{{ADDITIONAL_CONTEXT}}', incident.additionalContext || 'None');

  return prompt;
}

function formatTimeline(timeline) {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return 'No timeline provided';
  }

  return timeline
    .map(entry => `- ${entry.time}: ${entry.event}`)
    .join('\n');
}

module.exports = { generatePostMortem };
