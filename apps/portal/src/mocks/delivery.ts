import { PIPELINE_DRIVERS, PIPELINE_ACCOUNTS } from './shared-pipeline';
import type {
  DeliveryRun,
  DeliveryDriver,
  DeliveryMetrics,
  DeliveryRunStatus,
  ScheduleEntry,
} from '@/modules/delivery/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// — Helpers —

const acct = (id: string) => {
  const a = PIPELINE_ACCOUNTS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown account: ${id}`);
  return a;
};

const drv = (id: string) => {
  const d = PIPELINE_DRIVERS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown driver: ${id}`);
  return d;
};

// — Drivers —

const greenfield = acct('acct-greenfield');
const capitolHill = acct('acct-capitol-hill');
const emeraldCity = acct('acct-emerald-city');
const pacificLeaf = acct('acct-pacific-leaf');
const rainier = acct('acct-rainier');
const olympic = acct('acct-olympic');
const pugetSound = acct('acct-puget-sound');

const james = drv('drv-001');
const roberto = drv('drv-002');
const carlos = drv('drv-003');
const sarah = drv('drv-004');

const drivers: DeliveryDriver[] = [
  {
    id: james.id,
    name: james.name,
    phone: james.phone,
    vehicleId: james.vehicleId,
    vehicleName: james.vehicleName,
    status: 'on-route',
    deliveriesToday: 3,
    onTimeRate: 97,
  },
  {
    id: roberto.id,
    name: roberto.name,
    phone: roberto.phone,
    vehicleId: roberto.vehicleId,
    vehicleName: roberto.vehicleName,
    status: 'on-route',
    deliveriesToday: 2,
    onTimeRate: 94,
  },
  {
    id: carlos.id,
    name: carlos.name,
    phone: carlos.phone,
    vehicleId: carlos.vehicleId,
    vehicleName: carlos.vehicleName,
    status: 'available',
    deliveriesToday: 3,
    onTimeRate: 96,
  },
  {
    id: sarah.id,
    name: sarah.name,
    phone: sarah.phone,
    vehicleId: sarah.vehicleId,
    vehicleName: sarah.vehicleName,
    status: 'on-route',
    deliveriesToday: 0,
    onTimeRate: 98,
  },
];

// — Delivery Runs —

const runs: DeliveryRun[] = [
  // Route 1 — Seattle Metro (James Cooper): 3 stops, 2/3 delivered
  {
    id: 'run-001',
    driverId: james.id,
    driverName: james.name,
    status: 'in-transit',
    routeName: 'Seattle Metro',
    vehicleId: james.vehicleId,
    totalStops: 3,
    completedStops: 2,
    estimatedDuration: '4h 00m',
    startedAt: '2026-03-07T08:00:00Z',
    stops: [
      {
        id: 'stop-a1',
        orderId: 'ord-2026-0401',
        orderNumber: 'ORD-0401',
        accountName: greenfield.name,
        address: greenfield.address,
        city: greenfield.city,
        estimatedArrival: '8:30 AM',
        actualArrival: '8:28 AM',
        status: 'delivered',
        paymentCollected: { method: 'COD', amount: 4200.00 },
      },
      {
        id: 'stop-a2',
        orderId: 'ord-2026-0402',
        orderNumber: 'ORD-0402',
        accountName: capitolHill.name,
        address: capitolHill.address,
        city: capitolHill.city,
        estimatedArrival: '9:30 AM',
        actualArrival: '9:35 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 2100.00 },
      },
      {
        id: 'stop-a3',
        orderId: 'ord-2026-0403',
        orderNumber: 'ORD-0403',
        accountName: emeraldCity.name,
        address: emeraldCity.address,
        city: emeraldCity.city,
        estimatedArrival: '11:00 AM',
        status: 'pending',
      },
    ],
  },

  // Route 2 — Tacoma Run (Roberto Flores): 2 stops, in transit to stop 1
  {
    id: 'run-002',
    driverId: roberto.id,
    driverName: roberto.name,
    status: 'in-transit',
    routeName: 'Tacoma Run',
    vehicleId: roberto.vehicleId,
    totalStops: 2,
    completedStops: 0,
    estimatedDuration: '3h 30m',
    startedAt: '2026-03-07T10:30:00Z',
    stops: [
      {
        id: 'stop-b1',
        orderId: 'ord-2026-0404',
        orderNumber: 'ORD-0404',
        accountName: pacificLeaf.name,
        address: pacificLeaf.address,
        city: pacificLeaf.city,
        estimatedArrival: '11:30 AM',
        status: 'pending',
      },
      {
        id: 'stop-b2',
        orderId: 'ord-2026-0405',
        orderNumber: 'ORD-0405',
        accountName: rainier.name,
        address: rainier.address,
        city: rainier.city,
        estimatedArrival: '1:00 PM',
        status: 'pending',
      },
    ],
  },

  // Route 3 — Eastside AM (Carlos Mendez): 3 stops, completed earlier today
  {
    id: 'run-003',
    driverId: carlos.id,
    driverName: carlos.name,
    status: 'completed',
    routeName: 'Eastside AM',
    vehicleId: carlos.vehicleId,
    totalStops: 3,
    completedStops: 3,
    estimatedDuration: '3h 00m',
    actualDuration: '2h 45m',
    startedAt: '2026-03-07T05:00:00Z',
    completedAt: '2026-03-07T07:45:00Z',
    stops: [
      {
        id: 'stop-c1',
        orderId: 'ord-2026-0406',
        orderNumber: 'ORD-0406',
        accountName: greenfield.name,
        address: greenfield.address,
        city: greenfield.city,
        estimatedArrival: '5:30 AM',
        actualArrival: '5:25 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 3200.00 },
      },
      {
        id: 'stop-c2',
        orderId: 'ord-2026-0407',
        orderNumber: 'ORD-0407',
        accountName: emeraldCity.name,
        address: emeraldCity.address,
        city: emeraldCity.city,
        estimatedArrival: '6:15 AM',
        actualArrival: '6:20 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 2800.00 },
      },
      {
        id: 'stop-c3',
        orderId: 'ord-2026-0408',
        orderNumber: 'ORD-0408',
        accountName: capitolHill.name,
        address: capitolHill.address,
        city: capitolHill.city,
        estimatedArrival: '7:00 AM',
        actualArrival: '6:55 AM',
        status: 'delivered',
        paymentCollected: { method: 'COD', amount: 1000.00, checkNumber: 'CHK-9201' },
      },
    ],
  },

  // Route 4 — Olympia Afternoon (Sarah Kim): 2 stops, loading
  {
    id: 'run-004',
    driverId: sarah.id,
    driverName: sarah.name,
    status: 'loading',
    routeName: 'Olympia Afternoon',
    vehicleId: sarah.vehicleId,
    totalStops: 2,
    completedStops: 0,
    estimatedDuration: '3h 30m',
    stops: [
      {
        id: 'stop-d1',
        orderId: 'ord-2026-0409',
        orderNumber: 'ORD-0409',
        accountName: olympic.name,
        address: olympic.address,
        city: olympic.city,
        estimatedArrival: '2:00 PM',
        status: 'pending',
      },
      {
        id: 'stop-d2',
        orderId: 'ord-2026-0410',
        orderNumber: 'ORD-0410',
        accountName: pugetSound.name,
        address: pugetSound.address,
        city: pugetSound.city,
        estimatedArrival: '3:30 PM',
        status: 'pending',
      },
    ],
  },
];

