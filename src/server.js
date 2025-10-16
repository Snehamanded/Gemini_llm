import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sendWhatsAppText, sendWhatsAppButtons, sendWhatsAppList } from './meta.js';
import { handleUserMessage } from './gemini.js';
import { handleDeterministicFlows } from './flows.js';

dotenv.config();

const app = express();
app.use(bodyParser.json({ verify: (req, res, buf) => (req.rawBody = buf) }));

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

// Deduplicate incoming messages to avoid loops on retries
const processedMessageIds = new Map(); // id -> timestamp
const MESSAGE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function alreadyProcessed(id) {
  if (!id) return false;
  const now = Date.now();
  // purge old
  for (const [k, t] of processedMessageIds) {
    if (now - t > MESSAGE_TTL_MS) processedMessageIds.delete(k);
  }
  if (processedMessageIds.has(id)) return true;
  processedMessageIds.set(id, now);
  return false;
}

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    const change = body?.entry?.[0]?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    const metadata = change?.metadata;

    if (!message) {
      return res.sendStatus(200);
    }

    const fromWaId = message.from; // user phone (wa id)
    const msgId = message.id;
    if (alreadyProcessed(msgId)) {
      return res.sendStatus(200);
    }
    const msgType = message.type;

    let userText = '';
    if (msgType === 'text') {
      userText = message.text?.body || '';
    } else if (msgType === 'interactive') {
      const lr = message.interactive?.list_reply;
      const br = message.interactive?.button_reply;
      userText = lr?.id || br?.id || lr?.title || br?.title || '';
    } else {
      userText = '[Non-text message received]';
    }

    // Log inbound
    console.log('[INBOUND]', {
      from: fromWaId,
      type: msgType,
      text: userText
    });

    // 1) Try deterministic flows first (Contact/About/Browse/Valuation)
    let reply = await handleDeterministicFlows(fromWaId, userText);
    if (reply && typeof reply === 'object') {
      if (reply.type === 'buttons') {
        console.log('[OUTBOUND buttons]', { to: fromWaId, bodyText: reply.bodyText, buttons: reply.buttons?.map(b => b.title) });
        await sendWhatsAppButtons({ to: fromWaId, bodyText: reply.bodyText, buttons: reply.buttons });
        return res.sendStatus(200);
      }
      if (reply.type === 'list') {
        console.log('[OUTBOUND list]', { to: fromWaId, bodyText: reply.bodyText, sections: reply.sections?.map(s => ({ title: s.title, rows: s.rows?.length })) });
        await sendWhatsAppList({ to: fromWaId, bodyText: reply.bodyText, sections: reply.sections, buttonText: reply.buttonText || 'Options' });
        return res.sendStatus(200);
      }
    }
    // 2) Fallback to Gemini if no deterministic reply or reply is plain text
    if (!reply) {
      try {
        reply = await handleUserMessage({
          userId: fromWaId,
          message: userText,
          channel: 'whatsapp',
          businessName: process.env.DEALERSHIP_NAME || 'AutoSherpa Motors'
        });
      } catch (e) {
        console.error('Gemini error:', e);
        reply = 'I\'m online, but AI responses are temporarily unavailable. You can use: contact, about, browse used cars, or car valuation.';
      }
    }

    if (reply && reply.trim().length > 0) {
      console.log('[OUTBOUND text]', { to: fromWaId, body: reply });
      await sendWhatsAppText({
        to: fromWaId,
        body: reply
      });
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err?.response?.data || err);
    return res.sendStatus(200);
  }
});

app.get('/', (req, res) => {
  res.status(200).send('AutoSherpa WhatsApp Gemini Agent is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


