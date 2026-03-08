"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroSection, ScrollReveal } from "@/components";
import { UserCheck, Package, Megaphone, Star, CheckCircle } from "lucide-react";

interface FormData {
  licenseNumber: string;
  legalName: string;
  dba: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  email: string;
  phone: string;
  deliveryWindow: string;
  hearAbout: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  licenseNumber: "",
  legalName: "",
  dba: "",
  street: "",
  city: "",
  state: "WA",
  zip: "",
  contactName: "",
  email: "",
  phone: "",
  deliveryWindow: "",
  hearAbout: "",
  notes: "",
};

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "licenseNumber",
  "legalName",
  "street",
  "city",
  "zip",
  "contactName",
  "email",
  "phone",
];

const benefits = [
  {
    icon: UserCheck,
    title: "Dedicated Account Manager",
    description:
      "Your own Frost rep for ordering, merchandising, and support",
  },
  {
    icon: Package,
    title: "VMI Integration",
    description:
      "Automated inventory monitoring and replenishment recommendations",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    description:
      "POS materials, vendor days, and co-marketing opportunities",
  },
  {
    icon: Star,
    title: "Priority Allocation",
    description:
      "First access to limited releases and seasonal products",
  },
];

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#5BB8E6]/50 transition-colors";

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormData];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!form[field].trim()) {
        newErrors[field] = "This field is required";
      }
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
  }

  return (
    <main>
      <HeroSection
        height="half"
        title="Become a Frost Partner"
        subtitle="Join our network of premium cannabis retailers across Washington State"
      />

      {/* Benefits */}
      <div className="section-pad max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-text-default text-center mb-12">
            Why Partner With Frost?
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} staggerDelay={i * 100}>
              <div className="rounded-xl border border-border-default bg-card p-8">
                <b.icon className="w-10 h-10 text-accent-primary mb-4" />
                <h3 className="font-display text-xl text-text-default mb-2">
                  {b.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {b.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Registration Form */}
      <div className="section-pad max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-text-default text-center mb-12">
            Register Your Dispensary
          </h2>
        </ScrollReveal>

        {submitted ? (
          <ScrollReveal>
            <div className="rounded-xl border border-border-default bg-card p-12 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-[#00E5A0] mx-auto" />
              <h3 className="font-display text-2xl text-text-default">
                Application Submitted!
              </h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
                Thank you for your interest in becoming a Frost retail partner.
                Our team will review your application and contact you within 2
                business days.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WSLCB License Number — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-muted mb-2">
                    WSLCB License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. 412345"
                    className={inputClassName}
                  />
                  {errors.licenseNumber && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                {/* Business Legal Name */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    Business Legal Name *
                  </label>
                  <input
                    type="text"
                    name="legalName"
                    value={form.legalName}
                    onChange={handleChange}
                    placeholder="Legal entity name"
                    className={inputClassName}
                  />
                  {errors.legalName && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.legalName}
                    </p>
                  )}
                </div>

                {/* DBA */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    DBA / Trade Name
                  </label>
                  <input
                    type="text"
                    name="dba"
                    value={form.dba}
                    onChange={handleChange}
                    placeholder="Doing business as"
                    className={inputClassName}
                  />
                </div>

                {/* Street Address — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-muted mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="1234 Main St"
                    className={inputClassName}
                  />
                  {errors.street && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.street}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Seattle"
                    className={inputClassName}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-400 mt-1">{errors.city}</p>
                  )}
                </div>

                {/* State (disabled) */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value="WA"
                    disabled
                    className={`${inputClassName} opacity-50 cursor-not-allowed`}
                  />
                </div>

                {/* ZIP */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="98101"
                    className={inputClassName}
                  />
                  {errors.zip && (
                    <p className="text-xs text-red-400 mt-1">{errors.zip}</p>
                  )}
                </div>

                {/* Primary Contact Name */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    Primary Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={inputClassName}
                  />
                  {errors.contactName && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@dispensary.com"
                    className={inputClassName}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(206) 555-0100"
                    className={inputClassName}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Preferred Delivery Window */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    Preferred Delivery Window
                  </label>
                  <select
                    name="deliveryWindow"
                    value={form.deliveryWindow}
                    onChange={handleChange}
                    className={inputClassName}
                  >
                    <option value="">Select...</option>
                    <option value="morning">Morning 8am-12pm</option>
                    <option value="afternoon">Afternoon 12pm-5pm</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* How did you hear about us? */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAbout"
                    value={form.hearAbout}
                    onChange={handleChange}
                    className={inputClassName}
                  >
                    <option value="">Select...</option>
                    <option value="sales-rep">Sales Representative</option>
                    <option value="trade-show">Trade Show</option>
                    <option value="referral">Referral</option>
                    <option value="online">Online Search</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Notes — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-muted mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Anything else you'd like us to know..."
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mt-10">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200 bg-accent-primary text-text-on-dark hover:bg-accent-primary-hover"
                >
                  Submit Application
                </button>

                <p className="text-sm text-text-muted">
                  Already a partner?{" "}
                  <Link
                    href="/login"
                    className="text-accent-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
