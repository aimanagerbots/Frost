"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroSection, ScrollReveal, CTAButton } from "@/components";
import { Mail, Phone, MapPin, Instagram, Twitter } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#5BB8E6]/50 transition-colors";

  return (
    <main>
      <HeroSection
        height="half"
        title="Get In Touch"
        subtitle="We'd love to hear from you"
      />

      <div className="section-pad max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Form */}
          <ScrollReveal>
            {submitted ? (
              <div className="rounded-xl border border-border-default bg-card p-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10">
                  <Mail className="h-8 w-8 text-accent-primary" />
                </div>
                <h2 className="font-display text-2xl text-text-default mb-3">
                  Thank you for reaching out!
                </h2>
                <p className="text-text-muted font-sans leading-relaxed">
                  We&apos;ll get back to you within 1-2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-sans text-text-muted mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-sans text-text-muted mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-sans text-text-muted mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Wholesale Partnership">
                      Wholesale Partnership
                    </option>
                    <option value="Media / Press">Media / Press</option>
                    <option value="Careers">Careers</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-sans text-text-muted mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200 bg-accent-primary text-text-on-dark hover:bg-accent-primary-hover"
                >
                  Send Message
                </button>
              </form>
            )}
          </ScrollReveal>

          {/* Right column - Contact info */}
          <ScrollReveal staggerDelay={100}>
            <div className="rounded-xl border border-border-default bg-card p-8 space-y-6">
              <h2 className="font-display text-xl text-text-default">
                Contact Information
              </h2>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent-primary shrink-0" />
                  <span className="text-text-muted font-sans text-sm">
                    hello@frostcannabis.com
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent-primary shrink-0" />
                  <span className="text-text-muted font-sans text-sm">
                    (206) 555-0100
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent-primary shrink-0" />
                  <span className="text-text-muted font-sans text-sm">
                    Seattle, WA
                  </span>
                </div>
              </div>

              <div className="border-t border-border-default pt-6">
                <h3 className="font-sans text-sm text-text-muted mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/frostcannabis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="text-sm font-sans">Instagram</span>
                  </a>
                  <a
                    href="https://x.com/frostcannabis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="text-sm font-sans">X</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border-default bg-card p-6 text-center">
              <p className="text-text-muted font-sans text-sm mb-3">
                Have a question? Check our FAQ
              </p>
              <CTAButton variant="outline" href="/faq">
                View FAQ
              </CTAButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
