// ========================
// ACCOUNT & CONTACTS
// ========================

export interface PortalAccount {
  id: string;
  businessName: string;
  dba: string;
  licenseNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  primaryContact: PortalContact;
  contacts: PortalContact[];
  assignedRep: PortalSalesRep;
  healthScore: number;
  healthStatus: 'thriving' | 'healthy' | 'at-risk' | 'churning';
  pipelineStatus: string;
  pipelineLabel: string;
  vmiEnrolled: boolean;
  pricingTier: 1 | 2 | 3;
  preferredDeliveryWindow: {
    days: string[];
    timeStart: string;
    timeEnd: string;
    specialInstructions?: string;
  };
  lifetimeRevenue: number;
  outstandingBalance: number;
  lastOrderDate: string;
  accountSince: string;
  notificationPreferences: {
    orderUpdates: boolean;
    deliveryAlerts: boolean;
    newProducts: boolean;
    promotions: boolean;
    paymentReminders: boolean;
    stockAlerts: boolean;
    method: 'email' | 'sms' | 'both';
  };
  savedTemplates: PortalOrderTemplate[];
  unreadNotifications: number;
  unreadMessages: number;
  connectedIntegrations: PortalIntegration[];
  storeOrdersEnabled: boolean;
  autoAcceptOrders: boolean;
}

export interface PortalContact {
  id: string;
  name: string;
  role: 'buyer' | 'owner' | 'manager' | 'budtender';
  email: string;
  phone: string;
  hasPortalAccess: boolean;
  isPrimary: boolean;
}

export interface PortalSalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  territory: string;
  title: string;
}

// ========================
// PRODUCTS & PRICING
// ========================

export interface PortalProduct {
  id: string;
  name: string;
  category: 'flower' | 'prerolls' | 'vaporizers' | 'concentrates' | 'edibles' | 'beverages';
  subCategory: string;
  strainName: string;
  strainType: 'indica' | 'sativa' | 'hybrid';
  thcMin: number;
  thcMax: number;
  cbdMin: number;
  cbdMax: number;
  packageSize: string;
  basePrice: number;
  unitPrice: number;
  volumeBreaks: PortalVolumeBreak[];
  availableQuantity: number;
  brand: string;
  productLine: string;
  description: string;
  imageUrl: string;
  isNew: boolean;
  isPopular: boolean;
  inStock: boolean;
  promotionId?: string;
}

export interface PortalVolumeBreak {
  minQuantity: number;
  discountPercent: number;
  pricePerUnit: number;
}

export interface PortalPromotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'bogo' | 'bundle';
  discountValue: number;
  applicableCategories?: string[];
  applicableProductIds?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  badge: string;
}

// ========================
// CART & TEMPLATES
// ========================

export interface PortalCartItem {
  product: PortalProduct;
  quantity: number;
  appliedDiscount?: {
    type: 'volume' | 'promotion' | 'tier';
    label: string;
    savedAmount: number;
  };
}

export interface PortalOrderTemplate {
  id: string;
  name: string;
  items: { productId: string; quantity: number }[];
  createdAt: string;
  lastUsed?: string;
  estimatedTotal: number;
}

// ========================
// ORDERS (WHOLESALE FROM FROST)
// ========================

export interface PortalOrder {
  id: string;
  orderNumber: string;
  accountId: string;
  orderDate: string;
  status: 'confirmed' | 'in-production' | 'packaged' | 'fulfilled' | 'shipped' | 'delivered' | 'paid';
  paymentStatus: 'pending' | 'invoiced' | 'paid' | 'overdue';
  paymentMethod?: 'ach' | 'echeck';
  items: PortalOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  deliveryId?: string;
  invoiceId?: string;
  notes?: string;
  statusHistory: { status: string; timestamp: string; note?: string }[];
}

export interface PortalOrderItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// ========================
// ORDER PIPELINE TRACKER
// ========================

