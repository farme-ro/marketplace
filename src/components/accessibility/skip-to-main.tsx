/**
 * Skip to Main Content Link
 * 
 * Accessibility feature: allows keyboard users to skip navigation
 */

'use client';

import { handleSkipToMain } from '@/lib/accessibility';

export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      onKeyDown={handleSkipToMain}
    >
      Sări la conținutul principal
    </a>
  );
}

