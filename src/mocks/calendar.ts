import type { CalendarEvent } from '@/modules/calendar/types';

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Module accent colors for event types
const EVENT_COLORS: Record<string, string> = {
  delivery: '#0EA5E9',
  harvest: '#22C55E',
  meeting: '#2563EB',
  production: '#10B981',
  'vendor-day': '#F59E0B',
  'task-due': '#8B5CF6',
};

const calendarEvents: CalendarEvent[] = [
  // --- Delivery Events (8) ---
  { id: 'cal-del-1', title: 'Route A — Seattle North', type: 'delivery', date: getDateOffset(0), startTime: '06:00', endTime: '14:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '12 stops, estimated 8 hours. Driver: Marcus Webb', attendees: ['Marcus Webb'] },
  { id: 'cal-del-2', title: 'Route B — Capitol Hill', type: 'delivery', date: getDateOffset(0), startTime: '07:00', endTime: '13:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '8 stops. Driver: Diego Fuentes', attendees: ['Diego Fuentes'] },
  { id: 'cal-del-3', title: 'Route C — Eastside', type: 'delivery', date: getDateOffset(1), startTime: '06:30', endTime: '15:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '15 stops, heavy load. Driver: Kenji Tanaka' },
  { id: 'cal-del-4', title: 'Route A — Seattle North', type: 'delivery', date: getDateOffset(3), startTime: '06:00', endTime: '14:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '11 stops. Driver: Marcus Webb' },
  { id: 'cal-del-5', title: 'Route D — Tacoma/South', type: 'delivery', date: getDateOffset(4), startTime: '05:30', endTime: '16:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '18 stops, long route. Driver: Alisha Pham' },
  { id: 'cal-del-6', title: 'Route B — Capitol Hill', type: 'delivery', date: getDateOffset(7), startTime: '07:00', endTime: '13:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '9 stops. Driver: Diego Fuentes' },
  { id: 'cal-del-7', title: 'Emergency Restock — Greenfield', type: 'delivery', date: getDateOffset(2), startTime: '10:00', endTime: '11:30', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: 'Priority restock for top account' },
  { id: 'cal-del-8', title: 'Route C — Eastside', type: 'delivery', date: getDateOffset(8), startTime: '06:30', endTime: '15:00', allDay: false, module: 'Delivery', moduleRoute: '/delivery', color: EVENT_COLORS.delivery, description: '14 stops. Driver: Kenji Tanaka' },

  // --- Harvest Events (5) ---
  { id: 'cal-harv-1', title: 'Harvest: Gelato (Bloom C)', type: 'harvest', date: getDateOffset(5), allDay: true, module: 'Cultivation', moduleRoute: '/cultivation', color: EVENT_COLORS.harvest, description: '110 plants, estimated 8.6 kg yield' },
  { id: 'cal-harv-2', title: 'Dry Complete: Jack Herer', type: 'harvest', date: getDateOffset(2), allDay: true, module: 'Cultivation', moduleRoute: '/cultivation', color: EVENT_COLORS.harvest, description: 'Ready for bucking and trimming' },
  { id: 'cal-harv-3', title: 'Dry Complete: OG Kush', type: 'harvest', date: getDateOffset(7), allDay: true, module: 'Cultivation', moduleRoute: '/cultivation', color: EVENT_COLORS.harvest, description: '95 plants, estimated 7.2 kg dry' },
  { id: 'cal-harv-4', title: 'Flip to Flower: GSC (Veg A)', type: 'harvest', date: getDateOffset(14), allDay: true, module: 'Cultivation', moduleRoute: '/cultivation', color: EVENT_COLORS.harvest, description: '150 plants moving to flower stage' },
  { id: 'cal-harv-5', title: 'Harvest: Wedding Cake (Bloom A)', type: 'harvest', date: getDateOffset(21), allDay: true, module: 'Cultivation', moduleRoute: '/cultivation', color: EVENT_COLORS.harvest, description: '120 plants, estimated 9.4 kg yield' },

  // --- Meeting Events (8) ---
  { id: 'cal-meet-1', title: 'Sales Team Standup', type: 'meeting', date: getDateOffset(0), startTime: '09:00', endTime: '09:30', allDay: false, module: 'Meetings', moduleRoute: '/meetings', color: EVENT_COLORS.meeting, description: 'Daily sync — pipeline review', attendees: ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz', 'Dana Whitfield'] },
  { id: 'cal-meet-2', title: 'Account Review: Greenfield', type: 'meeting', date: getDateOffset(1), startTime: '14:00', endTime: '15:00', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS.meeting, description: 'Quarterly business review with Sarah Chen', attendees: ['Jake Morrison', 'Sarah Chen'] },
  { id: 'cal-meet-3', title: 'New Product Tasting — Solventless Gummies', type: 'meeting', date: getDateOffset(2), startTime: '11:00', endTime: '12:00', allDay: false, module: 'Products', moduleRoute: '/products', color: EVENT_COLORS.meeting, description: 'R&D team presenting new formulation' },
  { id: 'cal-meet-4', title: 'Sales Team Standup', type: 'meeting', date: getDateOffset(1), startTime: '09:00', endTime: '09:30', allDay: false, module: 'Meetings', moduleRoute: '/meetings', color: EVENT_COLORS.meeting, attendees: ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz', 'Dana Whitfield'] },
  { id: 'cal-meet-5', title: 'Board Update — Q2 Revenue', type: 'meeting', date: getDateOffset(6), startTime: '10:00', endTime: '11:30', allDay: false, module: 'Meetings', moduleRoute: '/meetings', color: EVENT_COLORS.meeting, description: 'Monthly board presentation', attendees: ['Executive Team'] },
  { id: 'cal-meet-6', title: 'Compliance Training', type: 'meeting', date: getDateOffset(8), startTime: '13:00', endTime: '15:00', allDay: false, module: 'Meetings', moduleRoute: '/meetings', color: EVENT_COLORS.meeting, description: 'Required annual compliance refresher' },
  { id: 'cal-meet-7', title: 'Sales Call: Pacific Leaf', type: 'meeting', date: getDateOffset(3), startTime: '11:00', endTime: '11:45', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS.meeting, description: 'Follow-up on lost vape placement', attendees: ['Priya Patel'] },
  { id: 'cal-meet-8', title: 'Ops Planning — Week Ahead', type: 'meeting', date: getDateOffset(-1), startTime: '16:00', endTime: '17:00', allDay: false, module: 'Meetings', moduleRoute: '/meetings', color: EVENT_COLORS.meeting, description: 'Cross-team coordination' },

  // --- Production Events (6) ---
  { id: 'cal-prod-1', title: 'Batch GEL-2024-089 — Extraction Complete', type: 'production', date: getDateOffset(0), allDay: true, module: 'Manufacturing', moduleRoute: '/manufacturing', color: EVENT_COLORS.production, description: 'Gelato live resin extraction done, pending COA' },
  { id: 'cal-prod-2', title: 'COA Results Expected — Batch WC-2024-045', type: 'production', date: getDateOffset(1), allDay: true, module: 'COA', moduleRoute: '/coa', color: EVENT_COLORS.production, description: 'Wedding Cake flower — lab results from Confidence Analytics' },
  { id: 'cal-prod-3', title: 'Packaging Run: Pre-Roll 100-pack', type: 'production', date: getDateOffset(2), startTime: '06:00', endTime: '14:00', allDay: false, module: 'Packaging', moduleRoute: '/packaging', color: EVENT_COLORS.production, description: 'Blue Dream pre-rolls for Greenfield order' },
  { id: 'cal-prod-4', title: 'Vape Cart Fill — CloudNine Response', type: 'production', date: getDateOffset(4), startTime: '07:00', endTime: '15:00', allDay: false, module: 'Manufacturing', moduleRoute: '/manufacturing', color: EVENT_COLORS.production, description: 'Priority cart production to counter CloudNine pricing' },
  { id: 'cal-prod-5', title: 'Edible Batch — Gummy Line', type: 'production', date: getDateOffset(6), startTime: '06:00', endTime: '12:00', allDay: false, module: 'Manufacturing', moduleRoute: '/manufacturing', color: EVENT_COLORS.production, description: 'New 25mg gummy formulation first run' },
  { id: 'cal-prod-6', title: 'COA Results Expected — Batch BD-2024-112', type: 'production', date: getDateOffset(5), allDay: true, module: 'COA', moduleRoute: '/coa', color: EVENT_COLORS.production, description: 'Blue Dream live resin — potency and terpene profile' },

  // --- Vendor Day Events (5) ---
  { id: 'cal-vd-1', title: 'Vendor Day: Greenfield Dispensary', type: 'vendor-day', date: getDateOffset(3), startTime: '10:00', endTime: '16:00', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS['vendor-day'], description: 'Full day pop-up with samples. Rep: Jake Morrison', attendees: ['Jake Morrison'] },
  { id: 'cal-vd-2', title: 'Vendor Day: Summit Collective', type: 'vendor-day', date: getDateOffset(5), startTime: '11:00', endTime: '17:00', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS['vendor-day'], description: 'Budtender education + new product intro. Rep: Priya Patel', attendees: ['Priya Patel'] },
  { id: 'cal-vd-3', title: 'Vendor Day: Capitol Hill Collective', type: 'vendor-day', date: getDateOffset(10), startTime: '10:00', endTime: '16:00', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS['vendor-day'], description: 'Focus on concentrate shelf. Rep: Carlos Ruiz', attendees: ['Carlos Ruiz'] },
  { id: 'cal-vd-4', title: 'Vendor Day: Emerald City Cannabis', type: 'vendor-day', date: getDateOffset(12), startTime: '11:00', endTime: '15:00', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS['vendor-day'], description: 'New account introduction. Rep: Dana Whitfield', attendees: ['Dana Whitfield'] },
  { id: 'cal-vd-5', title: 'Vendor Day: Pacific Leaf', type: 'vendor-day', date: getDateOffset(17), startTime: '10:00', endTime: '16:00', allDay: false, module: 'CRM', moduleRoute: '/crm', color: EVENT_COLORS['vendor-day'], description: 'Win-back visit — lost vape placement. Rep: Priya Patel', attendees: ['Priya Patel'] },

  // --- Task Due Dates (4) ---
  { id: 'cal-task-1', title: 'Submit Monthly Compliance Report', type: 'task-due', date: getDateOffset(2), allDay: true, module: 'Tasks', moduleRoute: '/tasks', color: EVENT_COLORS['task-due'], description: 'Traceability report due to WSLCB' },
  { id: 'cal-task-2', title: 'Renew Greenfield Contract', type: 'task-due', date: getDateOffset(7), allDay: true, module: 'Tasks', moduleRoute: '/tasks', color: EVENT_COLORS['task-due'], description: 'Annual wholesale agreement renewal' },
  { id: 'cal-task-3', title: 'Inventory Count — Vault', type: 'task-due', date: getDateOffset(4), startTime: '08:00', endTime: '12:00', allDay: false, module: 'Inventory', moduleRoute: '/inventory', color: EVENT_COLORS['task-due'], description: 'Monthly physical count of vault inventory' },
  { id: 'cal-task-4', title: 'Equipment Maintenance — Extraction', type: 'task-due', date: getDateOffset(9), startTime: '07:00', endTime: '11:00', allDay: false, module: 'Manufacturing', moduleRoute: '/manufacturing', color: EVENT_COLORS['task-due'], description: 'Quarterly maintenance on CO2 extraction equipment' },

  // --- Misc (4) ---
  { id: 'cal-misc-1', title: 'WSLCB License Renewal Deadline', type: 'task-due', date: getDateOffset(20), allDay: true, module: 'Tasks', moduleRoute: '/tasks', color: EVENT_COLORS['task-due'], description: 'Annual processor/producer license renewal' },
  { id: 'cal-misc-2', title: 'Insurance Policy Review', type: 'meeting', date: getDateOffset(15), startTime: '14:00', endTime: '15:00', allDay: false, module: 'Meetings', moduleRoute: '/meetings', color: EVENT_COLORS.meeting, description: 'Annual review with carrier' },
  { id: 'cal-misc-3', title: 'Fire Suppression Inspection', type: 'task-due', date: getDateOffset(18), startTime: '09:00', endTime: '12:00', allDay: false, module: 'Tasks', moduleRoute: '/tasks', color: EVENT_COLORS['task-due'], description: 'Annual fire safety inspection — all grow rooms' },
  { id: 'cal-misc-4', title: 'Q2 Product Launch Planning', type: 'meeting', date: getDateOffset(11), startTime: '10:00', endTime: '12:00', allDay: false, module: 'Projects', moduleRoute: '/projects', color: EVENT_COLORS.meeting, description: 'Cross-functional launch readiness review' },
];

// --- Helpers ---
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Export Functions ---
export async function getCalendarEvents(filters?: { types?: string[]; modules?: string[] }): Promise<CalendarEvent[]> {
  await delay(300);
  let events = calendarEvents;
  if (filters?.types && filters.types.length > 0) {
    events = events.filter((e) => filters.types!.includes(e.type));
  }
  if (filters?.modules && filters.modules.length > 0) {
    events = events.filter((e) => filters.modules!.includes(e.module));
  }
  return events.sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return (a.startTime ?? '00:00').localeCompare(b.startTime ?? '00:00');
  });
}