const metrics: DeliveryMetrics = {
  totalDeliveries: 4,
  completedToday: 5,
  inTransit: 2,
  avgDeliveryTime: 52,
  onTimeRate: 96,
  driversActive: 3,
  revenueDeliveredToday: 18400,
  paymentsCollectedToday: 7200,
};

// — Export functions —

export async function getDeliveryRuns(filters?: {
  status?: DeliveryRunStatus;
  search?: string;
}): Promise<DeliveryRun[]> {
  await delay(400);
  let result = [...runs];
  if (filters?.status) {
    result = result.filter((r) => r.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.routeName.toLowerCase().includes(q) ||
        r.driverName.toLowerCase().includes(q) ||
        r.stops.some((s) => s.accountName.toLowerCase().includes(q))
    );
  }
  return result;
}

export async function getDeliveryRun(id: string): Promise<DeliveryRun | undefined> {
  await delay(300);
  return runs.find((r) => r.id === id);
}

export async function getDrivers(): Promise<DeliveryDriver[]> {
  await delay(300);
  return drivers;
}

export async function getDeliveryMetrics(): Promise<DeliveryMetrics> {
  await delay(300);
  return metrics;
}

export async function getDeliverySchedule(): Promise<ScheduleEntry[]> {
  await delay(300);
  return [
    { id: 'sched-1', time: '8:00 AM', accountName: 'Greenfield Dispensary', city: 'Seattle', status: 'completed', orderValue: 4200, paymentMethod: 'COD', driverName: 'James Cooper', routeName: 'Seattle Metro' },
    { id: 'sched-2', time: '9:30 AM', accountName: 'Capitol Hill Collective', city: 'Seattle', status: 'completed', orderValue: 2100, paymentMethod: 'ACH', driverName: 'James Cooper', routeName: 'Seattle Metro' },
    { id: 'sched-3', time: '11:00 AM', accountName: 'Emerald City Cannabis', city: 'Redmond', status: 'in-transit', orderValue: 3800, paymentMethod: 'ACH', driverName: 'James Cooper', routeName: 'Seattle Metro' },
    { id: 'sched-4', time: '11:30 AM', accountName: 'Pacific Leaf', city: 'Tacoma', status: 'in-transit', orderValue: 5100, paymentMethod: 'COD', driverName: 'Roberto Flores', routeName: 'Tacoma Run' },
    { id: 'sched-5', time: '1:00 PM', accountName: 'Rainier Remedies', city: 'Tacoma', status: 'upcoming', orderValue: 3200, paymentMethod: 'Check', driverName: 'Roberto Flores', routeName: 'Tacoma Run' },
    { id: 'sched-6', time: '2:00 PM', accountName: 'Olympic Greens', city: 'Olympia', status: 'loading', orderValue: 4800, paymentMethod: 'COD', driverName: 'Sarah Kim', routeName: 'Olympia Afternoon' },
    { id: 'sched-7', time: '3:30 PM', accountName: 'Puget Sound Provisions', city: 'Olympia', status: 'loading', orderValue: 3600, paymentMethod: 'ACH', driverName: 'Sarah Kim', routeName: 'Olympia Afternoon' },
  ];
}
