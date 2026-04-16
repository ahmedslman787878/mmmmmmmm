exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { orderId } = body;
    
    const apiKey = process.env.PROVIDER_API_KEY || 'bb661e8a970a426ea17d6c33f1b54580';
    const apiUrl = process.env.PROVIDER_API_URL || 'https://smmgap.top/api/v2';

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
      body: JSON.stringify({ error: 'فشل الاتصال بمزود الخدمة.' })
    };
  }
};
