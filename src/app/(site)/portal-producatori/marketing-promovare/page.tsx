/**
 * Producer Marketing & Promotion Page
 * 
 * Pagină pentru gestionarea marketingului și promovării producătorului
 * Include: abonamente de promovare, postări automate pe social media
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import {
  getProducerMarketingSettings,
  updateProducerMarketingSettings,
  getProducerPromotionTiers,
  connectSocialPlatform,
  disconnectSocialPlatform,
} from '@/lib/api/farmero-marketing'
import { getProducerSubscriptionStatus } from '@/lib/api/farmero-subscriptions-producer'
import { getPromotionCampaigns, createPromotionCampaign } from '@/lib/api/promotions'
import type {
  FarmeroMarketingSettings,
  SocialPlatform,
} from '@/lib/types/farmero-marketing'
import type { FarmeroProducerTier } from '@/lib/types/subscriptions'
import type { DomainPromotionCampaign, PromotionChannel } from '@/lib/types/domain'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { useToast } from '@/components/ui/toast'
import { Check, Loader2, Facebook, Instagram, Music, Settings, Share2, Plus, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const PLATFORM_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music,
} as const

// Platform names are now handled via i18n

export default function ProducerMarketingPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const [marketingSettings, setMarketingSettings] = useState<FarmeroMarketingSettings | null>(null)
  const [promotionTiers, setPromotionTiers] = useState<FarmeroProducerTier[]>([])
  const [currentTier, setCurrentTier] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isConnecting, setIsConnecting] = useState<SocialPlatform | null>(null)
  const [showTiers, setShowTiers] = useState(false)
  const [campaigns, setCampaigns] = useState<DomainPromotionCampaign[]>([])
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [settings, tiers, subscriptionStatus, campaignsData] = await Promise.all([
          getProducerMarketingSettings(),
          getProducerPromotionTiers(),
          getProducerSubscriptionStatus().catch(() => null),
          getPromotionCampaigns().catch(() => []),
        ])
        setMarketingSettings(settings)
        setPromotionTiers(tiers)
        setCampaigns(campaignsData)
        if (subscriptionStatus) {
          setCurrentTier(subscriptionStatus.tierId)
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading marketing data:', err)
        }
        // Don't show error, just set defaults
        setMarketingSettings({
          producerId: '',
          autoPostEnabled: false,
          postFrequency: 'weekly',
          platforms: [
            { platform: 'facebook', connected: false },
            { platform: 'instagram', connected: false },
            { platform: 'tiktok', connected: false },
          ],
        })
        setPromotionTiers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleToggleAutoPost = async (enabled: boolean) => {
    if (!marketingSettings) return

    setIsSaving(true)
    try {
      const updated = await updateProducerMarketingSettings({
        autoPostEnabled: enabled,
      })
      setMarketingSettings(updated)
      showToast(
        enabled
          ? t('producer.marketing.autoPostEnabled', 'Postările automate au fost activate')
          : t('producer.marketing.autoPostDisabled', 'Postările automate au fost dezactivate'),
        'success'
      )
    } catch (err: any) {
      showToast(err.message || t('common.error', 'Eroare'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangeFrequency = async (frequency: 'weekly' | 'biweekly' | 'monthly') => {
    if (!marketingSettings) return

    setIsSaving(true)
    try {
      const updated = await updateProducerMarketingSettings({
        postFrequency: frequency,
      })
      setMarketingSettings(updated)
      showToast(
        t('producer.marketing.frequencyUpdated', 'Frecvența postărilor a fost actualizată'),
        'success'
      )
    } catch (err: any) {
      showToast(err.message || t('common.error', 'Eroare'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleConnectPlatform = async (platform: SocialPlatform) => {
    setIsConnecting(platform)
    try {
      const response = await connectSocialPlatform(platform)
      if (response.authUrl) {
        // Redirect to OAuth flow
        window.location.href = response.authUrl
      } else {
        // Already connected or other status
        showToast(
          t(
            'producer.marketing.socialComingSoon',
            'Integrările cu social media vor fi disponibile în curând.'
          ),
          'info'
        )
        // Reload settings
        const settings = await getProducerMarketingSettings()
        setMarketingSettings(settings)
      }
    } catch (err: any) {
      showToast(
        err.message ||
          t(
            'producer.marketing.socialComingSoon',
            'Integrările cu social media vor fi disponibile în curând.'
          ),
        'error'
      )
    } finally {
      setIsConnecting(null)
    }
  }

  const handleDisconnectPlatform = async (platform: SocialPlatform) => {
    if (
      !confirm(
        t(
          'producer.marketing.confirmDisconnect',
          'Ești sigur că vrei să deconectezi această platformă?'
        )
      )
    )
      return

    setIsConnecting(platform)
    try {
      const updated = await disconnectSocialPlatform(platform)
      setMarketingSettings(updated)
      showToast(
        t('producer.marketing.platformDisconnected', 'Platforma a fost deconectată'),
        'success'
      )
    } catch (err: any) {
      showToast(err.message || t('common.error', 'Eroare'), 'error')
    } finally {
      setIsConnecting(null)
    }
  }

  const getFrequencyLabel = (frequency: 'weekly' | 'biweekly' | 'monthly') => {
    switch (frequency) {
      case 'weekly':
        return t('producer.marketing.frequencyWeekly', 'Săptămânal')
      case 'biweekly':
        return t('producer.marketing.frequencyBiweekly', 'Bilunar')
      case 'monthly':
        return t('producer.marketing.frequencyMonthly', 'Lunar')
    }
  }

  return (
    <ProducerDashboardLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {t('producer.marketing.title', 'Marketing & Promovare')}
        </h1>
        <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
          {t(
            'producer.marketing.subtitle',
            'Gestionează-ți vizibilitatea și promovarea pe platformă și pe rețelele sociale.'
          )}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-6">
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <Skeleton variant="rectangular" height="200px" className="rounded-xl" />
            </CardContent>
          </Card>
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <Skeleton variant="rectangular" height="300px" className="rounded-xl" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card 1: Promotion Subscription */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('producer.marketing.promotionSubscription', 'Abonament de promovare')}
                </h2>
              </div>

              {currentTier ? (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t('producer.marketing.currentPlan', 'Plan curent')}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {promotionTiers.find((t) => t.id === currentTier)?.name ||
                          t('producer.marketing.planBasic', 'Basic')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTiers(!showTiers)}
                    >
                      {showTiers
                        ? t('producer.marketing.hidePlans', 'Ascunde pachetele')
                        : t('producer.marketing.viewPlans', 'Vezi pachetele de promovare')}
                    </Button>
                  </div>

                  {showTiers && promotionTiers.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
                      <h3 className="font-semibold text-foreground mb-3">
                        {t('producer.marketing.availablePlans', 'Pachete disponibile')}
                      </h3>
                      <div className="space-y-3">
                        {promotionTiers.map((tier) => (
                          <div
                            key={tier.id}
                            className={cn(
                              'p-3 rounded-lg border',
                              tier.id === currentTier
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-card'
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                                  {tier.id === currentTier && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                      {t('producer.marketing.current', 'Curent')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {formatCurrency(tier.monthlyPrice, locale, tier.currency)} /{' '}
                                  {t('producer.marketing.perMonth', 'lună')}
                                </p>
                                {tier.description && (
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {tier.description}
                                  </p>
                                )}
                                <ul className="space-y-1">
                                  {tier.features.slice(0, 3).map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
                                      <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t(
                      'producer.marketing.noSubscription',
                      'Nu ai un abonament de promovare activ. Alege un plan pentru mai multă vizibilitate.'
                    )}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Navigate to subscriptions page
                      window.location.href = '/portal-producatori/abonamente'
                    }}
                  >
                    {t('producer.marketing.viewPlans', 'Vezi pachetele de promovare')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Social Media Auto-Posting */}
          {marketingSettings && (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('producer.marketing.socialAutoPosting', 'Postări automate pe social media')}
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Toggle Auto-Post */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {t('producer.marketing.enableAutoPost', 'Activează postările automate')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          'producer.marketing.enableAutoPostDescription',
                          'Produsele tale vor fi postate automat pe platformele conectate.'
                        )}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingSettings.autoPostEnabled}
                        onChange={(e) => handleToggleAutoPost(e.target.checked)}
                        disabled={isSaving}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Post Frequency */}
                  {marketingSettings.autoPostEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('producer.marketing.postFrequency', 'Frecvența postărilor')}
                      </label>
                      <select
                        value={marketingSettings.postFrequency}
                        onChange={(e) =>
                          handleChangeFrequency(
                            e.target.value as 'weekly' | 'biweekly' | 'monthly'
                          )
                        }
                        disabled={isSaving}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="weekly">
                          {t('producer.marketing.frequencyWeekly', 'Săptămânal')}
                        </option>
                        <option value="biweekly">
                          {t('producer.marketing.frequencyBiweekly', 'Bilunar')}
                        </option>
                        <option value="monthly">
                          {t('producer.marketing.frequencyMonthly', 'Lunar')}
                        </option>
                      </select>
                    </div>
                  )}

                  {/* Social Platforms */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      {t('producer.marketing.socialPlatforms', 'Platforme sociale')}
                    </h3>
                    <div className="space-y-3">
                      {marketingSettings.platforms.map((platformAccount) => {
                        const Icon = PLATFORM_ICONS[platformAccount.platform]
                        const platformName = t(`producer.marketing.platform.${platformAccount.platform}`, platformAccount.platform === 'facebook' ? 'Facebook' : platformAccount.platform === 'instagram' ? 'Instagram' : 'TikTok')
                        const isConnectingThis = isConnecting === platformAccount.platform

                        return (
                          <div
                            key={platformAccount.platform}
                            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <Icon className="w-5 h-5 text-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{platformName}</p>
                                {platformAccount.connected ? (
                                  <p className="text-xs text-muted-foreground">
                                    {platformAccount.connectedAt
                                      ? t('producer.marketing.connectedSince', 'Conectat din') +
                                        ' ' +
                                        formatDate(platformAccount.connectedAt, locale, {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                        })
                                      : t('producer.marketing.connected', 'Conectat')}
                                    {platformAccount.accountName && ` (${platformAccount.accountName})`}
                                  </p>
                                ) : (
                                  <p className="text-xs text-muted-foreground">
                                    {t('producer.marketing.notConnected', 'Neconectat')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              {platformAccount.connected ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDisconnectPlatform(platformAccount.platform)}
                                  disabled={isConnectingThis}
                                >
                                  {isConnectingThis ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      {t('common.loading', 'Se încarcă...')}
                                    </>
                                  ) : (
                                    t('producer.marketing.disconnect', 'Deconectează')
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleConnectPlatform(platformAccount.platform)}
                                  disabled={isConnectingThis}
                                >
                                  {isConnectingThis ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      {t('common.loading', 'Se încarcă...')}
                                    </>
                                  ) : (
                                    t('producer.marketing.connect', 'Conectează')
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card 3: Promotion Campaigns */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('producer.marketing.campaigns', 'Campanii de promovare')}
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    showToast(
                      t(
                        'producer.marketing.campaignComingSoonDescription',
                        'Funcționalitatea de creare campanii va fi disponibilă în curând.'
                      ),
                      'info'
                    )
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('producer.marketing.createCampaign', 'Creează campanie')}
                </Button>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {t('producer.marketing.noCampaigns', 'Nu ai campanii încă')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'producer.marketing.campaignsDescription',
                      'Creează campanii de promovare pentru produsele tale pe marketplace, newsletter sau social media.'
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-foreground">
                              {t(`producer.marketing.channel.${campaign.channel}`, {
                                marketplace: 'Marketplace',
                                newsletter: 'Newsletter',
                                social_media: 'Social Media',
                              }[campaign.channel] || campaign.channel)}
                            </span>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                campaign.status === 'active'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : campaign.status === 'paused'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                              )}
                            >
                              {t(`producer.marketing.campaignStatus.${campaign.status}`, campaign.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {t('producer.marketing.startDate', 'Început')}:{' '}
                              {formatDate(campaign.startDate, locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {campaign.endDate && (
                              <span>
                                {t('producer.marketing.endDate', 'Sfârșit')}:{' '}
                                {formatDate(campaign.endDate, locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                            {campaign.budget && (
                              <span>
                                {t('producer.marketing.budget', 'Buget')}: {formatCurrency(campaign.budget, locale, 'RON')}
                              </span>
                            )}
                          </div>
                          {campaign.metrics && (
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              {campaign.metrics.impressions && (
                                <span>
                                  {t('producer.marketing.impressions', 'Impresii')}: {campaign.metrics.impressions}
                                </span>
                              )}
                              {campaign.metrics.clicks && (
                                <span>
                                  {t('producer.marketing.clicks', 'Click-uri')}: {campaign.metrics.clicks}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </ProducerDashboardLayout>
  )
}