export interface OrderLineItemStatus {
  productId: string;
  productName: string;
  category: string;
  strainName: string;
  packageSize: string;
  quantityOrdered: number;
  quantityReady: number;
  quantityInProgress: number;
  quantityPending: number;
  currentState: OrderItemReadinessState;
  stateDetail: string;
  estimatedReadyDate?: string;
  isBottleneck: boolean;
}

export type OrderItemReadinessState =
  | 'ready-to-ship'
  | 'packaging'
  | 'in-production'
  | 'in-cultivation'
  | 'awaiting-materials'
  | 'lab-testing';

export type OrderPipelineStep =
  | 'order-placed'
  | 'being-prepared'
  | 'packaging'
  | 'ready-to-ship'
  | 'picked-packed'
  | 'out-for-delivery'
  | 'delivered'
  | 'payment-pending'
  | 'complete';

export interface PortalOrderWithPipeline extends PortalOrder {
  pipelineStep: OrderPipelineStep;
  pipelineStepTimestamps: {
    step: OrderPipelineStep;
    timestamp: string;
    note?: string;
  }[];
  lineItemStatuses: OrderLineItemStatus[];
  bottleneckItem?: {
    productName: string;
    reason: string;
    estimatedReady: string;
  };
  estimatedShipDate?: string;
  estimatedDeliveryDate?: string;
  assignedDriver?: {
    name: string;
    phone: string;
  };
  manifestNumber?: string;
}

// ========================
// STORE ORDERS (CONSUMER PICKUP)
// ========================

export interface StoreOrder {
  id: string;
  orderNumber: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  items: StoreOrderItem[];
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked-up' | 'cancelled' | 'no-show' | 'declined';
  source: 'frost-website' | 'dutchie' | 'jane' | 'weedmaps' | 'leafly' | 'treez' | 'walk-in' | 'other';
  placedAt: string;
  acceptedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  completedAt?: string;
  estimatedPickupTime?: string;
  pickupPreference: 'asap' | string;
  preparedBy?: string;
  customerNotes?: string;
  declineReason?: string;
  statusHistory: { status: string; timestamp: string; note?: string }[];
}

export interface StoreOrderItem {
  productId: string;
  productName: string;
  category: string;
  strainName: string;
  packageSize: string;
  quantity: number;
}

export interface PortalIntegration {
  id: string;
  platform: 'dutchie' | 'jane' | 'treez' | 'flowhub' | 'weedmaps' | 'leafly' | 'custom-webhook' | 'text-bot';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  connectedAt?: string;
  lastSyncAt?: string;
  config?: {
    storeId?: string;
    apiKey?: string;
    webhookUrl?: string;
  };
  label: string;
  description: string;
  logoIcon: string;
}

export interface StoreOrderStats {
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  avgPrepTimeMinutes: number;
  fillRate: number;
  noShowRate: number;
  ordersBySource: { source: string; count: number }[];
  ordersByHour: { hour: number; count: number }[];
  popularProducts: { productName: string; orderCount: number }[];
}

// ========================
// DELIVERIES
// ========================

export interface PortalDelivery {
  id: string;
  orderId: string;
  orderNumber: string;
  scheduledDate: string;
  scheduledWindow: { start: string; end: string };
  status: 'scheduled' | 'in-transit' | 'delivered' | 'rescheduled';
  driver: { name: string; phone: string };
  eta?: string;
  deliveredAt?: string;
  signature?: string;
  items: PortalOrderItem[];
  notes?: string;
  trackingLocation?: { lat: number; lng: number; lastUpdated: string };
}

// ========================
// PAYMENTS & INVOICES
// ========================

export interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  issueDate: string;
  dueDate: string;
  deliveryDate: string;
  amount: number;
  status: 'outstanding' | 'paid' | 'overdue';
  paidDate?: string;
  paymentMethod?: 'ach' | 'echeck';
  daysElapsed: number;
  complianceStatus: 'compliant' | 'approaching' | 'overdue';
}

