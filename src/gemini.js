import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toolRegistry } from './tools.js';
import { appendTurn, fetchRecentHistory } from './history.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// DB-backed history with in-memory fallback via src/history.js

const SYSTEM_PROMPT = (
  businessName
) => `You are an automotive customer assistant for ${businessName}. Your goals:
- Greet warmly and clarify intent.
- Help with: inventory lookup, test drives, financing estimates, service scheduling, car comparisons, car details.
- Keep replies concise, friendly, and step-by-step.
- Ask exactly ONE question at a time. Do not ask multiple questions at once.
- When needed, call tools precisely with minimal arguments.
- If user asks for price, show approximate total or monthly with assumptions.
- If you lack info, ask a targeted follow-up.
- Always confirm before booking anything.

FORMAT AND LOCALE RULES:
- Always use Indian Rupee with the symbol ₹ (Unicode U+20B9). Never use $.
- Use Indian digit grouping for numbers (e.g., ₹12,34,567) when appropriate.
- When quoting user budgets like "15 lakhs", convert to ₹15,00,000 if needed.

SPECIFIC INTENT HANDLING:
- For car comparisons: Use searchInventoryTool to find both cars, then compare their features, prices, and specifications.
- For test drive bookings: Use scheduleTestDriveTool with car details.
- For service requests: Use serviceAppointmentTool with car model and service type.
- For financing queries: Use financingQuoteTool with car details and budget.
- For car details: Use searchInventoryTool to find the specific car and provide comprehensive information.
- For typos in car names: Try to correct common misspellings (e.g., "Seltis" → "Seltos", "Hundai" → "Hyundai").
- For multiple filters: Extract all relevant filters (budget, type, brand, fuel, transmission) and use them in searchInventoryTool.
- For ambiguous queries: Ask specific clarifying questions about budget, car type, or brand preferences.

RESPONSE PATTERNS:
- When comparing cars: "Let me compare [Car1] and [Car2] for you..." then show side-by-side comparison.
- When booking test drive: "I'll help you book a test drive for [Car]. Let me check availability..."
- When handling service: "I'll help you schedule service for your [Car]. What type of service do you need?"
- When showing car details: Provide comprehensive information including price, features, specifications, and availability.
- When handling typos: "I think you meant [Corrected Name]. Let me search for that..."
`;

export async function handleUserMessage({ userId, message, channel, businessName }) {
  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-8b';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Very light-weight faux function calling protocol
    const toolList = Object.keys(toolRegistry)
      .map(name => `- ${name}: ${toolRegistry[name].description}`)
      .join('\n');

    const historyRows = await fetchRecentHistory(userId, 20);
    const history = historyRows
      .map(t => (t.role === 'user' ? `User: ${t.content}` : `Assistant: ${t.content}`))
      .join('\n');

    const prompt = [
      SYSTEM_PROMPT(businessName),
      'Available tools:',
      toolList,
      'How to call a tool: reply EXACTLY in JSON on its own line: {"tool":"name","args":{...}}. Otherwise, respond to the user.',
      (history ? `Conversation so far:\n${history}` : ''),
      `User (${channel}:${userId}): ${message}`
    ].join('\n');

    const text = await retryGenerateText(model, prompt);

    // Try detect tool call JSON
    const maybeJson = extractJsonObject(text);
    if (maybeJson && maybeJson.tool && toolRegistry[maybeJson.tool]) {
      const tool = toolRegistry[maybeJson.tool];
      const toolResult = await tool.fn(maybeJson.args || {});

      const followUpText = await retryGenerateText(
        model,
        [
          SYSTEM_PROMPT(businessName),
          `Tool ${maybeJson.tool} result: ${JSON.stringify(toolResult)}`,
          'Formulate a concise helpful reply to the user using the tool result. Ask exactly ONE next best question if relevant.'
        ].join('\n')
      );
      await appendTurn(userId, 'user', message);
      await appendTurn(userId, 'assistant', followUpText);
      return followUpText;
    }

    await appendTurn(userId, 'user', message);
    await appendTurn(userId, 'assistant', text);
    return text;
  } catch (err) {
    console.error('Gemini error:', err?.response?.data || err);
    return 'Sorry, I had trouble processing that. Could you rephrase?';
  }
}

function extractJsonObject(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function retryGenerateText(model, prompt, opts = {}) {
  const {
    retries = 3,
    initialDelayMs = 800,
    factor = 2
  } = opts;
  let attempt = 0;
  let delay = initialDelayMs;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const isTransient = status === 429 || status === 503 || status === 500;
      attempt += 1;
      if (!isTransient || attempt > retries) {
        throw err;
      }
      await new Promise(r => setTimeout(r, delay));
      delay *= factor;
    }
  }
}


