const INITIAL_PROMPT = `
You are a senior data analyst. You will receive a summary of a dataset (column names, types, missing values, etc.).
Your job is to provide a high-level summary and actionable insights in strictly formatted JSON.
Do not include markdown blocks, code fences, or any other text. Output ONLY valid JSON.

The JSON MUST match this exact structure:
{
  "summary": "A brief overview of what this data represents based on columns.",
  "insights": [
    {
      "title": "Short title",
      "description": "Observation about the data",
      "severity": "low" // must be "low", "medium", or "high"
    }
  ],
  "recommendations": [
    {
      "title": "Action to take",
      "description": "Why to take it",
      "expectedImpact": "What it will improve"
    }
  ],
  "metrics": {
    "overallHealthScore": 85, // number 0-100 based on data quality/completeness
    "priority": "Low" // "Low", "Medium", "High", or "Critical"
  }
}`;

const CHAT_PROMPT = `
You are a data analyst answering a user's question about their dataset.
You will receive the dataset schema and the user's question.
You must output ONLY valid JSON containing your answer and chart data. No markdown fences.

The JSON MUST match this exact structure:
{
  "type": "chart-line", // one of: "chart-line", "chart-bar", "table", "text"
  "insight": "Your narrative answer to the user's question.",
  "dataPoints": [
    { "name": "Label 1", "value": 100 },
    { "name": "Label 2", "value": 200 }
  ]
}

Only provide dataPoints if the type is chart-line, chart-bar, or table.
If the question is a general question or you cannot build a chart, use type "text" and leave dataPoints empty.
`;

export async function callLlama(promptText, isChat = false, config = {}) {
  const {
    provider = 'local', // 'local' or 'cloud'
    endpoint = 'http://localhost:11434/api/generate',
    model = 'qwen3:14b',
    apiKey = ''
  } = config;

  const systemPrompt = isChat ? CHAT_PROMPT : INITIAL_PROMPT;

  if (provider === 'local') {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: `${systemPrompt}\n\nDATA/QUESTION:\n${promptText}`,
        stream: false,
        format: 'json'
      })
    });

    if (!response.ok) {
      throw new Error(`Local Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.response);
  } else {
    // Cloud provider fallback (e.g., Groq)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Cloud API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}