export interface PortalPaymentMethod {
  id: string;
  type: 'ach' | 'echeck';
  label: string;
  bankName?: string;
  lastFour?: string;
  isDefault: boolean;
}

// ========================
// NOTIFICATIONS
// ========================

export interface PortalNotification {
  id: string;
  type:
    | 'order_update'
    | 'delivery_alert'
    | 'payment_reminder'
    | 'payment_overdue'
    | 'stock_alert'
    | 'new_product'
    | 'promotion'
    | 'message'
    | 'ai_suggestion'
    | 'store_order';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon: string;
  severity?: 'info' | 'warning' | 'urgent';
}

// ========================
// MESSAGES
// ========================

export interface PortalMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'dispensary' | 'rep';
  content: string;
  timestamp: string;
  read: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface PortalMessageThread {
  id: string;
  accountId: string;
  repId: string;
  repName: string;
  messages: PortalMessage[];
  lastMessageAt: string;
  unreadCount: number;
}

// ========================
// COAs
// ========================

export interface PortalCOA {
  id: string;
  batchNumber: string;
  productName: string;
  category: string;
  testDate: string;
  lab: string;
  thcResult: number;
  cbdResult: number;
  terpenes: { name: string; percentage: number }[];
  passStatus: 'pass' | 'fail';
  downloadUrl: string;
}

// ========================
// PRODUCTION PREVIEW
// ========================

export interface PortalProductionItem {
  id: string;
  type: 'cultivation' | 'manufacturing';
  strainName: string;
  productName?: string;
  category: string;
  currentStage: string;
  estimatedDate: string;
  estimatedQuantity: string;
  reserved: boolean;
}

// ========================
// SUPPORT
// ========================

export interface PortalSupportTicket {
  id: string;
  subject: string;
  category: 'ordering' | 'delivery' | 'payment' | 'product' | 'account' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface PortalFAQItem {
  id: string;
  category: 'ordering' | 'delivery' | 'payment' | 'products' | 'account' | 'store-orders';
  question: string;
  answer: string;
}

// ========================
// AI CONVERSATIONS
// ========================

export interface PortalAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cartActions?: { productId: string; productName: string; quantity: number }[];
  templateSuggestion?: { name: string; items: { productId: string; quantity: number }[] };
}

export interface PortalAIConversation {
  id: string;
  title: string;
  messages: PortalAIMessage[];
  createdAt: string;
}

// ========================
// REWARDS & LOYALTY
// ========================

export interface RewardsTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minPoints: number;
  benefits: string[];
  color: string;
  discountPercent: number;
}

export interface PointsTransaction {
  id: string;
  date: string;
  type: 'earn' | 'redeem';
  amount: number;
  source: 'order' | 'early-payment' | 'training' | 'event' | 'referral' | 'achievement' | 'redemption';
  description: string;
  orderId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ordering' | 'loyalty' | 'engagement' | 'performance';
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'credit' | 'product' | 'access' | 'merch' | 'service';
  imageUrl?: string;
  available: boolean;
  limitedQuantity?: number;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  tier: string;
  points: number;
  isCurrentUser: boolean;
}

export interface PortalRewardsData {
  currentTier: RewardsTier;
  nextTier: RewardsTier | null;
  totalPoints: number;
  pointsToNextTier: number;
  lifetimePoints: number;
  transactions: PointsTransaction[];
  achievements: Achievement[];
  catalog: RewardItem[];
  leaderboard: LeaderboardEntry[];
  quarterlyRebate: number;
  totalSavings: number;
}

// ========================
// INSIGHTS & ANALYTICS
// ========================

