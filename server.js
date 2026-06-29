import express from 'express';
import cors from 'cors';
import { callLlama } from './backend/ai.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json({ limit: '50mb' }));

// Validation helper for analyze endpoint
function validateAnalyzeResponse(json) {
  if (!json.summary || typeof json.summary !== 'string') return false;
  if (!Array.isArray(json.insights) || json.insights.length === 0) return false;
  if (!Array.isArray(json.recommendations) || json.recommendations.length === 0) return false;
  if (!json.metrics || typeof json.metrics.overallHealthScore !== 'number') return false;
  return true;
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { schemaSummary, config } = req.body;
    let attempts = 0;
    let result = null;

    while (attempts < 2) {
      try {
        result = await callLlama(JSON.stringify(schemaSummary), false, config);
        if (validateAnalyzeResponse(result)) {
          break; // Valid JSON
        }
      } catch (e) {
        console.error('Llama parsing error attempt', attempts, e.message);
      }
      attempts++;
      result = null; // Reset if invalid
    }

    if (!result) {
      return res.status(422).json({ error: 'Failed to generate valid analysis format after retries' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { schemaSummary, question, config } = req.body;
    
    const promptText = `
Schema:
${JSON.stringify(schemaSummary)}

Question:
${question}
`;

    const result = await callLlama(promptText, true, config);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
