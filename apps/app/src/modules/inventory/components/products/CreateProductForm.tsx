'use client';

import { useState } from 'react';
import { X, Save, Copy, Trash2, XCircle } from 'lucide-react';
import { INVENTORY_TYPE_LABELS } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const PACKAGE_SIZES = ['1g', '2g', '3.5g', '7g', '14g', '28g', '0.5g', '0.75g', '2-pack 0.75g', '10-pack 10mg', '30ml'];
const LABEL_TEMPLATES = ['Standard Flower', 'Preroll', 'Preroll Multi', 'Concentrate', 'Cartridge', 'Edible Standard', 'Tincture'];
const CATEGORIES = ['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'];

interface CreateProductFormProps {
  open: boolean;
  onClose: () => void;
  mode?: 'cannabis' | 'non-cannabis';
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-text-muted">
        {label}{required && <span style={{ color: ACCENT }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';
const selectCls = 'h-9 w-full appearance-none rounded-lg border border-default bg-elevated px-3 text-xs text-text-default focus:border-[#8B5CF6] focus:outline-none';

export function CreateProductForm({ open, onClose, mode = 'cannabis' }: CreateProductFormProps) {
  const [form, setForm] = useState({
    name: '', labelName: '', sku: '', inventoryType: '' as string,
    productLine: '', subProductLine: '', packageSize: '', labelTemplate: '',
    strain: '', unitPrice: '', conversionSource: '', maxRetailerUnits: '',
    catalogGroup: '', catalogName: '', billOfMaterials: '', expiryMonths: '12',
    category: '', subCategory: '', minOrderLimit: '', marketIncrement: '',
    showAsDOH: false, description: '', disclaimer: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-xl flex-col border-l border-default bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <h3 className="text-sm font-semibold text-text-default">
            {mode === 'non-cannabis' ? 'New Non-Cannabis Product' : 'New Product'}
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-default">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Row 1: Name + Label Name */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Name" required>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name…" className={inputCls} />
              </FormField>
              <FormField label="Label Name">
                <input value={form.labelName} onChange={e => set('labelName', e.target.value)} placeholder="Label display name…" className={inputCls} />
              </FormField>
            </div>

            {/* SKU */}
            <FormField label="SKU">
              <input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="FL-XX-3.5G" className={inputCls} />
            </FormField>

            {/* Inventory Type */}
            <FormField label="Inventory Type" required>
              <select value={form.inventoryType} onChange={e => set('inventoryType', e.target.value)} className={selectCls}>
                <option value="">Select type…</option>
                {(Object.entries(INVENTORY_TYPE_LABELS) as [string, string][]).map(([code, label]) => (
                  <option key={code} value={code}>{code} — {label}</option>
                ))}
              </select>
            </FormField>

            {/* Product Line + Sub-Product Line */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Product Line" required>
                <select value={form.productLine} onChange={e => set('productLine', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  <option value="Premium Flower">Premium Flower</option>
                  <option value="RTP | Budlets">RTP | Budlets</option>
                  <option value="RTM | Preroll Material">RTM | Preroll Material</option>
                  <option value="RTM | Extraction Material">RTM | Extraction Material</option>
                  <option value="RTM | Vaporizer Material">RTM | Vaporizer Material</option>
                  <option value="Wellness Line">Wellness Line</option>
                  <option value="Edible Line">Edible Line</option>
                </select>
              </FormField>
              <FormField label="Sub-Product Line" required>
                <select value={form.subProductLine} onChange={e => set('subProductLine', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  <option value="Sativa">Sativa</option>
                  <option value="Indica">Indica</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Live Resin">Live Resin</option>
                  <option value="Badder">Badder</option>
                  <option value="Rosin">Rosin</option>
                  <option value="510 Cartridge">510 Cartridge</option>
                  <option value="Gummies">Gummies</option>
                  <option value="Tinctures">Tinctures</option>
                </select>
              </FormField>
            </div>

            {/* Package Size + Label Template */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Package Size" required>
                <select value={form.packageSize} onChange={e => set('packageSize', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  {PACKAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Label Template" required>
                <select value={form.labelTemplate} onChange={e => set('labelTemplate', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  {LABEL_TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
            </div>

            {/* Strain */}
            <FormField label="Strain" required>
              <select value={form.strain} onChange={e => set('strain', e.target.value)} className={selectCls}>
                <option value="">Select strain…</option>
                <option value="Platinum Pineapple">Platinum Pineapple</option>
                <option value="Green Crack">Green Crack</option>
                <option value="Moonbow">Moonbow</option>
                <option value="Orange Crush">Orange Crush</option>
                <option value="Skatalite">Skatalite</option>
                <option value="White Fire OG">White Fire OG</option>
                <option value="Wedding Cake">Wedding Cake</option>
                <option value="Blue Dream">Blue Dream</option>
                <option value="N/A">N/A</option>
                <option value="Blend">Blend</option>
              </select>
            </FormField>

            {/* Unit Price + Conversion Source */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Unit Price">
                <input type="number" value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)} placeholder="0.00" className={inputCls} />
              </FormField>
              <FormField label="Conversion Source Product">
                <input value={form.conversionSource} onChange={e => set('conversionSource', e.target.value)} placeholder="Source product…" className={inputCls} />
              </FormField>
            </div>

            {/* Max Retailer Visible Units + Catalog Group */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Max. Retailer Visible Units">
                <input type="number" value={form.maxRetailerUnits} onChange={e => set('maxRetailerUnits', e.target.value)} placeholder="999" className={inputCls} />
              </FormField>
              <FormField label="Catalog Group">
                <select value={form.catalogGroup} onChange={e => set('catalogGroup', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  <option value="Retail">Retail</option>
                  <option value="Value">Value</option>
                  <option value="Premium">Premium</option>
                </select>
              </FormField>
            </div>

            {/* Catalog Name + Bill of Materials */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Catalog Name">
                <input value={form.catalogName} onChange={e => set('catalogName', e.target.value)} placeholder="Collection name…" className={inputCls} />
              </FormField>
              <FormField label="Bill of Materials">
                <select value={form.billOfMaterials} onChange={e => set('billOfMaterials', e.target.value)} className={selectCls}>
                  <option value="">None</option>
                  <option value="flower-3.5g">Flower 3.5g BOM</option>
                  <option value="preroll-1g">Preroll 1g BOM</option>
                  <option value="cart-1g">Cartridge 1g BOM</option>
                </select>
              </FormField>
            </div>

            {/* Expiry + Category */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Expiry (Months)">
                <input type="number" value={form.expiryMonths} onChange={e => set('expiryMonths', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="Category">
                <select value={form.category} onChange={e => set('category', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </FormField>
            </div>

            {/* Sub Category + Min Order Limit */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Sub Category">
                <select value={form.subCategory} onChange={e => set('subCategory', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Greenhouse">Greenhouse</option>
                  <option value="Budlets">Budlets</option>
                  <option value="Singles">Singles</option>
                  <option value="Multi-Pack">Multi-Pack</option>
                </select>
              </FormField>
              <FormField label="Min. Order Limit">
                <input type="number" value={form.minOrderLimit} onChange={e => set('minOrderLimit', e.target.value)} placeholder="1" className={inputCls} />
              </FormField>
            </div>

            {/* Market Increment Quantity */}
            <FormField label="Market Increment Quantity">
              <input type="number" value={form.marketIncrement} onChange={e => set('marketIncrement', e.target.value)} placeholder="1" className={inputCls} />
            </FormField>

            {/* Show as DOH Compliant checkbox */}
            <label className="flex cursor-pointer items-center gap-2">
              <div
                onClick={() => set('showAsDOH', !form.showAsDOH)}
                className="flex h-4 w-4 items-center justify-center rounded border-2 transition-colors"
                style={{
                  borderColor: form.showAsDOH ? ACCENT : 'var(--color-border-default)',
                  backgroundColor: form.showAsDOH ? ACCENT : 'transparent',
                }}
              >
                {form.showAsDOH && <span className="text-[10px] text-white">✓</span>}
              </div>
              <span className="text-xs text-text-default">Show as DOH-Compliant</span>
            </label>

            {/* Description */}
            <FormField label="Product Description">
              <textarea
                value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="Describe the product…"
                className="w-full resize-none rounded-lg border border-default bg-elevated px-3 py-2 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
              />
            </FormField>

            {/* Disclaimer */}
            <FormField label="Product Disclaimer">
              <textarea
                value={form.disclaimer} onChange={e => set('disclaimer', e.target.value)}
                rows={2} placeholder="Legal disclaimer text…"
                className="w-full resize-none rounded-lg border border-default bg-elevated px-3 py-2 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
              />
            </FormField>

            {/* Product Images placeholder */}
            <FormField label="Product Images">
              <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-default text-xs text-text-muted">
                Drop images here or click to upload
              </div>
            </FormField>
          </div>
        </div>

        {/* Footer action buttons */}
        <div className="flex items-center gap-2 border-t border-default px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Save size={14} />
            Save Product
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-default px-4 text-xs text-text-muted hover:text-text-default">
            <Copy size={14} />
            Clone Product
          </button>
          <div className="flex-1" />
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-red-500/30 px-4 text-xs text-red-400 hover:bg-red-500/10">
            <Trash2 size={14} />
            Delete
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-amber-500/30 px-4 text-xs text-amber-400 hover:bg-amber-500/10">
            <XCircle size={14} />
            Discontinue
          </button>
        </div>
      </div>
    </div>
  );
}
