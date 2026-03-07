import type {
  DeliveryRun,
  DeliveryDriver,
  DeliveryMetrics,
  DeliveryRunStatus,
} from '@/modules/delivery/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// — Drivers —

const drivers: DeliveryDriver[] = [
  {
    id: 'drv-001',
    name: 'Mike Torres',
    phone: '(206) 555-0147',
    vehicleId: 'veh-001',
    vehicleName: '2023 Ford Transit — WA-FRT-001',
    status: 'on-route',
    deliveriesToday: 5,
    onTimeRate: 94,
  },
  {
    id: 'drv-002',
    name: 'Chris Petersen',
    phone: '(206) 555-0283',
    vehicleId: 'veh-002',
    vehicleName: '2022 Mercedes Sprinter — WA-SPR-002',
    status: 'on-route',
    deliveriesToday: 4,
    onTimeRate: 88,
  },
  {
    id: 'drv-003',
    name: 'Amy Nakamura',
    phone: '(509) 555-0391',
    vehicleId: 'veh-003',
    vehicleName: '2024 RAM ProMaster — WA-RPM-003',
    status: 'off-duty',
    deliveriesToday: 0,
    onTimeRate: 96,
  },
];

// — Delivery Runs —

const runs: DeliveryRun[] = [
  // Route A — Seattle North (in-transit, 3 of 5 delivered)
  {
    id: 'run-001',
    driverId: 'drv-001',
    driverName: 'Mike Torres',
    status: 'in-transit',
    routeName: 'Route A — Seattle North',
    vehicleId: 'veh-001',
    totalStops: 5,
    completedStops: 3,
    estimatedDuration: '4h 30m',
    startedAt: '2024-12-15T08:00:00Z',
    stops: [
      {
        id: 'stop-a1',
        orderId: 'ord-2024-0301',
        orderNumber: 'ORD-0301',
        accountName: 'Greenfield Dispensary',
        address: '4521 University Way NE',
        city: 'Seattle',
        estimatedArrival: '8:30 AM',
        actualArrival: '8:28 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 4250.00 },
      },
      {
        id: 'stop-a2',
        orderId: 'ord-2024-0302',
        orderNumber: 'ORD-0302',
        accountName: 'Ballard Buds',
        address: '5432 Ballard Ave NW',
        city: 'Seattle',
        estimatedArrival: '9:15 AM',
        actualArrival: '9:22 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 2180.00 },
        notes: 'Delivered to back entrance per account preference',
      },
      {
        id: 'stop-a3',
        orderId: 'ord-2024-0303',
        orderNumber: 'ORD-0303',
        accountName: 'Fremont Flowers',
        address: '3601 Fremont Ave N',
        city: 'Seattle',
        estimatedArrival: '10:00 AM',
        actualArrival: '9:55 AM',
        status: 'delivered',
        paymentCollected: { method: 'COD', amount: 3120.00, checkNumber: 'CHK-8847' },
      },
      {
        id: 'stop-a4',
        orderId: 'ord-2024-0304',
        orderNumber: 'ORD-0304',
        accountName: 'Green Lake Gardens',
        address: '7201 E Green Lake Dr N',
        city: 'Seattle',
        estimatedArrival: '10:45 AM',
        status: 'pending',
      },
      {
        id: 'stop-a5',
        orderId: 'ord-2024-0305',
        orderNumber: 'ORD-0305',
        accountName: 'Capitol Hill Cannabis',
        address: '1520 Broadway',
        city: 'Seattle',
        estimatedArrival: '11:30 AM',
        status: 'pending',
      },
    ],
  },

  // Route B — Seattle South/Tacoma (loading)
  {
    id: 'run-002',
    driverId: 'drv-002',
    driverName: 'Chris Petersen',
    status: 'loading',
    routeName: 'Route B — Seattle South / Tacoma',
    vehicleId: 'veh-002',
    totalStops: 4,
    completedStops: 0,
    estimatedDuration: '5h 15m',
    stops: [
      {
        id: 'stop-b1',
        orderId: 'ord-2024-0306',
        orderNumber: 'ORD-0306',
        accountName: 'Puget Sound Wellness',
        address: '2815 S Jackson St',
        city: 'Seattle',
        estimatedArrival: '10:00 AM',
        status: 'pending',
      },
      {
        id: 'stop-b2',
        orderId: 'ord-2024-0307',
        orderNumber: 'ORD-0307',
        accountName: 'Rainier Remedies',
        address: '5601 Rainier Ave S',
        city: 'Seattle',
        estimatedArrival: '10:45 AM',
        status: 'pending',
      },
      {
        id: 'stop-b3',
        orderId: 'ord-2024-0308',
        orderNumber: 'ORD-0308',
        accountName: 'Tacoma Treehouse',
        address: '1932 Pacific Ave',
        city: 'Tacoma',
        estimatedArrival: '12:00 PM',
        status: 'pending',
      },
      {
        id: 'stop-b4',
        orderId: 'ord-2024-0309',
        orderNumber: 'ORD-0309',
        accountName: 'Cascade Cannabis Co.',
        address: '3408 6th Ave',
        city: 'Tacoma',
        estimatedArrival: '1:00 PM',
        status: 'pending',
      },
    ],
  },

  // Route C — Eastside (completed this morning)
  {
    id: 'run-003',
    driverId: 'drv-001',
    driverName: 'Mike Torres',
    status: 'completed',
    routeName: 'Route C — Eastside',
    vehicleId: 'veh-001',
    totalStops: 3,
    completedStops: 3,
    estimatedDuration: '3h 00m',
    actualDuration: '2h 45m',
    startedAt: '2024-12-15T05:00:00Z',
    completedAt: '2024-12-15T07:45:00Z',
    stops: [
      {
        id: 'stop-c1',
        orderId: 'ord-2024-0310',
        orderNumber: 'ORD-0310',
        accountName: 'Summit Therapeutics',
        address: '10230 NE 10th St',
        city: 'Bellevue',
        estimatedArrival: '5:30 AM',
        actualArrival: '5:25 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 5890.00 },
      },
      {
        id: 'stop-c2',
        orderId: 'ord-2024-0311',
        orderNumber: 'ORD-0311',
        accountName: 'Rainier Remedies',
        address: '15600 NE 8th St',
        city: 'Bellevue',
        estimatedArrival: '6:15 AM',
        actualArrival: '6:30 AM',
        status: 'delivered',
        paymentCollected: { method: 'COD', amount: 2750.00, checkNumber: 'CHK-9012' },
        notes: 'Payment received — check post-dated to 12/20. Manager aware.',
      },
      {
        id: 'stop-c3',
        orderId: 'ord-2024-0312',
        orderNumber: 'ORD-0312',
        accountName: 'Emerald City Collective',
        address: '8401 164th Ave NE',
        city: 'Redmond',
        estimatedArrival: '7:00 AM',
        actualArrival: '6:55 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 1620.00 },
      },
    ],
  },

  // Route D — Olympia/South Sound (scheduled tomorrow)
  {
    id: 'run-004',
    driverId: 'drv-003',
    driverName: 'Amy Nakamura',
    status: 'loading',
    routeName: 'Route D — Olympia / South Sound',
    vehicleId: 'veh-003',
    totalStops: 3,
    completedStops: 0,
    estimatedDuration: '4h 00m',
    stops: [
      {
        id: 'stop-d1',
        orderId: 'ord-2024-0313',
        orderNumber: 'ORD-0313',
        accountName: 'Olympia Organic',
        address: '521 Capitol Way S',
        city: 'Olympia',
        estimatedArrival: '9:00 AM',
        status: 'pending',
      },
      {
        id: 'stop-d2',
        orderId: 'ord-2024-0314',
        orderNumber: 'ORD-0314',
        accountName: 'Tumwater Terpenes',
        address: '330 Israel Rd SW',
        city: 'Tumwater',
        estimatedArrival: '10:00 AM',
        status: 'pending',
      },
      {
        id: 'stop-d3',
        orderId: 'ord-2024-0315',
        orderNumber: 'ORD-0315',
        accountName: 'Centralia Cannabis',
        address: '1218 Harrison Ave',
        city: 'Centralia',
        estimatedArrival: '11:30 AM',
        status: 'pending',
      },
    ],
  },

  // Route E — Spokane (completed yesterday)
  {
    id: 'run-005',
    driverId: 'drv-003',
    driverName: 'Amy Nakamura',
    status: 'completed',
    routeName: 'Route E — Spokane',
    vehicleId: 'veh-003',
    totalStops: 4,
    completedStops: 4,
    estimatedDuration: '5h 30m',
    actualDuration: '5h 10m',
    startedAt: '2024-12-14T06:00:00Z',
    completedAt: '2024-12-14T11:10:00Z',
    stops: [
      {
        id: 'stop-e1',
        orderId: 'ord-2024-0290',
        orderNumber: 'ORD-0290',
        accountName: 'Spokane Stems',
        address: '1303 N Washington St',
        city: 'Spokane',
        estimatedArrival: '9:00 AM',
        actualArrival: '8:55 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 3450.00 },
      },
      {
        id: 'stop-e2',
        orderId: 'ord-2024-0291',
        orderNumber: 'ORD-0291',
        accountName: 'Inland Empire Greens',
        address: '4727 E Sprague Ave',
        city: 'Spokane',
        estimatedArrival: '9:45 AM',
        actualArrival: '9:50 AM',
        status: 'delivered',
        paymentCollected: { method: 'COD', amount: 2100.00, checkNumber: 'CHK-7733' },
      },
      {
        id: 'stop-e3',
        orderId: 'ord-2024-0292',
        orderNumber: 'ORD-0292',
        accountName: 'Liberty Lake Leaf',
        address: '1328 N Liberty Lake Rd',
        city: 'Liberty Lake',
        estimatedArrival: '10:30 AM',
        actualArrival: '10:25 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 1880.00 },
      },
      {
        id: 'stop-e4',
        orderId: 'ord-2024-0293',
        orderNumber: 'ORD-0293',
        accountName: 'Valley Vapor Lounge',
        address: '12505 E Sprague Ave',
        city: 'Spokane Valley',
        estimatedArrival: '11:15 AM',
        actualArrival: '11:10 AM',
        status: 'delivered',
        paymentCollected: { method: 'ACH', amount: 950.00 },
      },
    ],
  },

  // Route F — Bellingham (scheduled next week)
  {
    id: 'run-006',
    driverId: 'drv-002',
    driverName: 'Chris Petersen',
    status: 'loading',
    routeName: 'Route F — Bellingham',
    vehicleId: 'veh-002',
    totalStops: 2,
    completedStops: 0,
    estimatedDuration: '3h 30m',
    stops: [
      {
        id: 'stop-f1',
        orderId: 'ord-2024-0350',
        orderNumber: 'ORD-0350',
        accountName: 'Bellingham Botanicals',
        address: '1200 Harris Ave',
        city: 'Bellingham',
        estimatedArrival: '10:00 AM',
        status: 'pending',
      },
      {
        id: 'stop-f2',
        orderId: 'ord-2024-0351',
        orderNumber: 'ORD-0351',
        accountName: 'Whatcom Wellness',
        address: '4189 Meridian St',
        city: 'Bellingham',
        estimatedArrival: '11:00 AM',
        status: 'pending',
      },
    ],
  },
];

const metrics: DeliveryMetrics = {
  totalDeliveries: 6,
  completedToday: 12,
  inTransit: 2,
  avgDeliveryTime: 35,
  onTimeRate: 93,
  driversActive: 3,
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
