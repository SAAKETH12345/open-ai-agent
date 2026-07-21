<div align="center">
  <h1>🛡️ Sentinel Engine</h1>
  <p><strong>Advanced Code Auditing & Automated Healing Platform</strong></p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](https://opensource.org/licenses/Apache-2.0)
</div>

<br />

**Sentinel Engine** is an advanced, AI-driven code auditing and automated healing tool. Designed for modern engineering teams, it identifies security vulnerabilities, performance bottlenecks, and logical constraints within your codebase. Beyond static detection, Sentinel automatically synthesizes repaired, optimized, and secure versions of your code while generating a detailed, exportable audit report.

---

## ✨ Core Capabilities

- **Automated Vulnerability Scanning:** Deep-level analysis targeting OWASP security flaws, memory leaks, performance constraints, and complex logical bugs.
- **Intelligent Code Healing:** Automatically generates repaired, highly optimized, and robust versions of your vulnerable payloads.
- **Interactive Diff View:** Line-by-line syntax highlighting with red/green diff markers enables seamless comparison between original inputs and healed code.
- **Comprehensive Audit Reports:** Generates an itemized breakdown of vulnerabilities categorized by severity scores (Low, Medium, High, Critical) and actionable resolution steps.
- **Visual Analytics:** Real-time distribution trackers display vulnerability ratios across categories (Security, Performance, Memory, Logic).
- **Persistent Scan History:** A dedicated sidebar tracks your audit trail locally, allowing you to seamlessly revisit and toggle between past sessions.
- **Export & Share:** Download standard Markdown reports containing full audit trails, original code, and suggested fixes for team reviews.
- **One-Click Integration:** Rapidly copy healed code directly to your clipboard for immediate downstream deployment.

## 🛠️ Architecture & Tech Stack

- **Frontend Environment:** React 18 powered by Vite
- **Styling & UI:** Tailwind CSS, Lucide React
- **Syntax & State:** `diff` algorithmic comparisons with custom DOM rendering, LocalStorage persistence
- **Backend Service:** Node.js / Express serving automated, server-side code analysis models

---

## 🚀 Live Demo

**Experience Sentinel Engine in action:**
[**Launch Sentinel Engine**](https://ais-pre-wklt46bap4oefbzza3hajp-47633325444.asia-southeast1.run.app)

*Note: This application was built and is currently hosted on Google AI Studio.*

---

## 📖 Usage Guide

1. **Initialize Scan:** Navigate to the main dashboard, paste your vulnerable payload into the *Input Payload* area, and click **INITIALIZE SCAN**.
2. **Review Diff:** Compare the identified vulnerabilities with the AI-healed code using the side-by-side or unified diff viewer.
3. **Analyze Report:** Review the visual distribution bars and the detailed audit metrics generated beneath the code viewer.
4. **Export Findings:** Click the **Export** button to download a standardized `.md` report for your documentation.
5. **Session History:** Access and reload past scans effortlessly via the collapsible left-hand navigation sidebar.

---

## 👨‍💻 Author

**Saaketh Kazipeta**
- 📧 Email: [saakethkazipeta@gmail.com](mailto:saakethkazipeta@gmail.com)

## 📄 License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
