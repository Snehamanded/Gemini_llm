import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const META_TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

export async function sendWhatsAppText({ to, body }) {
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body }
  };

  // Retry logic for transient network errors (ECONNRESET, ETIMEDOUT, etc.)
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      return; // Success - exit function
    } catch (error) {
      lastError = error;
      
      // Check if it's a retryable error
      const isRetryable = error.code === 'ECONNRESET' || 
                         error.code === 'ETIMEDOUT' || 
                         error.code === 'ENOTFOUND' ||
                         error.code === 'ECONNREFUSED' ||
                         (error.response && error.response.status >= 500);
      
      if (!isRetryable || attempt === maxRetries - 1) {
        // Non-retryable error or last attempt - log and exit
        console.error(`[WhatsApp API Error] Failed to send message to ${to}:`, error.message);
        // Don't throw - allow the conversation to continue
        // The message might still be delivered if it's a timeout issue
        return;
      }
      
      // Wait before retry with exponential backoff
      const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

export async function sendWhatsAppTemplate({ to, name, languageCode = 'en' , components }) {
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name,
      language: { code: languageCode },
      components: components || []
    }
  };
  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${META_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function sendWhatsAppButtons({ to, bodyText, buttons }) {
  // buttons: [{id: 'id1', title: 'Button 1'}, ...]
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: (buttons || []).slice(0,3).map(b => ({
          type: 'reply',
          reply: { id: b.id, title: b.title }
        }))
      }
    }
  };
  
  // Retry logic for transient network errors
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      return;
    } catch (error) {
      const isRetryable = error.code === 'ECONNRESET' || 
                         error.code === 'ETIMEDOUT' || 
                         error.code === 'ENOTFOUND' ||
                         error.code === 'ECONNREFUSED' ||
                         (error.response && error.response.status >= 500);
      
      if (!isRetryable || attempt === maxRetries - 1) {
        console.error(`[WhatsApp API Error] Failed to send buttons to ${to}:`, error.message);
        return;
      }
      
      const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

export async function sendWhatsAppList({ to, bodyText, sections, buttonText = 'Options' }) {
  // sections: [{ title: 'Section', rows: [{id:'r1', title:'Row', description:'...'}] }]
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: {
        button: buttonText,
        sections: (sections || []).slice(0,10).map(s => ({
          title: s.title,
          rows: (s.rows || []).slice(0,10).map(r => ({ id: r.id, title: r.title, description: r.description }))
        }))
      }
    }
  };
  
  // Retry logic for transient network errors
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      return;
    } catch (error) {
      const isRetryable = error.code === 'ECONNRESET' || 
                         error.code === 'ETIMEDOUT' || 
                         error.code === 'ENOTFOUND' ||
                         error.code === 'ECONNREFUSED' ||
                         (error.response && error.response.status >= 500);
      
      if (!isRetryable || attempt === maxRetries - 1) {
        console.error(`[WhatsApp API Error] Failed to send list to ${to}:`, error.message);
        return;
      }
      
      const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}


