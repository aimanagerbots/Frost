'use client';

import { useState } from 'react';
import {
  ArrowLeft, Mail, UserPlus, Pencil, Star,
  DollarSign, ShoppingCart, Truck, Package,
} from 'lucide-react';
import { StatusBadge } from '@/components';
import { AccountDetailTabs } from './AccountDetailTabs';
import { InviteModal } from './InviteModal';
import { AssignSalespersonModal } from './AssignSalespersonModal';
import { AddContactModal } from './AddContactModal';
import { UpdateClientInfoModal } from './UpdateClientInfoModal';
import { UpdateNotesModal } from './UpdateNotesModal';
import { UpdateDeliveryPrefsModal } from './UpdateDeliveryPrefsModal';
import { UpdateInventoryPrefsModal } from './UpdateInventoryPrefsModal';
import type { SalesAccount, AccountDetailTab } from '../types';

const ACCENT = '#F59E0B';

interface AccountDetailProps {
  account: SalesAccount;
  onBack: () => void;
}

type ModalKey = 'invite' | 'assign' | 'contact' | 'clientInfo' | 'notes' | 'deliveryPrefs' | 'inventoryPrefs' | null;

function SalesStatCard({ icon: Icon, label, value }: { icon: typeof DollarSign; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-default bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${ACCENT}20` }}>
        <Icon className="h-5 w-5" style={{ color: ACCENT }} />
      </div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-lg font-semibold" style={{ color: ACCENT }}>{value}</p>
      </div>
    </div>
  );
}

export function AccountDetail({ account, onBack }: AccountDetailProps) {
  const [activeTab, setActiveTab] = useState<AccountDetailTab>('analytics');
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-default"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Accounts
      </button>

      {/* Layout: sidebar + tabs */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left sidebar — account info */}
        <div className="w-full shrink-0 space-y-4 lg:w-80">
          {/* Account header card */}
          <div className="relative rounded-xl border border-default bg-card p-5">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ backgroundColor: ACCENT }} />
            <h2 className="text-xl font-bold uppercase tracking-wide text-text-default">{account.clientName}</h2>
            <p className="mt-1 text-xs text-text-muted">{account.licenseUBI}</p>
            <p className="text-xs text-text-muted">{account.address}, {account.city}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge
                variant={account.status === 'active' ? 'success' : account.status === 'recovery' ? 'warning' : 'muted'}
                label={account.status.charAt(0).toUpperCase() + account.status.slice(1)}
              />
            </div>

            {/* Invite button */}
            <button
              onClick={() => setOpenModal('invite')}
              className="mt-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white transition-colors"
              style={{ backgroundColor: '#22C55E' }}
            >
              <Mail className="h-3 w-3" />
              Invite
            </button>

            {/* Rating stars (mock 3.5/5) */}
            <div className="mt-3 flex items-center gap-0.5">
              {[1, 2, 3].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <Star className="h-4 w-4 fill-amber-400/50 text-amber-400" />
              <Star className="h-4 w-4 text-text-muted" />
            </div>

            <p className="mt-2 text-xs text-text-muted">Member since Jan 2012</p>
            <button
              onClick={() => setOpenModal('assign')}
              className="mt-1 flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-default"
            >
              Assigned to: <span className="font-medium text-text-default">{account.assignedSalesRep || 'Unassigned'}</span>
              <UserPlus className="h-3 w-3" style={{ color: ACCENT }} />
            </button>
          </div>

          {/* Start new Cart button */}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-default bg-card py-3 text-sm font-semibold transition-colors hover:bg-elevated"
            style={{ color: ACCENT }}
          >
            <ShoppingCart className="h-4 w-4" />
            Start new Cart
          </button>

          {/* Sales stats */}
          <SalesStatCard icon={DollarSign} label="All Time" value="$0" />
          <SalesStatCard icon={DollarSign} label="YTD" value="$0" />
          <SalesStatCard icon={DollarSign} label="Last Year" value="$0" />
          <SalesStatCard icon={DollarSign} label="Last Month" value="$0" />

          {/* Action buttons */}
          <div className="space-y-2 border-t border-default pt-4">
            <button
              onClick={() => setOpenModal('clientInfo')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
            >
              <Pencil className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Update Client Info
            </button>
            <button
              onClick={() => setOpenModal('contact')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
            >
              <UserPlus className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Add Contact
            </button>
            <button
              onClick={() => setOpenModal('notes')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
            >
              <Pencil className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Update Notes
            </button>
            <button
              onClick={() => setOpenModal('deliveryPrefs')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
            >
              <Truck className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Delivery Preferences
            </button>
            <button
              onClick={() => setOpenModal('inventoryPrefs')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
            >
              <Package className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Inventory Preferences
            </button>
          </div>
        </div>

        {/* Right — tabbed content */}
        <AccountDetailTabs account={account} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Modals */}
      <InviteModal open={openModal === 'invite'} onClose={closeModal} account={account} />
      <AssignSalespersonModal open={openModal === 'assign'} onClose={closeModal} currentRep={account.assignedSalesRep} />
      <AddContactModal open={openModal === 'contact'} onClose={closeModal} />
      <UpdateClientInfoModal open={openModal === 'clientInfo'} onClose={closeModal} account={account} />
      <UpdateNotesModal open={openModal === 'notes'} onClose={closeModal} />
      <UpdateDeliveryPrefsModal open={openModal === 'deliveryPrefs'} onClose={closeModal} account={account} />
      <UpdateInventoryPrefsModal open={openModal === 'inventoryPrefs'} onClose={closeModal} account={account} />
    </div>
  );
}
