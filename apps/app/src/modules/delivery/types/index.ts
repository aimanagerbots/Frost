export type DeliveryRunStatus =
  | 'loading'
  | 'in-transit'
  | 'delivering'
  | 'returning'
  | 'completed';

export type DeliveryStopStatus = 'pending' | 'arrived' | 'delivered' | 'failed';

export type DriverStatus = 'available' | 'on-route' | 'off-duty';

export interface DeliveryStop {
  id: string;
  orderId: string;
  orderNumber: string;
  accountName: string;
  address: string;
  city: string;
  estimatedArrival: string;
  actualArrival?: string;
  status: DeliveryStopStatus;
  proofOfDelivery?: string;
  paymentCollected?: {
    method: string;
    amount: number;
    checkNumber?: string;
  };
  notes?: string;
}

export interface DeliveryRun {
  id: string;
  driverId: string;
  driverName: string;
  status: DeliveryRunStatus;
  stops: DeliveryStop[];
  totalStops: number;
  completedStops: number;
  estimatedDuration: string;
  actualDuration?: string;
  startedAt?: string;
  completedAt?: string;
  vehicleId: string;
  routeName: string;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  vehicleId: string;
  vehicleName: string;
  status: DriverStatus;
  deliveriesToday: number;
  onTimeRate: number;
}

export interface DeliveryMetrics {
  totalDeliveries: number;
  completedToday: number;
  inTransit: number;
  avgDeliveryTime: number;
  onTimeRate: number;
  driversActive: number;
  revenueDeliveredToday: number;
  paymentsCollectedToday: number;
}

export interface ScheduleEntry {
  id: string;
  time: string;
  accountName: string;
  city: string;
  status: 'completed' | 'in-transit' | 'loading' | 'upcoming';
  orderValue: number;
  paymentMethod: string;
  driverName: string;
  routeName: string;
}
