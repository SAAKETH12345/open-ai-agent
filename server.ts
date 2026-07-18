import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/audit-and-heal', async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = new GoogleGenAI({ apiKey });

    // Combine into a single prompt to save execution time
    const combinedSchema = {
      type: Type.OBJECT,
      properties: {
        analysis: {
          type: Type.OBJECT,
          properties: {
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'Type of issue: OWASP, Big O, Memory Leak, Logic' },
                  description: { type: Type.STRING, description: 'Detailed explanation of the issue' },
                  severity: { type: Type.STRING, description: 'Severity level: Low, Medium, High, Critical' }
                }
              }
            },
            overallSeverity: { type: Type.STRING, description: 'Overall severity: Low, Medium, High, Critical' },
            overallSeverityScore: { type: Type.INTEGER, description: '0 to 100 score where 100 is most severe' }
          },
          required: ["issues", "overallSeverity", "overallSeverityScore"]
        },
        healData: {
          type: Type.OBJECT,
          properties: {
            healedCode: { type: Type.STRING, description: 'The fully repaired code' },
            testSuite: { type: Type.STRING, description: 'Jest or PyTest suite proving the fix works' }
          },
          required: ["healedCode", "testSuite"]
        }
      },
      required: ["analysis", "healData"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are the Sentinel Engine. Analyze the following code for vulnerabilities (OWASP Top 10), time complexity issues (Big O), memory leaks, and logical inconsistencies. Generate a JSON report of the analysis. Next, generate a 'Healed' version of the code that fixes all identified issues. Finally, generate a comprehensive Jest or PyTest test suite that proves the fixes work and ensures regressions do not occur.\n\nOriginal Code:\n\`\`\`\n${code}\n\`\`\``,
      config: {
        responseMimeType: 'application/json',
        responseSchema: combinedSchema,
      }
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);

  } catch (error: any) {
    console.error('Error during audit and heal:', error);
    res.status(500).json({ error: 'Failed to process code. ' + (error.message || 'Please try again.') });
  }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
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
