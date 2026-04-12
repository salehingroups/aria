/**
 * MockDataStore — realistic sample data for all 4 business modules.
 * In production, replace each getter with calls to your real data sources:
 *   CRM (HubSpot, Salesforce), helpdesk (Zendesk, Intercom),
 *   ERP/WMS, marketing platform (HubSpot, Mailchimp, etc.)
 */

export class MockDataStore {
  static getLeads() {
    return [
      { id: 'L001', name: 'Acme Corp', contact: 'Jane Smith', email: 'jane@acme.com', dealStage: 'proposal', dealValue: 48000, score: 87, lastContact: '2025-04-08', daysInStage: 5 },
      { id: 'L002', name: 'Globex Inc', contact: 'John Doe', email: 'john@globex.com', dealStage: 'demo_scheduled', dealValue: 12000, score: 62, lastContact: '2025-04-11', daysInStage: 2 },
      { id: 'L003', name: 'Initech', contact: 'Bill Lumbergh', email: 'bill@initech.com', dealStage: 'negotiation', dealValue: 95000, score: 91, lastContact: '2025-04-05', daysInStage: 12 },
      { id: 'L004', name: 'Umbrella Corp', contact: 'Alice Lee', email: 'alice@umbrella.com', dealStage: 'new', dealValue: 7500, score: 44, lastContact: '2025-03-28', daysInStage: 20 },
      { id: 'L005', name: 'Stark Industries', contact: 'Tony S.', email: 'tony@stark.com', dealStage: 'closed_won', dealValue: 220000, score: 99, lastContact: '2025-04-12', daysInStage: 0 },
    ];
  }

  static getSupportTickets() {
    return [
      { id: 'T001', subject: 'Cannot login — account locked', customer: 'Acme Corp', tier: 'enterprise', created: '2025-04-13T06:12:00Z', waitingHours: 2, channel: 'email' },
      { id: 'T002', subject: 'Wrong charge on April invoice', customer: 'Globex Inc', tier: 'pro', created: '2025-04-12T18:30:00Z', waitingHours: 14, channel: 'chat' },
      { id: 'T003', subject: 'API rate limits too restrictive', customer: 'Initech', tier: 'pro', created: '2025-04-13T04:00:00Z', waitingHours: 4, channel: 'email' },
      { id: 'T004', subject: 'How do I export my data?', customer: 'Umbrella Corp', tier: 'basic', created: '2025-04-13T07:45:00Z', waitingHours: 1, channel: 'chat' },
      { id: 'T005', subject: 'Integration broken after update', customer: 'Stark Industries', tier: 'enterprise', created: '2025-04-12T10:00:00Z', waitingHours: 22, channel: 'phone' },
    ];
  }

  static getInventory() {
    return [
      { sku: 'SKU-001', name: 'Widget Pro', stock: 12, reorderPoint: 20, reorderQty: 100, unitCost: 4.5, leadTimeDays: 7 },
      { sku: 'SKU-002', name: 'Gadget Max', stock: 340, reorderPoint: 50, reorderQty: 200, unitCost: 12.0, leadTimeDays: 14 },
      { sku: 'SKU-003', name: 'Doohickey Lite', stock: 3, reorderPoint: 30, reorderQty: 150, unitCost: 2.25, leadTimeDays: 5 },
      { sku: 'SKU-004', name: 'Thingamajig XL', stock: 88, reorderPoint: 25, reorderQty: 75, unitCost: 8.0, leadTimeDays: 10 },
      { sku: 'SKU-005', name: 'Whatchamacallit', stock: 0, reorderPoint: 15, reorderQty: 60, unitCost: 6.5, leadTimeDays: 3 },
    ];
  }

  static getPendingOrders() {
    return [
      { orderId: 'ORD-8821', customer: 'Acme Corp', items: [{ sku: 'SKU-001', qty: 50 }, { sku: 'SKU-002', qty: 10 }], value: 345, status: 'awaiting_fulfillment', dueDate: '2025-04-15' },
      { orderId: 'ORD-8822', customer: 'Globex Inc', items: [{ sku: 'SKU-005', qty: 25 }], value: 162.5, status: 'awaiting_fulfillment', dueDate: '2025-04-14' },
      { orderId: 'ORD-8823', customer: 'Initech', items: [{ sku: 'SKU-003', qty: 100 }], value: 225, status: 'awaiting_stock', dueDate: '2025-04-17' },
    ];
  }

