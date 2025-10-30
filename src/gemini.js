import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toolRegistry } from './tools.js';
import { appendTurn, fetchRecentHistory } from './history.js';
import { getSession, setSession } from './session.js';
import { isHinglish } from './language.js';

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

LANGUAGE RESPONSE RULES:
- If user sends Hinglish messages (mix of Hindi and English), respond in Hinglish using Roman script.
- Use common Hinglish phrases like "main", "aap", "hai", "hain", "chahta", "chahiye", "dekh", "raha", "rahi", "hun".
- Examples of Hinglish responses:
  * "Namaste! Sherpa Hyundai mein aapka swagat hai! Aaj main aapki kaise madad kar sakta hun?"
  * "Bahut badhiya! Aapka budget kya hai? (Maximum)"
  * "Samajh gaya. Budget up to ₹15,00,000. Car ka type choose karein: Hatchback | MPV | SUV | Sedan"
  * "Perfect! SUV it is. Brand choose karein: Ford | Honda | Hyundai | Kia | Mahindra | Maruti"
  * "Aapke criteria ke hisaab se cars mili hain:"
- If user sends pure Hindi (Devanagari script), respond in Hindi.
- If user sends pure English, respond in English.
- Always match the user's language preference for the conversation.

SPECIFIC INTENT HANDLING:
- For car comparisons: Use searchInventoryTool to find both cars, then compare their features, prices, and specifications.
- For test drive bookings: Use scheduleTestDriveTool with car details, date, time, and customer information.
- For test drive management: Use getTestDriveBookingsTool to check bookings, cancelTestDriveTool to cancel bookings.
- For test drive availability: Use getAvailableTimeSlotsTool to check available time slots for a specific date.
- For service requests: Use serviceAppointmentTool with car model and service type.
- For financing queries: Use financingQuoteTool with car details and budget.
- For car details: Use searchInventoryTool to find the specific car and provide comprehensive information.
- For typos in car names: Try to correct common misspellings (e.g., "Seltis" → "Seltos", "Hundai" → "Hyundai").
- For multiple filters: Extract all relevant filters (budget, type, brand, fuel, transmission) and use them in searchInventoryTool.
- For ambiguous queries: Ask specific clarifying questions about budget, car type, or brand preferences.

