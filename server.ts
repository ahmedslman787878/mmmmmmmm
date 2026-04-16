import express from 'express';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Create Order in SMM Provider
  app.post('/api/smm/create', async (req, res) => {
    const { serviceId, link, quantity } = req.body;
    
    // Force the new API key
    const apiKey = 'bb661e8a970a426ea17d6c33f1b54580';
    const apiUrl = 'https://smmgap.top/api/v2';

    if (!apiKey || !apiUrl) {
      console.error('Missing PROVIDER_API_KEY or PROVIDER_API_URL');
      return res.status(500).json({ error: 'إعدادات الـ API غير مكتملة في الخادم.' });
    }

    try {
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
      console.log('SMM API Raw Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse SMM API response as JSON');
        return res.status(500).json({ error: 'استجابة غير صالحة من مزود الخدمة.', raw: responseText });
      }
      
      // Return the provider's response to the frontend
      res.json(data);
    } catch (error) {
      console.error('SMM API Error:', error);
      res.status(500).json({ error: 'فشل الاتصال بمزود الخدمة.' });
    }
  });

  // API Route: Check Order Status
  app.post('/api/smm/status', async (req, res) => {
    const { orderId } = req.body;
    
    // Force the new API key
    const apiKey = 'bb661e8a970a426ea17d6c33f1b54580';
    const apiUrl = 'https://smmgap.top/api/v2';

    if (!apiKey || !apiUrl) {
      return res.status(500).json({ error: 'إعدادات الـ API غير مكتملة في الخادم.' });
    }

    try {
      const formData = new URLSearchParams();
      formData.append('key', apiKey);
      formData.append('action', 'status');
      formData.append('order', orderId.toString());

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('SMM API Error:', error);
      res.status(500).json({ error: 'فشل الاتصال بمزود الخدمة.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
