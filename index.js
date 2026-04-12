/**
 * Autonomous Business Orchestration Agent
 * Cloudflare Worker — Daily Cron Trigger
 *
 * Orchestrates: Sales & Lead Follow-up, Customer Support Triage,
 *               Inventory & Order Management, Marketing & Content Scheduling
 */

import { AgentOrchestrator } from './orchestrator.js';
import { MockDataStore } from './mock-data.js';

export default {
  // ── Cron Trigger (daily at 08:00 UTC) ──────────────────────────────────────
  async scheduled(event, env, ctx) {
    console.log(`[CRON] Triggered at ${new Date().toISOString()}`);
    const orchestrator = new AgentOrchestrator(env);
    ctx.waitUntil(orchestrator.run());
  },

  // ── HTTP Handler (manual trigger + status dashboard) ───────────────────────
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Manual trigger endpoint
    if (url.pathname === '/run' && request.method === 'POST') {
      const orchestrator = new AgentOrchestrator(env);
      ctx.waitUntil(orchestrator.run());
      return Response.json({ status: 'started', timestamp: new Date().toISOString() });
    }

    // Dashboard endpoint
    if (url.pathname === '/' || url.pathname === '/dashboard') {
      const html = await getDashboardHTML(env);
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Last run results
    if (url.pathname === '/results') {
      const results = await env.KV?.get('last_run_results', 'json') ?? MockDataStore.getSampleResults();
      return Response.json(results);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function getDashboardHTML(env) {
  const results = await env.KV?.get('last_run_results', 'json') ?? MockDataStore.getSampleResults();
  return buildDashboard(results);
}

function buildDashboard(results) {
  const lastRun = results?.timestamp ?? 'Never';
  const modules = results?.modules ?? [];

  const moduleCards = modules.map(m => `
    <div class="module-card ${m.status}">
      <div class="module-header">
        <span class="module-icon">${m.icon}</span>
        <div>
          <div class="module-name">${m.name}</div>
          <div class="module-status status-${m.status}">${m.status.toUpperCase()}</div>
        </div>
        <div class="module-count">${m.actionsCount ?? 0} actions</div>
      </div>
      <div class="module-summary">${m.summary ?? ''}</div>
      <ul class="action-list">
        ${(m.actions ?? []).map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Business Orchestration Agent</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c27;
    --border: #2a2a3d;
    --accent: #7c6fff;
    --accent2: #ff6b6b;
    --accent3: #43e97b;
    --accent4: #f7b731;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --success: #43e97b;
    --warning: #f7b731;
    --error: #ff6b6b;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
  }
  header {
    padding: 2rem 3rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #13131a 0%, #1a1a2e 100%);
  }
  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: -0.02em;
  }
  .logo span { color: var(--accent); }
  .status-pill {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--surface2); border: 1px solid var(--border);
    padding: 0.4rem 1rem; border-radius: 999px;
    font-size: 0.75rem; color: var(--muted);
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  main { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem; }
  .hero { margin-bottom: 3rem; }
  .hero h1 {
    font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800;
    line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 0.75rem;
  }
  .hero h1 em { color: var(--accent); font-style: normal; }
  .hero p { color: var(--muted); font-size: 0.9rem; line-height: 1.7; max-width: 540px; }
  .meta-bar {
    display: flex; gap: 2rem; margin-bottom: 2.5rem;
    padding: 1.2rem 1.8rem;
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  }
  .meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
  .meta-label { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .meta-value { font-size: 0.9rem; color: var(--text); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(520px, 1fr)); gap: 1.5rem; }
  .module-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.6rem; transition: border-color 0.2s;
  }
  .module-card:hover { border-color: var(--accent); }
  .module-card.completed { border-left: 3px solid var(--success); }
  .module-card.running { border-left: 3px solid var(--accent); }
  .module-card.error { border-left: 3px solid var(--error); }
  .module-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .module-icon { font-size: 2rem; }
  .module-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
  .module-status { font-size: 0.65rem; letter-spacing: 0.1em; margin-top: 0.2rem; }
  .status-completed { color: var(--success); }
  .status-running { color: var(--accent); }
  .status-error { color: var(--error); }
  .module-count {
    margin-left: auto; font-size: 1.6rem; font-family: 'Syne', sans-serif;
    font-weight: 800; color: var(--accent);
  }
  .module-summary { color: var(--muted); font-size: 0.8rem; line-height: 1.6; margin-bottom: 1rem; }
  .action-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
  .action-list li {
    font-size: 0.78rem; color: var(--text);
    padding: 0.5rem 0.8rem; border-radius: 6px;
    background: var(--surface2); border-left: 2px solid var(--border);
  }
  .action-list li::before { content: '→ '; color: var(--accent); }
  .run-btn {
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
    padding: 0.7rem 1.8rem; border-radius: 8px; letter-spacing: 0.03em;
    transition: opacity 0.2s;
  }
  .run-btn:hover { opacity: 0.85; }
  footer { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.75rem; }
</style>
</head>
<body>
<header>
  <div class="logo">ORCH<span>AI</span>N</div>
  <div style="display:flex;gap:1rem;align-items:center">
    <button class="run-btn" onclick="triggerRun()">▶ Run Now</button>
    <div class="status-pill"><div class="dot"></div>Agent Online</div>
  </div>
</header>
<main>
  <div class="hero">
    <h1>Autonomous<br><em>Business Agent</em></h1>
    <p>Orchestrating sales, support, inventory, and marketing daily — powered by Claude AI running on Cloudflare Workers.</p>
  </div>
  <div class="meta-bar">
    <div class="meta-item">
      <div class="meta-label">Last Run</div>
      <div class="meta-value">${lastRun}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Schedule</div>
      <div class="meta-value">Daily @ 08:00 UTC</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Modules Active</div>
      <div class="meta-value">${modules.length} / 4</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Total Actions</div>
      <div class="meta-value">${modules.reduce((s, m) => s + (m.actionsCount ?? 0), 0)}</div>
    </div>
  </div>
  <div class="grid">${moduleCards}</div>
</main>
<footer>ORCHAIN · Cloudflare Workers · Powered by Claude AI</footer>
<script>
  async function triggerRun() {
    const btn = document.querySelector('.run-btn');
    btn.textContent = '⏳ Running...';
    btn.disabled = true;
    try {
      await fetch('/run', { method: 'POST' });
      setTimeout(() => location.reload(), 4000);
    } catch(e) {
      btn.textContent = '▶ Run Now';
      btn.disabled = false;
    }
  }
  // Auto-refresh every 30s
  setTimeout(() => location.reload(), 30000);
</script>
</body>
</html>`;
}