RESPONSE PATTERNS:
- When comparing cars: "Let me compare [Car1] and [Car2] for you..." then show side-by-side comparison.
- When booking test drive: "I'll help you book a test drive for [Car]. Let me check availability..."
- When checking test drive bookings: "Let me check your test drive bookings..." then show booking details.
- When cancelling test drive: "I'll help you cancel your test drive booking..." then confirm cancellation.
- When checking availability: "Let me check available time slots for [Date]..." then show available slots.
- When handling service: "I'll help you schedule service for your [Car]. What type of service do you need?"
- When showing car details: Provide comprehensive information including price, features, specifications, and availability.
- When handling typos: "I think you meant [Corrected Name]. Let me search for that..."
`;

export async function handleUserMessage({ userId, message, channel, businessName }) {
  try {
    // FIRST: Check deterministic flows (this handles session states)
    const { handleDeterministicFlows } = await import('./flows.js');
    const deterministicResponse = await handleDeterministicFlows(userId, message);
    if (deterministicResponse) {
      await appendTurn(userId, 'user', message);
      await appendTurn(userId, 'assistant', deterministicResponse);
      return deterministicResponse;
    }
    
    // Enhanced context management
    const conversationContext = await getConversationContext(userId);
    
    // Try quick response first for immediate feedback
    const quickResponse = generateQuickResponse(message, conversationContext);
    if (quickResponse) {
      let ensuredQuick = quickResponse;
      if (isHinglish(message)) {
        // force Hinglish for quick replies
        ensuredQuick = await ensureHinglish(genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash-8b' }), quickResponse);
      }
      await appendTurn(userId, 'user', message);
      await appendTurn(userId, 'assistant', ensuredQuick);
      return ensuredQuick;
    }
    
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

    // Enhanced prompt with context awareness
    const contextPrompt = buildContextAwarePrompt(businessName, toolList, history, message, conversationContext);

    let text = await retryGenerateText(model, contextPrompt);
    // Convert structured UI payloads to plain text for terminal/Hinglish
    text = normalizeStructuredResponseToText(text, isHinglish(message) || channel === 'terminal');
    // Coerce contact/about flows to Hinglish text in terminal/Hinglish
    text = coerceContactAboutToHinglish(message, channel, text);

    // Ensure Hinglish output if user used Hinglish
    if (isHinglish(message)) {
      text = await ensureHinglish(model, text);
    }

    // Ensure text is a string
    const responseText = typeof text === 'string' ? text : JSON.stringify(text);

    // Try detect tool call JSON
    const maybeJson = extractJsonObject(responseText);
    if (maybeJson && maybeJson.tool && toolRegistry[maybeJson.tool]) {
      const tool = toolRegistry[maybeJson.tool];
      const toolResult = await tool.fn(maybeJson.args || {});

      // Update conversation context based on tool result
      await updateConversationContext(userId, maybeJson.tool, toolResult);

      // Use response templates for common scenarios
      let followUpText;
      if (maybeJson.tool === 'carValuation' && toolResult.ok) {
        followUpText = RESPONSE_TEMPLATES.valuationComplete(
          { make: toolResult.make, model: toolResult.model },
          toolResult.estimateRangeInInr
        );
      } else if (maybeJson.tool === 'scheduleTestDrive' && toolResult.ok) {
        followUpText = RESPONSE_TEMPLATES.testDriveBooked({
          car: toolResult.carName || 'your selected car',
          date: new Date(toolResult.date).toLocaleDateString('en-IN'),
          time: toolResult.time
        });
      } else if (maybeJson.tool === 'searchInventory' && toolResult.formatted) {
        // Use enhanced formatting for car search results
        followUpText = toolResult.formatted;
      } else if (maybeJson.tool === 'searchByFilters' && toolResult.formatted) {
        // Use enhanced formatting for filtered car search results
        followUpText = toolResult.formatted;
      } else {
      // Fallback to AI-generated response
      followUpText = await retryGenerateText(
        model,
        [
          SYSTEM_PROMPT(businessName),
          isHinglish(message) ? 'IMPORTANT: The user is writing in Hinglish. Respond in Hinglish (Roman Hindi) naturally.' : '',
          `Tool ${maybeJson.tool} result: ${JSON.stringify(toolResult)}`,
          `Current context: ${JSON.stringify(conversationContext)}`,
          'Formulate a concise helpful reply to the user using the tool result. Acknowledge any completed actions and ask exactly ONE next best question if relevant.'
        ].filter(Boolean).join('\n')
      );
      }
      
      // Ensure follow-up is Hinglish if needed
      let ensuredFollowUp = typeof followUpText === 'string' ? followUpText : JSON.stringify(followUpText);
      ensuredFollowUp = normalizeStructuredResponseToText(ensuredFollowUp, isHinglish(message) || channel === 'terminal');
      ensuredFollowUp = coerceContactAboutToHinglish(message, channel, ensuredFollowUp);
      if (isHinglish(message)) {
        ensuredFollowUp = await ensureHinglish(model, ensuredFollowUp);
      }
      
      await appendTurn(userId, 'user', message);
      await appendTurn(userId, 'assistant', ensuredFollowUp);
      return ensuredFollowUp;
    }

    await appendTurn(userId, 'user', message);
    let ensured = responseText;
    ensured = normalizeStructuredResponseToText(ensured, isHinglish(message) || channel === 'terminal');
    ensured = coerceContactAboutToHinglish(message, channel, ensured);
    if (isHinglish(message)) {
      ensured = await ensureHinglish(model, ensured);
    }
    await appendTurn(userId, 'assistant', ensured);
    return ensured;
  } catch (err) {
    console.error('Gemini error:', err?.response?.data || err);
    return handleSpecificErrors(err, message);
  }
}

async function getConversationContext(userId) {
  const historyRows = await fetchRecentHistory(userId, 10);
  const context = {
    currentIntent: null,
    completedActions: [],
    pendingActions: [],
    carDetails: null,
    customerInfo: null,
    lastToolUsed: null
  };

  // Analyze recent conversation to determine context
  for (const row of historyRows) {
    const content = row.content.toLowerCase();
    
    if (content.includes('valuation') || content.includes('price') || content.includes('value')) {
      context.currentIntent = 'valuation';
      context.completedActions.push('valuation_requested');
    }
    
    if (content.includes('test drive') || content.includes('book')) {
      context.currentIntent = 'test_drive';
      context.completedActions.push('test_drive_requested');
    }
    
    if (content.includes('compare') || content.includes('comparison')) {
      context.currentIntent = 'comparison';
      context.completedActions.push('comparison_requested');
    }
    
    // Extract car details
    const carMatch = content.match(/(\w+)\s+(\w+)/);
    if (carMatch) {
      context.carDetails = { make: carMatch[1], model: carMatch[2] };
    }
    
    // Extract customer info
    if (content.includes('name:') || content.includes('phone:')) {
      context.customerInfo = 'provided';
    }
  }

  return context;
}

async function updateConversationContext(userId, toolName, toolResult) {
  // Update context based on tool usage
  const context = await getConversationContext(userId);
  
  if (toolName === 'carValuation') {
    context.completedActions.push('valuation_completed');
    context.pendingActions.push('test_drive_booking');
  }
  
  if (toolName === 'scheduleTestDrive') {
    context.completedActions.push('test_drive_booked');
    context.pendingActions = [];
  }
  
  // Store updated context (in a real implementation, this would be persisted)
  // For now, we'll use the session system
  const session = getSession(userId);
  session.context = context;
  setSession(userId, session);
}

function buildContextAwarePrompt(businessName, toolList, history, message, context) {
  const contextInfo = context ? `
