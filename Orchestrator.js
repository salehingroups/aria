/**
 * AgentOrchestrator — runs all 4 business modules sequentially via Claude AI
 */

import { MockDataStore } from './mock-data.js';

const CLAUDE_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export class AgentOrchestrator {
  constructor(env) {
    this.env = env;
    this.apiKey = env.ANTHROPIC_API_KEY;
    this.results = {
      timestamp: new Date().toISOString(),
      modules: [],
    };
  }

  async run() {
    console.log('[Orchestrator] Starting daily business orchestration run...');

    const modules = [
      { name: 'Sales & Lead Follow-up',         icon: '🎯', fn: () => this.runSalesModule() },
      { name: 'Customer Support Triage',         icon: '🎧', fn: () => this.runSupportModule() },
      { name: 'Inventory & Order Management',    icon: '📦', fn: () => this.runInventoryModule() },
      { name: 'Marketing & Content Scheduling',  icon: '📣', fn: () => this.runMarketingModule() },
    ];

    for (const mod of modules) {
      console.log(`[Orchestrator] Running module: ${mod.name}`);
      try {
        const result = await mod.fn();
        this.results.modules.push({ ...result, icon: mod.icon, status: 'completed' });
      } catch (err) {
        console.error(`[Orchestrator] Module "${mod.name}" failed:`, err);
        this.results.modules.push({
          name: mod.name, icon: mod.icon, status: 'error',
          summary: `Failed: ${err.message}`, actions: [], actionsCount: 0,
        });
      }
    }

    // Persist results to KV if available
    if (this.env.KV) {
      await this.env.KV.put('last_run_results', JSON.stringify(this.results));
    }

    console.log('[Orchestrator] Run complete:', JSON.stringify(this.results, null, 2));
    return this.results;
  }

  // ── MODULE 1: Sales & Lead Follow-up ───────────────────────────────────────
  async runSalesModule() {
    const leads = MockDataStore.getLeads();

    const prompt = `You are an autonomous sales agent. Analyze these leads and decide follow-up actions.

LEADS DATA:
${JSON.stringify(leads, null, 2)}

For each lead, decide:
- Whether to follow up (based on last contact date, deal stage, score)
- What action to take (email, call, demo invite, nurture, close)
- Priority level

Respond ONLY with a JSON object:
{
  "name": "Sales & Lead Follow-up",
  "summary": "One paragraph summary of what was done",
  "actions": ["action 1", "action 2", ...],
  "actionsCount": <number>
}`;

    return await this.callClaude(prompt);
  }

  // ── MODULE 2: Customer Support Triage ──────────────────────────────────────
  async runSupportModule() {
    const tickets = MockDataStore.getSupportTickets();

    const prompt = `You are an autonomous customer support triage agent. Analyze these open support tickets and prioritize/assign them.

TICKETS:
${JSON.stringify(tickets, null, 2)}

For each ticket, determine:
- Priority (critical/high/medium/low) based on content and customer tier
- Which team should handle it (billing, technical, account management, general)
- Suggested first response or resolution action
- Whether any ticket needs immediate escalation

Respond ONLY with a JSON object:
{
  "name": "Customer Support Triage",
  "summary": "One paragraph summary of triage decisions",
  "actions": ["action 1", "action 2", ...],
  "actionsCount": <number>
}`;

    return await this.callClaude(prompt);
  }

  // ── MODULE 3: Inventory & Order Management ─────────────────────────────────
  async runInventoryModule() {
    const inventory = MockDataStore.getInventory();
    const orders = MockDataStore.getPendingOrders();

    const prompt = `You are an autonomous inventory and order management agent.

CURRENT INVENTORY:
${JSON.stringify(inventory, null, 2)}

PENDING ORDERS:
${JSON.stringify(orders, null, 2)}

Analyze the data and decide:
- Which items need reordering (below reorder threshold)
- Which orders can be fulfilled now vs need delay
- Any stockout risks in the next 7 days
- Supplier purchase orders to raise

Respond ONLY with a JSON object:
{
  "name": "Inventory & Order Management",
  "summary": "One paragraph summary of inventory status and actions",
  "actions": ["action 1", "action 2", ...],
  "actionsCount": <number>
}`;

    return await this.callClaude(prompt);
  }

  // ── MODULE 4: Marketing & Content Scheduling ───────────────────────────────
  async runMarketingModule() {
    const calendar = MockDataStore.getMarketingCalendar();
    const metrics = MockDataStore.getMarketingMetrics();

    const prompt = `You are an autonomous marketing orchestration agent.

CONTENT CALENDAR (next 7 days):
${JSON.stringify(calendar, null, 2)}

RECENT CAMPAIGN METRICS:
${JSON.stringify(metrics, null, 2)}

Decide:
- Which content pieces to schedule/publish today
- Which campaigns need budget adjustments based on performance
- Any A/B tests to start or conclude
- Recommendations for underperforming campaigns

Respond ONLY with a JSON object:
{
  "name": "Marketing & Content Scheduling",
  "summary": "One paragraph summary of marketing decisions",
  "actions": ["action 1", "action 2", ...],
  "actionsCount": <number>
}`;

    return await this.callClaude(prompt);
  }

  // ── Claude API call ────────────────────────────────────────────────────────
  async callClaude(prompt) {
    if (!this.apiKey) {
      // No API key — return mock result for demo purposes
      console.warn('[Orchestrator] No ANTHROPIC_API_KEY set, using mock response');
      return MockDataStore.getMockModuleResult(prompt);
    }

    const response = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.content.map(b => b.text ?? '').join('');

    // Strip markdown fences if present
    const clean = text.replace(/```json\n?|```\n?/g, '').trim();
    return JSON.parse(clean);
  }
}
