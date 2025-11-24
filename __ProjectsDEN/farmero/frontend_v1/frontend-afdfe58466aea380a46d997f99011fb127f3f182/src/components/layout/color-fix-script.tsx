/**
 * Color Fix Script
 * 
 * Script care șterge culorile hardcodate setate de extensii sau alte surse
 * Nu setează culori noi, doar curăță stilurile inline problematice
 */

'use client'

import { useEffect } from 'react'

export function ColorFixScript() {
  useEffect(() => {
    // Funcție pentru a curăța culorile hardcodate
    const cleanHardcodedColors = () => {
      try {
        // Șterge stiluri inline problematice de pe body
        const body = document.body
        if (body) {
          // Verifică dacă există stiluri inline cu culori problematice
          const bodyStyle = body.getAttribute('style')
          if (bodyStyle) {
            // Șterge doar background-color și color dacă sunt setate inline
            // (nu le ștergem pe toate, doar dacă sunt problematice)
            const hasProblematicColors = 
              bodyStyle.includes('rgb(255, 255, 0)') ||
              bodyStyle.includes('rgb(255,255,0)') ||
              bodyStyle.includes('#ffff00') ||
              bodyStyle.includes('#FFFF00') ||
              bodyStyle.includes('rgb(61, 52, 52)') ||
              bodyStyle.includes('rgb(61,52,52)') ||
              bodyStyle.includes('#3d3434')
            
            if (hasProblematicColors) {
              // Șterge doar background-color și color, păstrează restul
              body.style.removeProperty('background-color')
              body.style.removeProperty('color')
            }
          }
        }

        // Șterge stiluri inline problematice de pe html
        const html = document.documentElement
        if (html) {
          const htmlStyle = html.getAttribute('style')
          if (htmlStyle) {
            const hasProblematicColors = 
              htmlStyle.includes('rgb(255, 255, 0)') ||
              htmlStyle.includes('rgb(255,255,0)') ||
              htmlStyle.includes('#ffff00') ||
              htmlStyle.includes('#FFFF00') ||
              htmlStyle.includes('rgb(61, 52, 52)') ||
              htmlStyle.includes('rgb(61,52,52)') ||
              htmlStyle.includes('#3d3434')
            
            if (hasProblematicColors) {
              html.style.removeProperty('background-color')
              html.style.removeProperty('color')
            }
          }
        }

        // Șterge stiluri inline problematice de pe main
        const main = document.querySelector('main')
        if (main) {
          const mainStyle = main.getAttribute('style')
          if (mainStyle) {
            const hasProblematicColors = 
              mainStyle.includes('rgb(255, 255, 0)') ||
              mainStyle.includes('rgb(255,255,0)') ||
              mainStyle.includes('#ffff00') ||
              mainStyle.includes('#FFFF00') ||
              mainStyle.includes('rgb(61, 52, 52)') ||
              mainStyle.includes('rgb(61,52,52)') ||
              mainStyle.includes('#3d3434')
            
            if (hasProblematicColors) {
              main.style.removeProperty('background-color')
              main.style.removeProperty('color')
            }
          }
        }
      } catch (error) {
        // Silently fail - this is a cleanup script, shouldn't break the app
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug('ColorFixScript: Error cleaning colors', error)
        }
      }
    }

    // Rulează imediat
    cleanHardcodedColors()

    // Rulează după un mic delay pentru a prinde stilurile setate de extensii
    const timeout = setTimeout(cleanHardcodedColors, 100)

    // Observă schimbările în DOM pentru a curăța stilurile noi adăugate
    const observer = new MutationObserver((mutations) => {
      // Verifică dacă s-au adăugat stiluri inline
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement
          if (target && (target === document.body || target === document.documentElement || target.tagName === 'MAIN')) {
            cleanHardcodedColors()
            break
          }
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'], // Doar stiluri inline
      childList: false,
      subtree: false, // Doar elementul root, nu subtree
    })

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  return null
}