CONVERSATION CONTEXT:
- Current Intent: ${context.currentIntent || 'general'}
- Completed Actions: ${context.completedActions.join(', ') || 'none'}
- Pending Actions: ${context.pendingActions.join(', ') || 'none'}
- Car Details: ${context.carDetails ? JSON.stringify(context.carDetails) : 'none'}
- Customer Info: ${context.customerInfo || 'not provided'}

CONTEXT-AWARE INSTRUCTIONS:
- If valuation is completed, suggest next steps like test drive booking
- If customer info is provided, acknowledge and proceed with booking
- Maintain conversation flow and acknowledge completed actions
- Ask only ONE relevant question at a time
` : '';

  return [
    SYSTEM_PROMPT(businessName),
    (isHinglish(message) ? 'IMPORTANT LANGUAGE DIRECTIVE: User is writing in Hinglish. Always respond in Hinglish (Roman Hindi), keep tone natural and friendly.' : ''),
    'Available tools:',
    toolList,
    'How to call a tool: reply EXACTLY in JSON on its own line: {"tool":"name","args":{...}}. Otherwise, respond to the user.',
    contextInfo,
    (history ? `Conversation so far:\n${history}` : ''),
    `User: ${message}`
  ].join('\n');
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
    retries = 5,
    initialDelayMs = 1000,
    factor = 2,
    maxDelayMs = 10000,
    jitter = true
  } = opts;
  
  let attempt = 0;
  let delay = initialDelayMs;
  
  const isNetworkError = (error) => {
    if (!error) return false;
    // Undici often throws TypeError: fetch failed with a cause.code
    const code = error.cause?.code || error.code;
    const name = error.name || '';
    const message = String(error.message || '').toLowerCase();
    const undiciCodes = new Set([
      'ECONNRESET',
      'EAI_AGAIN',
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'UND_ERR_CONNECT_TIMEOUT',
      'UND_ERR_SOCKET',
      'EHOSTUNREACH',
      'ENETUNREACH',
      'CERT_HAS_EXPIRED',
      'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
    ]);
    return (
      name === 'TypeError' && message.includes('fetch failed')
    ) || (code && undiciCodes.has(code));
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const isTransient = status === 429 || status === 503 || status === 500 || status === 502 || isNetworkError(err);
      const isRateLimit = status === 429;
      
      attempt += 1;
      
      // For rate limits, use exponential backoff with jitter
      if (isRateLimit && attempt <= retries) {
        const jitterDelay = jitter ? Math.random() * 1000 : 0;
        const totalDelay = Math.min(delay + jitterDelay, maxDelayMs);
        console.log(`API rate limited, retrying in ${totalDelay}ms (attempt ${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, totalDelay));
        delay = Math.min(delay * factor, maxDelayMs);
        continue;
      }
      
      // For other transient errors, use standard retry logic
      if (isTransient && attempt <= retries) {
        const code = err?.cause?.code || err?.code || 'UNKNOWN';
        const msg = err?.message || 'Transient error';
        console.log(`API/network error ${status || ''} ${code}: ${msg}. Retrying in ${delay}ms (attempt ${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        delay = Math.min(delay * factor, maxDelayMs);
        continue;
      }
      
      // If not transient or max retries exceeded, throw error
      if (!isTransient) {
        throw err;
      }
      
      // Max retries exceeded, return fallback response
      console.error(`Max retries exceeded for API call. Status: ${status}`);
      return generateFallbackResponse(prompt);
    }
  }
}

function generateFallbackResponse(prompt) {
  // Analyze prompt to provide appropriate fallback
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('test drive') || lowerPrompt.includes('book')) {
    return 'I\'d be happy to help you book a test drive! Please provide your contact details and preferred date/time.';
  }
  
  if (lowerPrompt.includes('valuation') || lowerPrompt.includes('price') || lowerPrompt.includes('value')) {
    return 'I can help you get a car valuation. Please provide your car\'s make, model, year, and condition.';
  }
  
  if (lowerPrompt.includes('compare') || lowerPrompt.includes('comparison')) {
    return 'I can help you compare cars. Please tell me which cars you\'d like to compare.';
  }
  
  if (lowerPrompt.includes('service') || lowerPrompt.includes('repair')) {
    return 'I can help you schedule a service appointment. Please provide your car details and preferred date.';
  }
  
  if (lowerPrompt.includes('financing') || lowerPrompt.includes('loan') || lowerPrompt.includes('emi')) {
    return 'I can help you with financing options. Please tell me which car you\'re interested in and your budget.';
  }
  
  if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle')) {
    return 'I can help you find the perfect car! Please tell me your budget, preferred brand, and fuel type.';
  }
  
  return 'I\'m here to help with your car needs! You can ask about test drives, car valuations, comparisons, financing, or service appointments.';
}

// Enhanced error handling with specific error types
function handleSpecificErrors(error, message) {
  console.error('Specific error handling:', error);
  
  // API rate limiting
  if (error.status === 429) {
    return 'I\'m experiencing high demand right now. Please try again in a moment, or contact us directly at +91-9876543210.';
  }
  
  // Service unavailable
  if (error.status === 503) {
    return 'Our service is temporarily unavailable. Please try again shortly or call us at +91-9876543210 for immediate assistance.';
  }
  
  // Network errors
  const netCode = error?.cause?.code || error?.code;
  if (
    netCode === 'ENOTFOUND' ||
    netCode === 'ECONNREFUSED' ||
    netCode === 'ECONNRESET' ||
    netCode === 'EAI_AGAIN' ||
    netCode === 'ENETUNREACH' ||
    netCode === 'EHOSTUNREACH' ||
    netCode === 'UND_ERR_CONNECT_TIMEOUT'
  ) {
    return 'I\'m having trouble connecting to our systems. Please try again in a moment.';
  }
  
  // Timeout errors
  if (error.code === 'ETIMEDOUT') {
    return 'The request is taking longer than expected. Please try again or contact us for assistance.';
  }

  // Undici fetch failed (often a transient network/SSL/proxy issue)
  if (error.name === 'TypeError' && /fetch failed/i.test(String(error.message || ''))) {
    return 'Network hiccup while contacting our AI service. Please try again.';
  }
  
  // Generic fallback
  return generateFallbackResponse(message);
}

// Response templates for common scenarios
const RESPONSE_TEMPLATES = {
  valuationComplete: (carDetails, valuation) => 
    `₹${valuation.low.toLocaleString('en-IN')} - ₹${valuation.high.toLocaleString('en-IN')}`,
  
  testDriveBooked: (bookingDetails) => 
    `Perfect! Your test drive is confirmed for ${bookingDetails.car} on ${bookingDetails.date} at ${bookingDetails.time}. You'll receive a confirmation message shortly.`,
  
  contactInfoReceived: (customerInfo) => 
    `Thank you, ${customerInfo.name}! I've noted your details. Your phone number is ${customerInfo.phone}. How can I help you next?`,
  
  carComparison: (car1, car2, comparison) => 
    `Here's a comparison between ${car1} and ${car2}: ${comparison}. Which one interests you more?`,
  
  serviceScheduled: (serviceDetails) => 
    `Your service appointment is scheduled for ${serviceDetails.date} at ${serviceDetails.time}. Please bring your car documents.`
};

// Quick response generator for common patterns
function generateQuickResponse(message, context = null) {
  const lowerMessage = message.toLowerCase();
  
  // Handle common greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    // Check if user is sending Hinglish using centralized detection
    if (isHinglish(message)) {
      return 'Namaste! Sherpa Hyundai mein aapka swagat hai! Aaj main aapki kaise madad kar sakta hun?';
    }
    return 'Hello! Welcome to Sherpa Hyundai! How can I help you today?';
  }
  
  // Handle thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    if (isHinglish(message)) {
      return 'Aapka dhanyavaad! Aur koi madad chahiye?';
    }
    return 'You\'re welcome! Is there anything else I can help you with?';
  }
  
  // Handle yes/no responses
  if (lowerMessage.includes('yes') || lowerMessage.includes('yeah') || lowerMessage.includes('sure')) {
    if (isHinglish(message)) {
      if (context && context.pendingActions.includes('test_drive_booking')) {
        return 'Bahut badhiya! Main aapki test drive book karne mein madad karta hun. Aapka preferred date aur time kya hai?';
      }
      return 'Perfect! Main aapki aur kaise madad kar sakta hun?';
    }
    
    if (context && context.pendingActions.includes('test_drive_booking')) {
      return 'Great! Let me help you book a test drive. What\'s your preferred date and time?';
    }
    return 'Perfect! How can I assist you further?';
  }
  
  if (lowerMessage.includes('no') || lowerMessage.includes('not')) {
    if (isHinglish(message)) {
      return 'Koi baat nahi! Aur koi madad chahiye?';
    }
    return 'No problem! Is there anything else I can help you with?';
  }
  
  // Handle contact information
  if (lowerMessage.includes('name:') && lowerMessage.includes('phone:')) {
    const nameMatch = message.match(/name:\s*([^\n]+)/i);
    const phoneMatch = message.match(/phone:\s*([^\n]+)/i);
    if (nameMatch && phoneMatch) {
      if (isHinglish(message)) {
        return `Dhanyavaad, ${nameMatch[1].trim()}! Main aapka phone number ${phoneMatch[1].trim()} note kar liya hai. Aage kaise madad kar sakta hun?`;
      }
      return `Thank you, ${nameMatch[1].trim()}! I've noted your phone number ${phoneMatch[1].trim()}. How can I help you next?`;
    }
  }

  // Handle explicit test drive mentions
  if (lowerMessage.includes('test drive')) {
    if (isHinglish(message)) {
      return 'Test drive book karne mein madad karta hun. Kaunsi car aur kab chahte hain? (Date/time bataiye)';
    }
    return 'I can help you book a test drive. Which car and what date/time works for you?';
  }
  
  return null; // No quick response available
}

