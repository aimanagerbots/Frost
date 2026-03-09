'use client';

import { useState } from 'react';
import {
  Flower2,
  FlaskConical,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportResourcesProps {
  className?: string;
}

interface ResourceCard {
  id: string;
  title: string;
  icon: LucideIcon;
  shortDescription: string;
  expandedContent: string;
}

const RESOURCES: ResourceCard[] = [
  {
    id: 'res-1',
    title: 'Flower Guide',
    icon: Flower2,
    shortDescription:
      'Understanding cannabis flower grades, terpene profiles, and proper storage...',
    expandedContent:
      'Cannabis flower is graded by visual appeal, trichome density, moisture content, and terpene profile. Top-shelf flower features dense, well-trimmed buds with visible trichomes and a strong, distinct aroma. Mid-grade flower is structurally sound but may have less trichome coverage or a milder scent profile.\n\nTerpene profiles are the primary driver of consumer preference. Myrcene-dominant strains tend toward sedative effects and earthy flavors, while limonene-forward varieties deliver energetic, citrus-forward experiences. Understanding your local customer preferences — whether they skew toward relaxation or uplift — helps you stock the right mix.\n\nProper storage is critical for maintaining potency and shelf appeal. Keep flower in a cool, dark environment between 60-70°F with relative humidity around 58-62%. Exposure to light, heat, or excess moisture degrades THC into CBN and encourages mold growth. Rotate stock on a first-in, first-out basis and aim to sell through inventory within 60 days of harvest for peak freshness.',
  },
  {
    id: 'res-2',
    title: 'Concentrates 101',
    icon: FlaskConical,
    shortDescription:
      'Live resin, shatter, wax — processing methods and potency expectations...',
    expandedContent:
      'Concentrates are extracted cannabis products with significantly higher cannabinoid concentrations than flower, typically ranging from 60-90% THC. The extraction method determines the final texture, flavor, and terpene retention, which directly impacts retail price and consumer appeal.\n\nLive resin is made from flash-frozen cannabis that was never dried or cured, preserving the full terpene profile. This results in a wet, saucy consistency with exceptional flavor — it commands the highest price point. Shatter is a glass-like concentrate made through BHO (butane hash oil) extraction with a purging process that removes residual solvents. Wax and budder use similar extraction but are whipped during purging, creating a softer, more opaque texture that is easier for consumers to handle.\n\nWhen merchandising concentrates, educate your budtenders on the differences between hydrocarbon extracts (BHO, PHO), solventless products (rosin, bubble hash), and CO2 oils. Solventless products appeal to health-conscious consumers willing to pay a premium, while BHO concentrates offer the best margin at accessible price points. Always verify that COA results show non-detectable residual solvent levels before putting product on the shelf.',
  },
  {
    id: 'res-3',
    title: 'Reading a COA',
    icon: FileCheck,
    shortDescription:
      'How to interpret Certificate of Analysis reports, testing metrics...',
    expandedContent:
      'A Certificate of Analysis (COA) is issued by a licensed third-party laboratory and confirms the safety and potency of a cannabis product. Every COA should include the lab name, license number, date of analysis, sample ID, and batch number. If any of these are missing, the COA should be considered incomplete.\n\nThe potency section reports cannabinoid concentrations — primarily THC and CBD — as a percentage of weight. Total THC includes both THCA (the raw acid form) and delta-9 THC, calculated as: Total THC = (THCA x 0.877) + delta-9 THC. This formula accounts for the mass lost when THCA is decarboxylated (heated) into its active form. Terpene testing, while not always mandatory, adds value by helping budtenders make strain-specific recommendations.\n\nThe safety panel is the most critical section. It tests for microbial contaminants (E. coli, Salmonella, Aspergillus), heavy metals (lead, arsenic, cadmium, mercury), residual solvents, and pesticides. A "pass" on all categories is required before product can be sold. If any category shows a "fail," the entire batch is non-compliant and must be remediated or destroyed. Train your team to verify pass status on every incoming shipment — this protects your license and your customers.',
  },
  {
    id: 'res-4',
    title: 'Compliance Reminders',
    icon: ShieldCheck,
    shortDescription:
      '5-day payment window, manifest requirements, delivery acceptance...',
    expandedContent:
      'Wholesale cannabis transactions are governed by state regulations that require strict documentation and timeline compliance. All deliveries must be accompanied by a transport manifest that includes the originating and destination license numbers, driver identification, vehicle information, product descriptions with batch numbers, and quantities. Verify every manifest against the physical shipment before signing — discrepancies must be reported immediately.\n\nPayment timelines vary by state but the industry standard is net-14 terms. Frost invoices are due within 14 days of delivery. Accounts that consistently pay within 5 days are flagged as "thriving" in the health score system and may receive priority allocation on limited-release products. Overdue payments trigger automatic escalation notifications and may result in order holds until the balance is resolved.\n\nDelivery acceptance is a compliance checkpoint. The receiving party must verify product counts, check package integrity, confirm COA documentation is included, and sign the manifest. Any damaged or missing items should be noted on the manifest at the time of delivery — claims submitted after signing are significantly harder to process. Keep a copy of every signed manifest on file for at least three years as required by most state cannabis regulatory agencies.',
  },
];

export function SupportResources({ className }: SupportResourcesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Resources &amp; Guides
      </h2>

      <div className="space-y-2">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon;
          const isExpanded = expandedId === resource.id;

          return (
            <div
              key={resource.id}
              className="overflow-hidden rounded-xl border border-border-default bg-card"
            >
              <button
                type="button"
                onClick={() => handleToggle(resource.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-elevated/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                  <Icon className="h-4 w-4 text-accent-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-default">
                    {resource.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                    {resource.shortDescription}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-text-muted" />
                ) : (
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-text-muted" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border-default px-4 py-4">
                  {resource.expandedContent.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className={cn(
                        'text-sm leading-relaxed text-text-muted',
                        i > 0 && 'mt-3'
                      )}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
