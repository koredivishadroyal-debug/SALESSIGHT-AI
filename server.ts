import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini AI Initialization
  const genAI = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "SalesSight AI API" });
  });

  // Salesforce OAuth Routes
  app.get('/api/auth/salesforce/url', (req, res) => {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const appUrl = process.env.APP_URL;

    if (!clientId || !appUrl) {
      return res.status(500).json({ 
        error: "Salesforce Client ID or APP_URL not configured in environment." 
      });
    }

    const redirectUri = `${appUrl}/auth/callback`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'full api' // adjust scopes as needed
    });

    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?${params.toString()}`;
    res.json({ url: authUrl });
  });

  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code } = req.query;
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const appUrl = process.env.APP_URL;

    if (!code || !clientId || !clientSecret || !appUrl) {
      return res.status(400).send("Missing code or configuration.");
    }

    try {
      const redirectUri = `${appUrl}/auth/callback`;
      
      const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
      }

      // In a real app, you'd store tokens securely (e.g., database or encrypted session cookie)
      // For this demo, we'll pass a success signal to the frontend
      // The frontend can store a "connected" flag in localStorage
      
      res.send(`
        <html>
          <body style="background: #0a0a0a; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center; border: 1px solid #333; padding: 2rem; border-radius: 1rem; background: #111;">
              <h2 style="color: #6366f1;">SALESFORCE SYNCHRONIZED</h2>
              <p style="color: #888;">Handshake successful. Redirecting back to executive dashboard...</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Salesforce Token Exchange Error:", error);
      res.status(500).send(`Authentication failed: ${error.message}`);
    }
  });

  // Salesforce Webhook Simulation
  app.post("/api/webhooks/salesforce", (req, res) => {
    const { event, payload } = req.body;
    console.log(`[Salesforce Webhook] Received ${event} event`);
    
    // In a real app, this would use a notification system or real-time stream (SSE/WS)
    // to push data to the client. Since we pulse via the client, we'll store this 
    // or provide a status that the client can pick up.
    
    res.json({ success: true, timestamp: new Date().toISOString() });
  });

  // Gemini Prediction API
  app.post("/api/gemini/predict", async (req, res) => {
    const { data, mode, language } = req.body;
    
    const languageMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      kn: 'Kannada (ಕನ್ನಡ)',
      ml: 'Malayalam (മലയാളം)',
      es: 'Spanish (Español)',
      fr: 'French (Français)',
      de: 'German (Deutsch)',
      ja: 'Japanese (日本語)',
      zh: 'Chinese (中文)',
      ar: 'Arabic (العربية)'
    };
    const targetLang = languageMap[language as string] || 'English';

    try {
      const model = "gemini-3-flash-preview";
      let systemPrompt = `You are a senior business data scientist. IMPORTANT: You MUST write your entire response in ${targetLang}.`;
      let userPrompt = "";

      if (mode === 'predictions') {
        systemPrompt = `You are the Lead Artificial Intelligence Strategist for SalesSight, an elite enterprise CRM intelligence platform. 
        Your objective is to perform high-fidelity statistical analysis on the provided CRM dataset and generate "Absolute Strategic Predictions".
        
        IMPORTANT: You MUST write your entire response in ${targetLang}.
        
        Mandatory output sections (use clean Markdown with sophisticated headings):
        
        1. QUARTERLY REVENUE TRAJECTORY:
           - Expected revenue with specific confidence intervals (e.g., 95% CI).
           - Seasonality adjustment analysis.
        
        2. NEURAL CHURN DIAGNOSTICS:
           - Identify specific accounts at risk.
           - Explain underlying behavioral patterns leading to churn.
        
        3. HIGH-VELOCITY OPPORTUNITIES:
           - Lead scoring based on conversion probability.
           - Recommended engagement strategies.
        
        4. STRATEGIC EXPANSION VECTORS:
           - Unmapped market territories or product-market fit gaps.
        
        Tone: Professional, highly analytical, and authoritative. Use LaTeX-style notation if relevant for formulas.`;
        userPrompt = `Perform deep neural analysis on this transaction ledger: ${JSON.stringify(data.slice(0, 100))}. Synthesize absolute predictions.`;
      } else if (mode === 'forecast') {
        systemPrompt = `Synthesize a high-level executive growth forecast. 
        Analyze revenue velocity, conversion efficiency, and regional performance.
        Provide 3 mission-critical insights in bullet points. Use executive language.
        
        IMPORTANT: You MUST write your entire response in ${targetLang}.`;
        userPrompt = `Analyze growth velocity for this dataset: ${JSON.stringify(data.slice(0, 50))}`;
      } else if (mode === 'translate') {
        systemPrompt = `You are a specialized AI Language Translator. 
        Translate the user provided text into ${targetLang}. 
        Keep the tone and formatting (Markdown, etc.) exactly as the original.
        If the original text is corporate/business jargon, find the most appropriate professional equivalent in the target language.
        Only output the translated text.`;
        userPrompt = `TEXT TO TRANSLATE: "${req.body.text}"`;
      } else {
        // Chat Assistant Mode
        systemPrompt = `You are "SIGHT-01", the advanced Neural Assistant for SalesSight Systems.
        You have full visibility into the user's uploaded CRM dataset.
        
        IMPORTANT: You MUST write your entire response in ${targetLang}.
        
        Operating Protocols:
        - ANALYZE: Always perform quantitative analysis before answering. If specific numbers are available, use them.
        - STRATEGIZE: Don't just give data; provide actionable advice based on that data.
        - STYLE: Use a clean, tech-forward, slightly futurist tone. Use bold text for key metrics.
        - CONTEXT: The user is an executive (Managing Director). Respond with appropriate gravity.
        
        If the user asks "How is my business doing?", perform a comprehensive health check:
        1. Current Revenue state vs historical trends.
        2. Top performing region/product.
        3. One critical risk and one strategic opportunity.
        
        If the data is missing or empty, advise the user to utilize the 'Vault Ingestion' module to upload their dataset.`;
        
        // Pass more context for chat
        userPrompt = `SYSTEM STATE:
        Dataset Size: ${data.length} records.
        Sample Context: ${JSON.stringify(data.slice(0, 100))}.
        
        EXECUTIVE QUERY: "${req.body.query}"`;
      }

      const response = await genAI.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate AI insights" });
    }
  });

  // Notification API
  app.post("/api/notify", async (req, res) => {
    const { subject, message, type } = req.body;
    
    try {
      const { sendNotification } = await import("./server/emailService");
      await sendNotification({
        subject: `[SalesSight ${type || 'Alert'}] ${subject}`,
        text: message,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to send notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SalesSight AI running on http://localhost:${PORT}`);
  });
}

startServer();
