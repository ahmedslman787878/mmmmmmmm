import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { orderId } = JSON.parse(event.body || '{}');
    
    const apiKey = process.env.PROVIDER_API_KEY;
    const apiUrl = process.env.PROVIDER_API_URL;

    if (!apiKey || !apiUrl) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'إعدادات الـ API غير مكتملة في الخادم.' })
      };
    }

    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('action', 'status');
    formData.append('order', orderId.toString());

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('SMM API Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'فشل الاتصال بمزود الخدمة.' })
    };
  }
};
