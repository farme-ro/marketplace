/**
 * Help & Resources Section Component
 * 
 * Secțiunea cu ajutor și resurse
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { FiHelpCircle, FiBookOpen, FiMail } from 'react-icons/fi'

export function HelpResourcesSection() {
  return (
    <section className="mb-6 lg:mb-8">
      <Card className="border border-border/60 rounded-2xl shadow-sm bg-card">
        <CardContent className="p-5 lg:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
              <FiHelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Ai nevoie de ajutor?
              </h3>
              <p className="text-xs text-foreground-body">
                Ghiduri, recomandări și suport pentru producători.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/cum-functioneaza">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-lg"
              >
                <FiBookOpen className="w-4 h-4 mr-2" />
                Cum funcționează farme.ro pentru producători
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-lg"
              >
                <FiMail className="w-4 h-4 mr-2" />
                Contactează-ne
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

