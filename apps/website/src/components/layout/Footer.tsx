import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';
import { FOOTER_LINKS, COMPLIANCE_TEXT } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-dark">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="font-display text-2xl tracking-wide text-text-default">
              Frost
            </Link>
            <p className="text-sm leading-relaxed text-text-muted">
              Craft cannabis cultivated with intention. Small-batch, sustainably grown, lab-tested.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-text-default"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-text-default"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Products
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text-default"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text-default"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Legal
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text-default"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance text */}
        <div className="mt-12 border-t border-border-default pt-8">
          <p className="text-xs leading-relaxed text-text-muted">{COMPLIANCE_TEXT}</p>
        </div>

        {/* Copyright */}
        <div className="mt-6">
          <p className="text-xs text-text-muted">
            &copy; {currentYear} Frost Cannabis Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