  static getMarketingCalendar() {
    return [
      { id: 'MC-01', title: 'Spring Sale Email Blast', type: 'email', platform: 'Mailchimp', scheduledFor: '2025-04-14T09:00Z', status: 'draft', audience: 12400 },
      { id: 'MC-02', title: 'Product Feature LinkedIn Post', type: 'social', platform: 'LinkedIn', scheduledFor: '2025-04-13T13:00Z', status: 'approved', audience: 5800 },
      { id: 'MC-03', title: 'Retargeting Campaign — Abandoned Carts', type: 'paid_ad', platform: 'Google Ads', scheduledFor: '2025-04-13T00:00Z', status: 'needs_review', budget: 500 },
      { id: 'MC-04', title: 'Blog Post: AI in Business 2025', type: 'content', platform: 'Website', scheduledFor: '2025-04-15T08:00Z', status: 'draft', author: 'Content Team' },
      { id: 'MC-05', title: 'Weekly Newsletter', type: 'email', platform: 'Mailchimp', scheduledFor: '2025-04-14T10:00Z', status: 'approved', audience: 24000 },
    ];
  }

  static getMarketingMetrics() {
    return [
      { campaign: 'March Email Blast', sent: 22000, opens: 5060, clicks: 812, conversions: 38, revenue: 4180, roi: 3.1 },
      { campaign: 'Google PPC — Brand', spend: 1200, clicks: 3400, conversions: 74, revenue: 9620, roi: 7.0 },
      { campaign: 'Facebook Retargeting', spend: 800, clicks: 1100, conversions: 12, revenue: 840, roi: 0.05 },
      { campaign: 'LinkedIn Sponsored', spend: 600, clicks: 420, conversions: 8, revenue: 3200, roi: 4.3 },
    ];
  }

  // ── Sample results for dashboard when no run has happened yet ──────────────
  static getSampleResults() {
    return {
      timestamp: 'Not yet run',
      modules: [
        {
          name: 'Sales & Lead Follow-up', icon: '🎯', status: 'completed', actionsCount: 4,
          summary: 'Analyzed 5 leads. Initech deal flagged for urgent follow-up after 12 days in negotiation. Umbrella Corp marked as cold lead.',
          actions: [
            'Send closing proposal to Initech (Tony) — deal at $95k, 12 days stale',
            'Schedule demo confirmation email to Globex Inc',
            'Move Umbrella Corp to nurture sequence after 20-day silence',
            'Log Stark Industries win and trigger onboarding workflow',
          ],
        },
        {
          name: 'Customer Support Triage', icon: '🎧', status: 'completed', actionsCount: 5,
          summary: 'Triaged 5 open tickets. Stark Industries integration issue escalated to engineering (22hr wait, enterprise tier).',
          actions: [
            'CRITICAL: Escalate Stark Industries (T005) to engineering — 22hr wait, enterprise',
            'HIGH: Assign Acme login lockout (T001) to account team — enterprise SLA breach risk',
            'HIGH: Route Globex billing dispute (T002) to billing team',
            'MEDIUM: Assign Initech API question (T003) to technical team',
            'LOW: Send Umbrella Corp self-serve docs link for data export query',
          ],
        },
        {
          name: 'Inventory & Order Management', icon: '📦', status: 'completed', actionsCount: 5,
          summary: 'Critical stockouts detected. SKU-005 (Whatchamacallit) at zero stock, ORD-8822 cannot be fulfilled.',
          actions: [
            'URGENT: Raise PO for SKU-005 — zero stock, order ORD-8822 blocked (due Apr 14)',
            'Raise PO for SKU-003 — 3 units remaining, below reorder point of 30',
            'Raise PO for SKU-001 — 12 units, below reorder point of 20',
            'Notify Globex Inc of ORD-8822 delay, offer partial shipment or expedited restock',
            'Confirm ORD-8821 for Acme Corp — SKU-002 stock (340 units) sufficient',
          ],
        },
        {
          name: 'Marketing & Content Scheduling', icon: '📣', status: 'completed', actionsCount: 4,
          summary: 'Scheduled 3 content pieces. Facebook retargeting paused — ROI of 0.05 below threshold. Budget reallocated to Google PPC.',
          actions: [
            'Publish LinkedIn post (MC-02) — approved, scheduled 13:00 UTC today',
            'Pause Facebook Retargeting campaign — ROI 0.05, reallocate $800 to Google PPC',
            'Flag Spring Sale Email (MC-01) for final review before Apr 14 send',
            'Move AI Blog Post (MC-04) to approved status — content team confirmed ready',
          ],
        },
      ],
    };
  }

  static getMockModuleResult(prompt) {
    if (prompt.includes('sales') || prompt.includes('lead')) return MockDataStore.getSampleResults().modules[0];
    if (prompt.includes('support') || prompt.includes('ticket')) return MockDataStore.getSampleResults().modules[1];
    if (prompt.includes('inventory') || prompt.includes('order')) return MockDataStore.getSampleResults().modules[2];
    return MockDataStore.getSampleResults().modules[3];
  }
}
