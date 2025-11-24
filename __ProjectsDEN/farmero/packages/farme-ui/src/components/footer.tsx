'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '../utils/cn'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface SocialLink {
  name: string
  href: string
  icon: React.ReactNode
}

export interface FooterProps {
  logo?: React.ReactNode
  columns?: FooterColumn[]
  socialLinks?: SocialLink[]
  copyright?: string
  className?: string
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ logo, columns, socialLinks, copyright, className }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn('border-t bg-background', className)}
      >
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Grid - 4 Columns */}
          <div className="py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Mission */}
            {logo && (
              <div className="space-y-4">
                {logo}
                <p className="text-xs text-muted-foreground">
                  Marketplace pentru produse agricole locale și tradiționale.
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                  Din România 🇷🇴
                </span>
              </div>
            )}

            {/* Column 2: Pentru clienți */}
            {columns && columns[0] && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {columns[0].title || 'Pentru clienți'}
                </h4>
                <ul className="space-y-2">
                  {columns[0].links && columns[0].links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 3: Pentru producători */}
            {columns && columns[1] && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {columns[1].title || 'Pentru producători'}
                </h4>
                <ul className="space-y-2">
                  {columns[1].links && columns[1].links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 4: Contact & Social */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Contact
              </h4>
              <div className="space-y-2">
                <a
                  href="mailto:contact@farme.ro"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  contact@farme.ro
                </a>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  Pagină contact
                </Link>
              </div>
              
              {/* Social Icons */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t mt-8 pt-4 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            {/* Left: Copyright */}
            <div>
              {copyright || `© ${new Date().getFullYear()} farme.ro. Toate drepturile rezervate.`}
            </div>

            {/* Center: Made in Romania */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1">
                Fabricat în România 🇷🇴
              </span>
            </div>

            {/* Right: Legal Links */}
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Termeni și condiții
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Politica de confidențialitate
              </Link>
              <Link
                href="/cookies"
                className="hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }
)
Footer.displayName = 'Footer'

export { Footer }
