"use client";

import { useState, useMemo } from "react";
import { SearchInput, AccordionItem } from "@/components";

const FAQ_DATA = [
  {
    section: "About Our Products",
    items: [
      { question: "What product categories does Frost offer?", answer: "Frost offers six product categories: premium craft flower, pre-rolls, vaporizer cartridges and disposables, concentrates (live resin, rosin, shatter, and wax), edibles (gummies, chocolates, and baked goods), and cannabis-infused beverages. Each category is produced by one of our specialized brands \u2014 Frost Farms for flower and pre-rolls, Glacier Extracts for vaporizers and concentrates, and Northern Lights Co. for edibles and beverages." },
      { question: "How do I read THC and CBD percentages?", answer: "THC and CBD percentages indicate the concentration of each cannabinoid by weight. For flower, a 25% THC means 250mg of THC per gram. For edibles and beverages, dosage is listed in milligrams (mg) per serving and per package. Washington State requires all products to be tested and labeled with accurate cannabinoid content. Effects vary by individual \u2014 we recommend starting with a low dose and waiting at least 2 hours before consuming more." },
      { question: "What are terpenes and why do they matter?", answer: "Terpenes are aromatic compounds found naturally in cannabis that contribute to each strain's unique flavor, aroma, and effects. Common terpenes include myrcene (earthy, relaxing), limonene (citrus, uplifting), caryophyllene (spicy, anti-inflammatory), and pinene (pine, focus). At Frost, we preserve terpene profiles through careful cultivation and extraction processes. You can view detailed terpene profiles on each product and strain page." },
      { question: "Are all Frost products lab tested?", answer: "Yes. Every Frost product is tested by independent, Washington State-licensed laboratories before it reaches dispensary shelves. Testing covers potency (THC, CBD, and other cannabinoids), terpene profiles, and safety screenings for pesticides, heavy metals, microbials, and residual solvents. Certificates of Analysis (COA) are available for all products." },
      { question: "What makes Frost different from other cannabis brands?", answer: "Frost is built on three principles: craft quality, full-spectrum experiences, and transparency. We cultivate small-batch genetics in controlled indoor environments across Washington State, preserve natural terpene profiles through gentle extraction methods, and provide complete lab testing data on every product. Our three specialized brands \u2014 Frost Farms, Glacier Extracts, and Northern Lights Co. \u2014 each focus on what they do best." },
    ],
  },
  {
    section: "Where to Buy",
    items: [
      { question: "Where can I find Frost products?", answer: "Frost products are available at licensed dispensaries across Washington State. Use our Store Locator to find dispensaries near you that carry Frost products, or use our Product Finder to check which stores carry a specific product." },
      { question: "Do you sell products online?", answer: "No. Under Washington State law, cannabis products can only be purchased in person at licensed retail dispensaries. Our website is informational only \u2014 we do not process any cannabis sales or transactions online." },
      { question: "Can I order Frost products for delivery?", answer: "Delivery availability depends on your local dispensary. Some of our retail partners offer delivery services through their own platforms. Check with your preferred dispensary for their delivery options and service areas." },
      { question: "How do I check if a product is in stock?", answer: "Use our Product Finder tool to see which dispensaries near you currently carry a specific Frost product. Inventory data is updated regularly through our retail partners, though availability may change. We recommend calling ahead to confirm stock before visiting." },
    ],
  },
  {
    section: "For Dispensaries",
    items: [
      { question: "How do I become a Frost retail partner?", answer: "Visit our Dispensary Registration page to apply. You will need your WSLCB license number, business information, and primary contact details. Our team reviews applications within 2 business days and will reach out to schedule an introductory call." },
      { question: "What are your minimum order requirements?", answer: "Minimum order requirements vary by product category and are discussed during the onboarding process. We work with dispensaries of all sizes and offer flexible ordering to help you stock the right mix of Frost products for your customers." },
      { question: "What is your VMI program?", answer: "Our Vendor Managed Inventory (VMI) program takes the guesswork out of restocking. Our sales team monitors your sell-through data, recommends optimal inventory levels, and coordinates replenishment on your delivery schedule. This helps prevent stockouts while minimizing overstock, so your shelf space is always working for you." },
      { question: "Do you offer vendor days or in-store events?", answer: "Yes. Our brand ambassador team conducts regular vendor day visits at partner dispensaries. These events include product education for budtenders, customer sampling sessions (where permitted), and promotional support. Contact your Frost account manager to schedule a vendor day at your store." },
    ],
  },
  {
    section: "Compliance & Safety",
    items: [
      { question: "What is the age requirement to purchase cannabis?", answer: "You must be 21 years of age or older with a valid government-issued ID to purchase cannabis products in Washington State. This applies to all Frost products at all retail locations. No exceptions." },
      { question: "How are Frost products tested for safety?", answer: "All Frost products undergo rigorous testing at independent, WSLCB-licensed laboratories. Tests screen for potency, terpenes, pesticides, heavy metals, microbial contaminants, and residual solvents. Products that do not meet Washington State safety standards are not released for sale." },
      { question: "Where can I find regulatory information?", answer: "Visit our Compliance page for detailed regulatory information, or contact the Washington State Liquor and Cannabis Board (WSLCB) directly at lcb.wa.gov for state cannabis regulations, licensing information, and consumer resources." },
    ],
  },
];

export default function FaqPageClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return FAQ_DATA;

    return FAQ_DATA.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      ),
    })).filter((section) => section.items.length > 0);
  }, [searchQuery]);

  const totalResults = filteredSections.reduce(
    (sum, section) => sum + section.items.length,
    0
  );

  return (
    <div className="section-pad max-w-4xl mx-auto px-6">
      <div className="mb-8">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search questions..."
        />
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-text-muted font-sans">
            No matching questions found
          </p>
          <p className="text-sm text-text-muted/60 font-sans mt-2">
            Try a different search term
          </p>
        </div>
      ) : (
        filteredSections.map((section) => (
          <div key={section.section}>
            <h2 className="font-display text-2xl text-text-default mb-6 mt-12">
              {section.section}
            </h2>
            <div>
              {section.items.map((item) => (
                <AccordionItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
