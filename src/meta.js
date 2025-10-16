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

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${META_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
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
  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${META_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
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
  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${META_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}


