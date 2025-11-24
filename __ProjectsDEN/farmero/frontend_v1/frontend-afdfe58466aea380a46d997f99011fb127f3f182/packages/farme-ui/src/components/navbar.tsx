'use client'

import * as React from 'react'
import { cn } from '../utils/cn'

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean
  logo?: React.ReactNode
  leftItems?: React.ReactNode
  rightItems?: React.ReactNode
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, sticky = false, logo, leftItems, rightItems, style, ...props }, ref) => {
    const navRef = React.useRef<HTMLElement>(null)
    const spacerRef = React.useRef<HTMLDivElement>(null)
    const [navHeight, setNavHeight] = React.useState(64) // Default 64px (h-16)
    
    // Combine refs
    React.useImperativeHandle(ref, () => navRef.current as HTMLElement)
    
    // Measure nav height and update spacer
    React.useEffect(() => {
      if (!sticky || !navRef.current) return
      
      const updateHeight = () => {
        if (navRef.current) {
          const height = navRef.current.offsetHeight || 64 // Fallback to 64px (h-16)
          setNavHeight(height)
          if (spacerRef.current) {
            spacerRef.current.style.height = `${height}px`
            spacerRef.current.style.display = 'block'
          }
        }
      }
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        updateHeight()
        // Also update after a short delay to catch any dynamic changes
        setTimeout(updateHeight, 100)
      })
      
      window.addEventListener('resize', updateHeight, { passive: true })
      
      return () => {
        window.removeEventListener('resize', updateHeight)
      }
    }, [sticky])
    
    // Use fixed positioning for sticky - more reliable across browsers
    // Merge with any passed styles, but ensure our sticky styles take precedence
    const stickyStyles = sticky ? {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      width: '100%',
      ...style, // Allow style prop to override, but our values come first
    } : style

    return (
      <>
        {/* Spacer to prevent layout shift when using fixed positioning */}
        {sticky && (
          <div 
            ref={spacerRef} 
            aria-hidden="true" 
            style={{ 
              height: `${navHeight}px`, 
              display: 'block',
              width: '100%'
            }} 
          />
        )}
        <nav
          ref={navRef}
          className={cn(
            'w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
            // Fixed positioning for sticky - more reliable than sticky
            sticky && [
              'fixed',
              'top-0',
              'left-0',
              'right-0',
              'z-[100]', // Higher z-index to ensure it stays on top of all content
            ],
            className
          )}
          style={stickyStyles}
          {...props}
        >
        <div className={cn(
          "w-full max-w-8xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 transition-all duration-300 ease-in-out",
          "h-16"
        )}>
          {logo && (
            <div className="flex items-center flex-shrink-0" suppressHydrationWarning>
              {logo}
            </div>
          )}
          {leftItems && (
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 flex-1 justify-center mx-2 md:mx-4 lg:mx-6">
              {leftItems}
            </div>
          )}
          {rightItems && (
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
              {rightItems}
            </div>
          )}
        </div>
      </nav>
      </>
    )
  }
)
Navbar.displayName = 'Navbar'

export { Navbar }