// Ensure output is Hinglish if user is using Hinglish
async function ensureHinglish(model, text) {
  try {
    const str = typeof text === 'string' ? text : JSON.stringify(text);
    // Always attempt a rewrite into Hinglish to avoid English leakage
    const rewritten = await retryGenerateText(
      model,
      [
        'Rewrite the following assistant reply into natural Hinglish (Roman Hindi).',
        'Keep meaning intact, concise, friendly. Use common Hinglish phrasing.',
        'Original:',
        str,
        'Rewritten (Hinglish):'
      ].join('\n'),
      { retries: 2, initialDelayMs: 500, maxDelayMs: 3000 }
    );
    return typeof rewritten === 'string' && rewritten.trim() ? rewritten : str;
  } catch {
    return typeof text === 'string' ? text : JSON.stringify(text);
  }
}

// Convert structured button payloads to plain text; optionally Hinglish phrasing
function normalizeStructuredResponseToText(raw, preferHinglish = false) {
  try {
    const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const obj = JSON.parse(str);
    if (obj && obj.type === 'buttons' && Array.isArray(obj.buttons)) {
      const mapTitle = (t) => {
        if (!preferHinglish) return t;
        const lower = String(t).toLowerCase();
        if (lower.includes('call')) return 'Abhi call karein';
        if (lower.includes('callback')) return 'Callback request karein';
        if (lower.includes('visit')) return 'Showroom visit karein';
        if (lower.includes('chat')) return 'Chat shuru karein';
        return t;
      };
      const body = preferHinglish
        ? 'Team se connect hona chahenge? Niche options me se select karein:'
        : (obj.bodyText || 'How would you like to get in touch?');
      const lines = obj.buttons.map((b, idx) => `${idx + 1}. ${mapTitle(b.title || '')}`);
      return `${body}\n${lines.join('\n')}`;
    }
    return str;
  } catch {
    return typeof raw === 'string' ? raw : JSON.stringify(raw);
  }
}

// For terminal/Hinglish, replace contact/about structured payloads with Hinglish text
function coerceContactAboutToHinglish(userMessage, channel, rawText) {
  const preferHing = isHinglish(userMessage) || channel === 'terminal';
  if (!preferHing) return rawText;

  const messageLower = String(userMessage || '').toLowerCase();
  const textLower = String(rawText || '').toLowerCase();
  const wantsContact = /(contact|call|phone|number|address|timing|visit|showroom)/.test(messageLower) || /contact|how would you like to get in touch|visit our showroom/.test(textLower);
  const wantsAbout = /(about|who are you|brands|dealership|showroom)/.test(messageLower);

  if (wantsContact) {
    return [
      'Team se connect hona chahenge? Options:',
      '1. Abhi call karein: +91-9876543210',
      '2. Callback request karein (number share karein)',
      '3. Showroom visit karein: 123 MG Road, Bangalore (10am–7pm, Mon–Sat)'
    ].join('\n');
  }

  if (wantsAbout) {
    return [
      'Hum Sherpa Hyundai hain — Hyundai cars ke liye sales, test drives, financing aur service sab available.',
      'Aap kaunsi car dekh rahe hain? Main details share kar deta hun.'
    ].join('\n');
  }

  return rawText;
}