export interface PerformanceMetric {
  skuId: string;
  name: string;
  category: string;
  velocity: number;
  categoryAvg: number;
  turnRate: number;
  daysOnShelf: number;
  unitsSoldThisMonth: number;
  revenueThisMonth: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PeerBenchmark {
  metric: string;
  label: string;
  yourValue: number;
  peerAvg: number;
  topPerformerValue: number;
  percentile: number;
  unit: string;
}

export interface MarketTrend {
  category: string;
  growth: number;
  period: string;
  region: string;
  insight: string;
}

export interface MarginCalc {
  productId: string;
  productName: string;
  wholesalePrice: number;
  suggestedRetail: number;
  margin: number;
  volumeBreakMargin?: number;
  volumeBreakQty?: number;
}

export interface AIRecommendation {
  id: string;
  type: 'add-sku' | 'increase-qty' | 'new-category' | 'reorder-now';
  productId: string;
  productName: string;
  rationale: string;
  projectedRevenue: number;
  confidence: number;
}

export interface PortalInsightsData {
  performance: PerformanceMetric[];
  benchmarks: PeerBenchmark[];
  trends: MarketTrend[];
  margins: MarginCalc[];
  recommendations: AIRecommendation[];
  frostVsCategoryMultiplier: number;
  overallVelocityRank: number;
  totalStoresInRegion: number;
}

// ========================
// MARKETING & MERCHANDISING
// ========================

export interface MenuAsset {
  id: string;
  productId: string;
  productName: string;
  type: 'photo' | 'description' | 'terpene-card' | 'bundle';
  format: string;
  platforms: string[];
  downloadUrl: string;
  thumbnailUrl: string;
}

export interface POPMaterial {
  id: string;
  name: string;
  type: 'counter-card' | 'shelf-talker' | 'window-cling' | 'table-tent' | 'poster';
  imageUrl: string;
  freeWithMinOrder?: number;
  description: string;
  dimensions: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  pointsReward: number;
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  category: 'product-knowledge' | 'selling-techniques' | 'compliance' | 'brand-story';
}

export interface PromoProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  enrolled: boolean;
  requirements: string[];
  reward: string;
  rewardValue: number;
  spotsRemaining?: number;
}

export interface BudtenderContest {
  id: string;
  title: string;
  period: string;
  metric: string;
  prize: string;
  prizeValue: number;
  active: boolean;
  leaderboard: { name: string; storeName: string; sales: number; rank: number }[];
}

// ========================
// COMMS HUB (UNIFIED)
// ========================

export interface CommChannel {
  id: string;
  type: 'sms' | 'email' | 'whatsapp' | 'portal';
  connected: boolean;
  identifier: string;
  label: string;
  notificationsEnabled: boolean;
}

export interface UnifiedMessage {
  id: string;
  channel: 'portal' | 'sms' | 'email' | 'whatsapp';
  sender: 'user' | 'ai' | 'rep';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  cartActions?: CartAction[];
  escalated?: boolean;
  attachmentUrl?: string;
}

export interface CartAction {
  productId: string;
  productName: string;
  quantity: number;
  action: 'add' | 'remove';
}

// ========================
// DASHBOARD SCORECARD
// ========================

export interface DashboardScorecardData {
  frostVelocity: number;
  categoryAvgVelocity: number;
  velocityMultiplier: number;
  totalUnitsSold: number;
  totalRevenue: number;
  avgTurnRate: number;
  avgDaysOnShelf: number;
  topSku: { name: string; velocity: number };
  frostSkuCount: number;
  peerAvgSkuCount: number;
}

export interface DashboardSavingsData {
  totalSavingsThisQuarter: number;
  volumeDiscounts: number;
  loyaltyRebates: number;
  promoCredits: number;
  earlyPayCredits: number;
}

export interface FlashDeal {
  id: string;
  productId: string;
  productName: string;
  category: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  expiresAt: string;
  claimed: boolean;
  totalAvailable: number;
  totalClaimed: number;
}

export interface AllocationDrop {
  id: string;
  productName: string;
  strainName: string;
  category: string;
  dropDate: string;
  reservationDeadline: string;
  totalAllocations: number;
  allocationsRemaining: number;
  reserved: boolean;
  estimatedPrice: number;
}
