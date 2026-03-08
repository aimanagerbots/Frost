"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components";
import { CheckCircle } from "lucide-react";

interface WholesaleForm {
  name: string;
  storeName: string;
  email: string;
  message: string;
}

export default function WholesaleFormClient() {
  const [form, setForm] = useState<WholesaleForm>({
    name: "",
    storeName: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#5BB8E6]/50 transition-colors";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="section-pad max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <div className="rounded-xl border border-border-default bg-card p-12 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-[#00E5A0] mx-auto" />
            <h3 className="font-display text-2xl text-text-default">
              Inquiry Received
            </h3>
            <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
              Thank you for your inquiry! Our wholesale team will be in touch
              within 1-2 business days.
            </p>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="section-pad max-w-3xl mx-auto px-6">
      <ScrollReveal>
        <h2 className="font-display text-3xl text-text-default text-center mb-12">
          Get in Touch
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text-muted mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                placeholder="Your dispensary name"
                required
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@dispensary.com"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us about your store and what products you're interested in..."
              required
              className={inputClassName}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200 bg-accent-primary text-text-on-dark hover:bg-accent-primary-hover"
            >
              Send Inquiry
            </button>
          </div>
        </form>
      </ScrollReveal>
    </div>
  );
}
