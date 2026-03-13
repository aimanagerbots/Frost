'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { categories } from './nav-data';

function resolveBreadcrumb(pathname: string): { category: string | null; page: string } {
  for (const cat of categories) {
    for (const item of cat.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return { category: cat.label, page: item.label };
      }
    }
    if (cat.tabRoute && (pathname === cat.tabRoute || pathname.startsWith(cat.tabRoute + '/'))) {
      return { category: null, page: cat.label };
    }
  }
  return { category: null, page: 'Dashboard' };
}

export function Breadcrumb() {
  const pathname = usePathname();
  const { category, page } = resolveBreadcrumb(pathname);

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 px-0 py-2 mb-5 border-b border-white/[0.05] bg-base/90 backdrop-blur-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-xs text-text-muted hover:text-text-default transition-colors"
      >
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>

      {category && (
        <>
          <ChevronRight className="h-3 w-3 text-text-muted/40 shrink-0" />
          <span className="text-xs text-text-muted">{category}</span>
        </>
      )}

      <ChevronRight className="h-3 w-3 text-text-muted/40 shrink-0" />
      <span className="text-xs text-text-default font-medium">{page}</span>
    </div>
  );
}
