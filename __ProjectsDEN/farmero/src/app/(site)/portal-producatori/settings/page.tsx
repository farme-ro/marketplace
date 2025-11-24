/**
 * Producer Settings / Profile Page
 * 
 * Pagină pentru setări și editare profil producător
 * Integrat cu API pentru date reale
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { useAuth } from '@/lib/auth/context'
import { getProducerProfile, updateProducerProfile, uploadProducerLogo, uploadProducerCover, type ProducerProfile } from '@/lib/api/producer/profile'
import { User, MapPin, Phone, Mail, Globe, Facebook, Instagram, Upload, Image as ImageIcon, Save, AlertCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function ProducerSettingsPage() {
  const { producerUser, refreshProfile } = useAuth()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState<ProducerProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storyFull: '',
    location: {
      county: '',
      city: '',
      address: '',
    },
    contact: {
      phone: '',
      email: '',
      website: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      website: '',
    },
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        setError(null)
        
        const profileData = await getProducerProfile()
        if (profileData) {
          setProfile(profileData)
          setFormData({
            name: profileData.name || '',
            description: profileData.description || '',
            storyFull: profileData.storyFull || '',
            location: {
              county: profileData.location?.county || '',
              city: profileData.location?.city || '',
              address: profileData.location?.address || '',
            },
            contact: {
              phone: profileData.contact?.phone || '',
              email: profileData.contact?.email || producerUser?.email || '',
              website: profileData.contact?.website || '',
            },
            socialMedia: {
              facebook: profileData.socialMedia?.facebook || '',
              instagram: profileData.socialMedia?.instagram || '',
              website: profileData.socialMedia?.website || '',
            },
          })
          if (profileData.logoUrl) setLogoPreview(profileData.logoUrl)
          if (profileData.coverImageUrl) setCoverPreview(profileData.coverImageUrl)
        } else {
          // No profile yet - use user data as defaults
          setFormData(prev => ({
            ...prev,
            name: producerUser?.producerName || '',
            contact: {
              ...prev.contact,
              email: producerUser?.email || '',
              phone: producerUser?.phoneNumber || '',
            },
          }))
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading profile:', err)
        }
        setError(err.message || t('producer.settings.errorLoading', 'Eroare la încărcarea profilului'))
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producerUser])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Upload logo if changed
      if (logoFile) {
        try {
          const logoUrl = await uploadProducerLogo(logoFile)
          // Logo URL will be in the profile response
        } catch (err: any) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Settings] Logo upload failed:', err)
          }
          // Continue with profile update even if logo upload fails
        }
      }

      // Upload cover if changed
      if (coverFile) {
        try {
          const coverUrl = await uploadProducerCover(coverFile)
          // Cover URL will be in the profile response
        } catch (err: any) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Settings] Cover upload failed:', err)
          }
          // Continue with profile update even if cover upload fails
        }
      }

      // Update profile
      const updated = await updateProducerProfile({
        name: formData.name.trim() || undefined,
        description: formData.description.trim() || undefined,
        storyFull: formData.storyFull.trim() || undefined,
        location: {
          county: formData.location.county.trim() || undefined,
          city: formData.location.city.trim() || undefined,
          address: formData.location.address.trim() || undefined,
        },
        contact: {
          phone: formData.contact.phone.trim() || undefined,
          email: formData.contact.email.trim() || undefined,
          website: formData.contact.website.trim() || undefined,
        },
        socialMedia: {
          facebook: formData.socialMedia.facebook.trim() || undefined,
          instagram: formData.socialMedia.instagram.trim() || undefined,
          website: formData.socialMedia.website.trim() || undefined,
        },
      })

      setProfile(updated)
      setSuccess(t('producer.settings.successUpdate', 'Profilul a fost actualizat cu succes!'))
      await refreshProfile()
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error saving profile:', err)
      }
      setError(err.message || t('producer.settings.errorSaving', 'Eroare la salvarea profilului'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">{t('producer.settings.loading', 'Se încarcă profilul...')}</p>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            {t('producer.settings.title', 'Setări & Profil')}
          </h1>
          <p className="text-base text-foreground-body">
            {t('producer.settings.description', 'Gestionează informațiile despre fermă și profilul tău public')}
          </p>
        </motion.div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand/Farm Name */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('producer.settings.basicInfo', 'Informații de bază')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.brandName', 'Nume brand / Fermă')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('producer.settings.brandNamePlaceholder', 'Ex: Ferma Popescu')}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.shortDescription', 'Descriere scurtă')}
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder={t('producer.settings.shortDescriptionPlaceholder', 'O scurtă descriere a fermei tale (apare pe pagina publică)')}
                  />
                </div>

                <div>
                  <label htmlFor="storyFull" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.fullStory', 'Povestea completă')}
                  </label>
                  <textarea
                    id="storyFull"
                    value={formData.storyFull}
                    onChange={(e) => setFormData(prev => ({ ...prev, storyFull: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder={t('producer.settings.fullStoryPlaceholder', 'Povestea completă a fermei tale, tradițiile, practicile, etc. (apare pe pagina publică)')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('producer.settings.location', 'Locație')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="county" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.county', 'Județ')}
                  </label>
                  <input
                    id="county"
                    type="text"
                    value={formData.location.county}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, county: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('producer.settings.countyPlaceholder', 'Ex: Cluj')}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.city', 'Localitate')}
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('producer.settings.cityPlaceholder', 'Ex: Cluj-Napoca')}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                  {t('producer.settings.address', 'Adresă completă')}
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('producer.settings.addressPlaceholder', 'Strada, număr, etc.')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {t('producer.settings.contactInfo', 'Date de contact')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.phone', 'Telefon')}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('producer.settings.phonePlaceholder', '07xxxxxxxx')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.email', 'Email (opțional pentru afișare publică)')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('producer.settings.emailPlaceholder', 'contact@ferma.ro')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('producer.settings.emailNote', 'Email-ul tău de cont ({email}) este folosit pentru autentificare și nu poate fi modificat aici.').replace('{email}', producerUser?.email || '')}
                  </p>
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.website', 'Website')}
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={formData.contact.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, website: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('producer.settings.websitePlaceholder', 'https://ferma.ro')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('producer.settings.socialMedia', 'Link-uri social media')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </label>
                  <input
                    id="facebook"
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://facebook.com/ferma"
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://instagram.com/ferma"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo & Cover */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                {t('producer.settings.logoCover', 'Logo & Imagine de copertă')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.logo', 'Logo')}
                  </label>
                  <div className="space-y-3">
                    {logoPreview && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="w-full gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {logoPreview ? t('producer.settings.changeLogo', 'Schimbă logo') : t('producer.settings.uploadLogo', 'Încarcă logo')}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('producer.settings.logoNote', 'TODO: Upload logo funcțional când backend suportă')}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('producer.settings.coverImage', 'Imagine de copertă')}
                  </label>
                  <div className="space-y-3">
                    {coverPreview && (
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                        className="w-full gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {coverPreview ? t('producer.settings.changeCover', 'Schimbă copertă') : t('producer.settings.uploadCover', 'Încarcă copertă')}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('producer.settings.coverNote', 'TODO: Upload cover funcțional când backend suportă')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button 
              type="submit" 
              size="lg" 
              className="flex-1 gap-2"
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
              {isSaving ? t('producer.settings.saving', 'Se salvează...') : t('producer.settings.saveChanges', 'Salvează modificările')}
            </Button>
            {profile?.slug && (
              <Link 
                href={`/producers/${profile.slug}`} 
                target="_blank"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                {t('producer.settings.viewPublicPage', 'Vezi pagina publică')}
              </Link>
            )}
          </div>
        </form>
      </div>
    </ProducerDashboardLayout>
  )
}
