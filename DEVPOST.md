# Sentinel Engine

## 🚀 Elevator Pitch
An automated, multi-agent AI security pipeline that doesn't just find vulnerabilities—it surgically heals them and writes the tests to prove it.

## 💡 Inspiration
Modern software moves fast, but security audits are slow, expensive, and often leave developers with a daunting list of problems rather than actual solutions. We realized that finding a vulnerability (like an OWASP Top 10 issue) is only half the battle. We wanted to build an autonomous "immune system" for codebases that bridges the gap between identification and resolution, empowering developers to fix critical issues instantly without context-switching.

## ⚙️ What it does
Sentinel Engine is a self-healing code platform powered by a dual-agent architecture:
1. **The Analysis Layer:** Scans "dirty" or vulnerable code to detect OWASP security risks, time complexity (Big O) bottlenecks, memory leaks, and logical inconsistencies. It generates a detailed JSON audit report with severity scoring.
2. **The Execution Layer:** Consumes the audit report to generate a surgically "healed" version of the code. It doesn't stop there—it also writes a comprehensive Jest or PyTest test suite to prove the vulnerability is patched and prevent future regressions.

All of this is presented in our "Hospital View"—an elegant, side-by-side diff editor that lets developers instantly compare their vulnerable code against the Sentinel-healed code, complete with threat-level badges and a sandbox test execution console.

## 🛠️ How we built it
* **Frontend:** React, TypeScript, and Tailwind CSS (featuring a custom "Elegant Dark" aesthetic inspired by modern developer tools).
* **Backend:** Node.js and Express to securely proxy API requests.
* **AI Architecture:** We utilize advanced LLMs (simulating the GPT-5.6 / Codex workflow) with strict structured JSON output parsing to ensure the Analysis agent perfectly hands off context to the Execution agent. 

## ⚠️ Challenges we ran into
* **Agent Handoffs:** Ensuring the Analysis Agent returned perfectly structured JSON so the Execution Agent could accurately understand the context of the vulnerabilities without hallucinating.
* **UI/UX Design:** Designing a complex diff-viewer and severity-tracking dashboard that provides deep technical insights (like Big-O notation) without overwhelming the user visually.
* **Prompt Engineering:** Tuning the Execution agent to write *only* the fixed code and the test suite without adding unnecessary conversational filler.

## 🏆 Accomplishments that we're proud of
* **Seamless Multi-Agent Orchestration:** We successfully engineered a dual-agent pipeline where the output of one model perfectly dictates the behavior of the next, operating reliably without human intervention.
* **The "Hospital View" Dashboard:** Designing a high-performance, side-by-side diff editor that is visually striking yet functional. We managed to condense complex security data (like Big-O notation and OWASP classifications) into an intuitive, elegant interface.
* **Test-Driven Healing:** Taking it a step beyond just fixing the code by having the execution agent generate a fully functional Jest/PyTest suite. We built a system that proves its own work.
* **Rapid Full-Stack Delivery:** Architecting and deploying a robust React frontend and Node.js/Express backend capable of proxying complex AI requests within the tight constraints of a hackathon.

## 📚 What we learned
* **Structured Outputs are Everything:** In multi-agent systems, natural language is too fragile for agent-to-agent communication. Forcing strict JSON schemas for the handoff was the key to eliminating hallucinations.
* **Separation of Concerns Applies to AI:** Giving an AI a singular, focused persona (e.g., "Analyst" vs. "Surgeon") yields vastly superior results compared to asking one model to "find the bugs and fix them."
* **Developers Want Solutions, Not Alerts:** Providing a list of vulnerabilities induces alert fatigue. Providing the exact code needed to fix the problem—and the tests to verify it—changes the paradigm entirely.
* **UI Dictates Trust:** Presenting the AI's suggestions in a professional, command-center style dashboard (our "Hospital View") makes the system feel like a reliable enterprise tool rather than a chaotic prototype.

## 📖 Project Story

### The Problem: Alerts Without Action
Every developer knows the dread of a security scan report. You push a feature, and hours later, your CI pipeline halts, spitting out a massive list of SAST/DAST vulnerabilities, dependency warnings, and memory leaks. The problem isn't that we lack tools to find bad code—we have plenty of those. The problem is that finding the bug is only 10% of the work. The remaining 90% is context-switching, reading obscure documentation, figuring out *how* to fix it, and writing the tests to prove the fix works. We realized the industry was suffering from "alert fatigue." We didn't need more alarms; we needed an immune system.

### The Spark: Two Brains Are Better Than One
During the OpenAI agent hackathon, we started experimenting with the idea of autonomous code repair. Our initial attempts using a single AI model to both analyze and fix code were messy. The model would either hallucinate the fix or fail to catch all the edge cases because it was trying to do too much at once. 

That’s when we had our breakthrough: **Separation of Concerns for AI Agents**. 

We architected the Sentinel Engine as a dual-agent system. 
1. **The Analyst (GPT-5.6 persona):** A highly critical, paranoid agent strictly focused on breaking the code. It scans for OWASP vulnerabilities, O(n²) bottlenecks, and logic flaws, generating a structured JSON threat report.
2. **The Surgeon (Codex persona):** A purely constructive agent that takes the Analyst's JSON report and generates a mathematically sound, optimized repair, alongside a complete Jest/PyTest suite.

### Building the Engine
We built the backend in Node.js/Express to handle the heavy lifting of agent orchestration. The real challenge was ensuring a flawless handoff between the two agents. We heavily utilized structured JSON schemas to ensure the Analyst's output was perfectly parsable by the Surgeon. 

For the frontend, we wanted something that felt like a command center. We built "The Hospital View" using React and Tailwind CSS, leaning heavily into a sleek, "Elegant Dark" cyberpunk aesthetic. We designed it to show a side-by-side diff where developers can see their "Dirty Code" bleeding red on the left, and the "Sentinel-Healed Code" glowing green on the right, complete with a live sandbox execution console. 

### The Result
The first time we fed Sentinel Engine a nasty, SQL-injection-prone, O(n²) script and watched it automatically pivot to parameterized queries with O(1) hash maps—all while passing its own generated test suite—we knew we had something special. 

Sentinel Engine represents the shift from passive security scanning to active, autonomous code healing. It's not just a tool; it's a junior security engineer and QA tester living directly in your workflow.
