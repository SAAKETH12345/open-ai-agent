# Deploying Sentinel Engine to Netlify

Since Sentinel Engine is a full-stack application with a React/Vite frontend and a custom Node.js/Express backend, deploying to Netlify requires adapting the backend into a **Netlify Serverless Function**. Netlify does not natively run long-lived Express servers, but you can easily wrap your Express app to run in their serverless environment.

Here is the step-by-step guide to deploying this project on Netlify.

## Step 1: Install Required Adapters

You need a tool to wrap your Express application so it can run as an AWS Lambda/Netlify function.

```bash
npm install serverless-http
npm install -D netlify-cli
```

## Step 2: Adapt the Express Server

Create a new file called `netlify/functions/api.ts` (Netlify looks for functions in the `netlify/functions` directory by default). 

You will need to extract the Express API routes from your `server.ts` and export them wrapped in `serverless-http`.

```typescript
// netlify/functions/api.ts
import express from 'express';
import serverless from 'serverless-http';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json());

// Your API Route
app.post('/api/audit-and-heal', async (req, res) => {
  // ... (Paste the contents of your existing audit-and-heal route here)
});

export const handler = serverless(app);
```

## Step 3: Create a `netlify.toml` Configuration File

In the root of your project, create a `netlify.toml` file. This tells Netlify how to build your frontend and where to route API requests.

```toml
[build]
  command = "npm run build"
  publish = "dist" # Vite outputs the frontend build here
  functions = "netlify/functions"

# Redirect all /api/* requests to your serverless function
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

# Catch-all fallback for React Router (Single Page App)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Step 4: Update Frontend API Calls

Ensure your React frontend calls the API using relative paths (e.g., `/api/audit-and-heal`). Since you set up the redirect in `netlify.toml`, Netlify will correctly route these requests to your serverless function. 

*(Note: Our current code in `App.tsx` already uses `fetch('/api/audit-and-heal')`, so no changes are needed here!)*

## Step 5: Configure Environment Variables

Netlify needs your Gemini API key to run the backend functions.

1. Go to your Netlify Dashboard.
2. Select your site.
3. Go to **Site Configuration** > **Environment variables**.
4. Add your `GEMINI_API_KEY`.

## Step 6: Deploy

You can deploy using the Netlify CLI or by linking your GitHub repository.

### Option A: Using GitHub (Recommended)
1. Push your code to a GitHub repository.
2. Log in to Netlify and click **"Add new site"** > **"Import an existing project"**.
3. Select your GitHub repository.
4. Netlify will automatically detect your `netlify.toml` settings. Click **Deploy Site**.

### Option B: Using Netlify CLI
Run the following commands in your terminal:

```bash
# Login to your Netlify account
npx netlify login

# Initialize and deploy the project
npx netlify deploy --prod
```

---
### Summary of Architecture Changes for Netlify
* **Development:** You continue using `npm run dev` with your custom `server.ts`.
* **Production:** Netlify serves your `dist` folder directly via its CDN and spins up the `api.ts` serverless function on-demand whenever the frontend makes a request to `/api/audit-and-heal`.
