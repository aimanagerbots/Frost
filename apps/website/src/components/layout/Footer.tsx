import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';
import { FOOTER_LINKS, COMPLIANCE_TEXT } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-7xl px-6" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="relative block h-10 w-[160px]">
              <Image
                src="/FrostLogo_wordmark.png"
                alt="Frost"
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </Link>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-on-dark-muted">
              Products
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-on-dark-muted">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-on-dark-muted">
              Legal
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-12 border-t border-text-on-dark/10 pt-8">
          <p className="text-xs leading-relaxed text-text-on-dark-muted/60">
            {COMPLIANCE_TEXT}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6">
          <p className="text-xs text-text-on-dark-muted/60">
            &copy; {currentYear} Frost Cannabis Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
