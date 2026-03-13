// Accounts module types — re-exports from sales/types + component-specific types

export type {
  SalesAccount,
  SalesContact,
  SalesOrder,
  SalesOrderStatus,
  AccountStatus,
  FulfillmentPriority,
} from '@/modules/sales/types';

/** Tab filter for the accounts list view */
export type AccountListTab = 'active' | 'inactive' | 'all';

/** Tab for the account detail view */
export type AccountDetailTab = 'analytics' | 'orders' | 'notes' | 'recommendations' | 'discounts';

/** Quick filter form values */
export interface AccountQuickFilters {
  licenseType: string;
  accountStatus: string;
  invitationStatus: string;
  searchClient: string;
  searchContact: string;
  assignee: string;
}

/** Invite form values */
export interface InviteFormValues {
  clientName: string;
  address: string;
  licenseUBI: string;
  email: string;
  message: string;
}

/** Add contact form values */
export interface AddContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  phone: string;
  phoneType: string;
  note: string;
}

/** Update client info form values */
export interface UpdateClientInfoFormValues {
  holdingCompany: string;
  name: string;
  licenseNo: string;
  ubi: string;
  streetAddress: string;
  city: string;
  state: string;
  county: string;
  zipCode: string;
  phone: string;
  licenseType: string;
  route: string;
  partnershipStatus: string;
  privilegeDescription: string;
  privilegeStatus: string;
  workflowStatus: string;
  doBusinessAs: string;
}

/** Update notes form values */
export interface UpdateNotesFormValues {
  note: string;
  sentSamples: boolean;
  leftVoicemail: boolean;
  emailed: boolean;
  called: boolean;
}

/** Delivery preferences form values */
export interface DeliveryPrefsFormValues {
  acceptsDays: string[];
  acceptsAmPm: { am: boolean; pm: boolean };
  prefersDays: string[];
  prefersAmPm: { am: boolean; pm: boolean };
  specialInstructions: string;
  labelBarcodePreference: string;
}

/** Inventory preferences form values */
export interface InventoryPrefsFormValues {
  fulfillmentPriority: string;
  specialInstructions: string;
  recentlyBoughtDays: string;
  boughtLongTimeAgoDays: string;
  neverBoughtDays: string;
}

/** New non-cannabis account form values */
export interface AddNonCannabisFormValues {
  holdingCompany: string;
  partnershipStatus: string;
  name: string;
  workflowStatus: string;
  streetAddress: string;
  doBusinessAs: string;
  city: string;
  state: string;
  county: string;
  zipCode: string;
  route: string;
  phone: string;
}

/** Discount row for discounts tab */
export interface AccountDiscount {
  id: string;
  productName: string;
  price: number;
  discountPrice: number;
  quantity: number;
}
