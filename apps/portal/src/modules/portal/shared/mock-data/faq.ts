import type { PortalFAQItem } from '../types';

export const PORTAL_FAQ: PortalFAQItem[] = [
  // Ordering (4)
  {
    id: 'faq-001',
    category: 'ordering',
    question: 'How do I place an order?',
    answer: 'Browse the product catalog, add items to your cart, and proceed to checkout. You can filter by category, strain type, or availability. Orders are confirmed within one business day and your sales rep will reach out if there are any issues.',
  },
  {
    id: 'faq-002',
    category: 'ordering',
    question: 'How do I use order templates?',
    answer: 'Order templates let you save frequently ordered combinations for one-click reordering. After placing an order, click "Save as Template" on the confirmation page. You can also create templates manually from the Templates section and adjust quantities anytime.',
  },
  {
    id: 'faq-003',
    category: 'ordering',
    question: 'How do I apply volume discounts?',
    answer: 'Volume discounts are applied automatically when your cart meets the minimum quantity thresholds. Each product displays its volume breaks on the product detail page. The discount is reflected in your cart total before checkout.',
  },
  {
    id: 'faq-004',
    category: 'ordering',
    question: 'What is the minimum order amount?',
    answer: 'The minimum wholesale order is $250. There is no minimum for individual product quantities, but volume discounts only kick in at the thresholds listed on each product. Your sales rep can help you build an optimal order if you are close to a discount tier.',
  },

  // Delivery (3)
  {
    id: 'faq-005',
    category: 'delivery',
    question: 'What is the delivery schedule and how do delivery windows work?',
    answer: 'Deliveries are scheduled on your assigned route day, typically once per week. Your delivery window is a 3-4 hour block that you set in your account preferences. You will receive a notification when the driver is en route with a live ETA.',
  },
  {
    id: 'faq-006',
    category: 'delivery',
    question: 'How do I reschedule a delivery?',
    answer: 'To reschedule, go to the Deliveries section and click "Reschedule" on the upcoming delivery. You can move it to any available slot within the next 7 days. Please reschedule at least 24 hours in advance to avoid route conflicts.',
  },
  {
    id: 'faq-007',
    category: 'delivery',
    question: 'What should I do if my delivery is late?',
    answer: 'If your delivery has not arrived within the scheduled window, check the Deliveries page for a live ETA update. If the driver is delayed, you will receive an automatic notification. For unresolved issues, message your sales rep directly through the portal or call the number on the delivery confirmation.',
  },

  // Payment (3)
  {
    id: 'faq-008',
    category: 'payment',
    question: 'What payment methods are accepted?',
    answer: 'We accept ACH bank transfers and electronic checks (eCheck). Credit cards are not accepted for wholesale orders due to cannabis industry regulations. ACH is recommended for faster processing and automatic payments on due dates.',
  },
  {
    id: 'faq-009',
    category: 'payment',
    question: 'When are invoices due?',
    answer: 'Invoices are issued upon delivery and are due within 14 days. You will receive payment reminders at 7 days, 3 days, and 1 day before the due date. Late payments may affect your account health score and future ordering privileges.',
  },
  {
    id: 'faq-010',
    category: 'payment',
    question: 'How do I set up ACH payments?',
    answer: 'Go to Account Settings and select Payment Methods. Click "Add ACH Account" and enter your bank routing and account numbers. Verification takes 1-2 business days via micro-deposit. Once verified, you can set ACH as your default payment method for automatic invoice payments.',
  },

  // Products (3)
  {
    id: 'faq-011',
    category: 'products',
    question: 'How do I view COA and lab results?',
    answer: 'Every product has lab results available. Go to the Lab Results section to browse COAs by product or batch number. Each COA includes THC/CBD potency, terpene profiles, and pass/fail status for contaminants. You can download PDFs to share with your customers.',
  },
  {
    id: 'faq-012',
    category: 'products',
    question: 'How do I check product availability and stock levels?',
    answer: 'The product catalog shows real-time availability with "In Stock" or "Low Stock" badges. You can also view the Production Calendar to see what is coming down the pipeline. Enable stock alert notifications to get notified when popular products are restocked.',
  },
  {
    id: 'faq-013',
    category: 'products',
    question: 'How do I get notified about new products?',
    answer: 'Enable "New Products" in your notification preferences under Account Settings. You will receive alerts when new strains, product lines, or seasonal items are added to the catalog. Your sales rep will also proactively share recommendations tailored to your store.',
  },

  // Account (3)
  {
    id: 'faq-014',
    category: 'account',
    question: 'How do I update my account information?',
    answer: 'Go to Account Settings to update your business address, delivery address, phone number, and other details. License information changes require verification and may take 1-2 business days to process. Contact your sales rep if you need to update your business name or license number.',
  },
  {
    id: 'faq-015',
    category: 'account',
    question: 'How do I add additional portal users?',
    answer: 'Account owners and managers can add new portal users from Account Settings under the Users tab. Enter the user\'s name, email, and role (buyer, manager, or budtender). They will receive an invitation email to set up their login credentials.',
  },
  {
    id: 'faq-016',
    category: 'account',
    question: 'How do I change my notification preferences?',
    answer: 'Go to Account Settings and select Notifications. You can toggle individual notification types on or off and choose your preferred delivery method (email, SMS, or both). Changes take effect immediately for all future notifications.',
  },

  // Store Orders (5)
  {
    id: 'faq-017',
    category: 'store-orders',
    question: 'How do consumer pickup orders work?',
    answer: 'When a customer places an order through your connected menu (Dutchie, Jane, etc.) or the Frost website, it appears in your Store Orders queue. You accept the order, prepare the items, and mark it ready for pickup. The customer is notified at each step.',
  },
  {
    id: 'faq-018',
    category: 'store-orders',
    question: 'How do I connect my Dutchie or Jane menu?',
    answer: 'Go to Store Orders settings and click "Connect Integration." Select your platform (Dutchie, Jane, Weedmaps, etc.), enter your store ID and API credentials, and click Connect. Orders will begin flowing in real-time once the integration is active.',
  },
  {
    id: 'faq-019',
    category: 'store-orders',
    question: 'What happens if I miss a consumer order?',
    answer: 'Orders that are not accepted within 15 minutes trigger an alert notification. If an order goes unaccepted for over 30 minutes, your sales rep is notified. The customer can cancel at any time before the order is marked as ready. We recommend enabling push notifications so you never miss an order.',
  },
  {
    id: 'faq-020',
    category: 'store-orders',
    question: 'How does auto-accept work?',
    answer: 'When auto-accept is enabled, incoming consumer orders are automatically accepted and moved to the preparing queue. This saves time during busy periods but means you should monitor inventory closely to avoid accepting orders you cannot fulfill. You can toggle auto-accept on or off from the Store Orders settings.',
  },
  {
    id: 'faq-021',
    category: 'store-orders',
    question: 'How do I view store order analytics?',
    answer: 'The Store Orders dashboard shows key metrics including orders today, average prep time, fill rate, and no-show rate. You can also view orders by source (Dutchie, Jane, walk-in, etc.), popular products, and hourly volume trends to help optimize your staffing and inventory.',
  },
];
