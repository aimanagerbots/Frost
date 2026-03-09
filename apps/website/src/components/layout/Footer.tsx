import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { FOOTER_LINKS, COMPLIANCE_TEXT } from '@/lib/constants';

/* ── Custom SVG icons (not in lucide) ── */

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.16 8.16 0 0 0 4.77 1.53V6.81a4.85 4.85 0 0 1-1.01-.12z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function LeaflyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z" />
    </svg>
  );
}

function WeedmapsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.781 3.632 2.695 6.54 2.717 2.227-.017 4.074-.59 5.49-1.701 1.506-1.18 2.29-2.858 2.33-4.986-.037-1.545-.476-2.766-1.303-3.629-.758-.79-1.762-1.246-2.983-1.358.07.48.107.97.107 1.465 0 .257-.01.513-.028.766a4.94 4.94 0 0 1 1.463.846c.518.54.82 1.335.844 2.357-.028 1.477-.568 2.593-1.604 3.316-.987.69-2.326 1.056-3.974 1.086h-.086c-1.77 0-3.262-.453-4.31-1.312-1.124-.92-1.72-2.266-1.77-4.001l2.015-.063c.064 2.273 1.28 3.381 3.716 3.386h.075c1.152-.021 2.074-.249 2.738-.676.607-.39.903-.92.914-1.633-.008-.564-.17-.987-.495-1.293-.371-.348-.96-.586-1.747-.71a12.44 12.44 0 0 1-1.39-.262c-2.073-.504-3.545-1.392-4.379-2.64-.748-1.12-1.05-2.54-1.05-4.21 0-1.975.583-3.59 1.687-4.67C9.416 3.59 10.785 3.02 12.38 3h.12c1.64.024 2.97.62 3.957 1.774.9 1.053 1.395 2.502 1.473 4.303l-2.014.091c-.056-1.3-.39-2.318-1-3.03-.655-.768-1.556-1.163-2.676-1.176h-.074c-1.09.015-1.97.403-2.611 1.157-.675.795-1.018 1.928-1.018 3.37 0 1.285.218 2.306.667 3.034.505.82 1.506 1.417 2.975 1.776.37.09.793.167 1.264.23z" />
    </svg>
  );
}

/* ── Social link config ── */

const iconClass = 'h-5 w-5';
const linkClass = 'text-text-on-dark-muted transition-colors hover:text-text-on-dark';

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram', icon: <Instagram className={iconClass} /> },
  { href: 'https://x.com', label: 'X', icon: <XIcon className={iconClass} /> },
  { href: 'https://youtube.com', label: 'YouTube', icon: <Youtube className={iconClass} /> },
  { href: 'https://discord.gg', label: 'Discord', icon: <DiscordIcon className={iconClass} /> },
  { href: 'https://leafly.com', label: 'Leafly', icon: <LeaflyIcon className={iconClass} /> },
  { href: 'https://facebook.com', label: 'Facebook', icon: <Facebook className={iconClass} /> },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: <Linkedin className={iconClass} /> },
  { href: 'https://threads.net', label: 'Threads', icon: <ThreadsIcon className={iconClass} /> },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-7xl px-6" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col justify-between">
            <Link href="/" className="block">
              <Image
                src="/FrostLogo_wordmark.png"
                alt="Frost"
                width={197}
                height={44}
                className="brightness-0 invert"
              />
            </Link>
            <div className="flex flex-wrap gap-3 mt-8">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
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
