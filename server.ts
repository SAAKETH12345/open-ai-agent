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

      // Step 1: Analysis Layer
      const analysisSchema = {
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
      };

      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are the Analysis Layer of the Sentinel Engine. Analyze the following code for vulnerabilities (OWASP Top 10), time complexity issues (Big O), memory leaks, and logical inconsistencies:\n\n\`\`\`\n${code}\n\`\`\``,
        config: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
        }
      });

      const analysis = JSON.parse(analysisResponse.text || '{}');

      // Step 2: Execution Layer (Healing & Testing)
      const healSchema = {
        type: Type.OBJECT,
        properties: {
          healedCode: { type: Type.STRING, description: 'The fully repaired code' },
          testSuite: { type: Type.STRING, description: 'Jest or PyTest suite proving the fix works' }
        },
        required: ["healedCode", "testSuite"]
      };

      const healResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are the Execution Layer of the Sentinel Engine. \n\nOriginal Code:\n\`\`\`\n${code}\n\`\`\`\n\nAudit Report:\n${JSON.stringify(analysis, null, 2)}\n\nGenerate a 'Healed' version of the code that fixes all identified issues. Then, generate a comprehensive Jest or PyTest test suite that proves the fixes work and ensures regressions do not occur.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: healSchema,
        }
      });

      const healData = JSON.parse(healResponse.text || '{}');

      res.json({
        analysis,
        healData
      });

    } catch (error) {
      console.error('Error during audit and heal:', error);
      res.status(500).json({ error: 'Failed to process code. Please try again.' });
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
