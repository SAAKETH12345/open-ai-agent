import express from 'express';
import serverless from 'serverless-http';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json());

// API Routes
const handleAudit = async (req: express.Request, res: express.Response) => {
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

    // Combine into a single prompt to save execution time
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
};

app.post('/api/audit-and-heal', handleAudit);
app.post('/.netlify/functions/api/audit-and-heal', handleAudit);
app.post('/audit-and-heal', handleAudit);

export const handler = serverless(app);
