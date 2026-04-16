exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { serviceId, link, quantity } = body;
    
    const apiKey = process.env.PROVIDER_API_KEY || 'bb661e8a970a426ea17d6c33f1b54580';
    const apiUrl = process.env.PROVIDER_API_URL || 'https://smmgap.top/api/v2';

    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('action', 'add');
    formData.append('service', serviceId);
    formData.append('link', link);
    formData.append('quantity', quantity.toString());

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'استجابة غير صالحة من مزود الخدمة.', raw: responseText })
      };
    }

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
