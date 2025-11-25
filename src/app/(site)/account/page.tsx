/**
 * Client Account Page
 * 
 * Pagină pentru gestionarea contului clientului
 * Include: date personale și adrese de livrare
 */

'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/lib/auth/context'
import { getClientProfile } from '@/lib/api/auth'
import { 
  updateClientProfile, 
  getClientAddresses, 
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  setDefaultShippingAddress,
  type ShippingAddress as ShippingAddressType
} from '@/lib/api/client-profile'
import { User, MapPin, Plus, Edit, Trash2, Star, Mail, Phone, Heart, Package, Bell, Pause, Play, X, Award, Shield, FileText } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import {
  getClientSubscriptions,
  pauseClientSubscription,
  resumeClientSubscription,
  cancelClientSubscription,
} from '@/lib/api/farmero-subscriptions-client'
import { getFarmeroPoints } from '@/lib/api/farmero-points'
import type { FarmeroClientSubscription } from '@/lib/types/subscriptions'
import type { FarmeroPoints } from '@/lib/types/farmero-points'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { useToast } from '@/components/ui/toast'

export default function AccountPage() {
  const router = useRouter()
  const { clientUser, refreshProfile } = useAuth()
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Profile state
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false)
  
  // Addresses state
  const [addresses, setAddresses] = useState<ShippingAddressType[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [showAddAddress, setShowAddAddress] = useState(false)
  
  // New/Edit address form state
  const [addressForm, setAddressForm] = useState<Partial<ShippingAddressType>>({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    postalCode: '',
    notes: '',
  })

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<FarmeroClientSubscription[]>([])
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true)
  const [processingSubscriptionId, setProcessingSubscriptionId] = useState<string | null>(null)

  // Farmero Points state
  const [farmeroPoints, setFarmeroPoints] = useState<FarmeroPoints | null>(null)
  const [isLoadingPoints, setIsLoadingPoints] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load profile
        const profile = await getClientProfile()
        if (profile) {
          setFullName(profile.fullName || '')
          setPhoneNumber(profile.phoneNumber || '')
        }
        
        // Load addresses
        setIsLoadingAddresses(true)
        const addressesData = await getClientAddresses()
        setAddresses(addressesData)

        // Load subscriptions
        setIsLoadingSubscriptions(true)
        try {
          const subscriptionsData = await getClientSubscriptions()
          setSubscriptions(subscriptionsData)
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error loading subscriptions:', err)
          }
          // Don't show error, just set empty array
          setSubscriptions([])
        } finally {
          setIsLoadingSubscriptions(false)
        }

        // Load Farmero Points
        setIsLoadingPoints(true)
        try {
          const pointsData = await getFarmeroPoints()
          setFarmeroPoints(pointsData)
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Error loading Farmero Points:', err)
          }
          // Don't show error, just set default
          setFarmeroPoints({
            clientId: '',
            points: 0,
            level: 'bronze',
            lastUpdated: new Date().toISOString(),
            nextLevelPoints: 200,
            levelProgress: 0,
          })
        } finally {
          setIsLoadingPoints(false)
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading account data:', err)
        }
        setError(err.message || 'Eroare la încărcarea datelor contului')
      } finally {
        setIsLoading(false)
        setIsLoadingAddresses(false)
      }
    }

    loadData()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setProfileSaveSuccess(false)
    setError(null)

    try {
      await updateClientProfile({
        fullName: fullName.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      })
      
      setProfileSaveSuccess(true)
      await refreshProfile()
      setTimeout(() => setProfileSaveSuccess(false), 3000)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error saving profile:', err)
      }
      setError(err.message || 'Eroare la salvarea profilului')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.city || !addressForm.address) {
      setError(t('forms.allFieldsRequired', 'Completează toate câmpurile obligatorii.'))
      return
    }

    try {
      if (editingAddressId) {
        // Update existing address
        const updated = await updateShippingAddress(editingAddressId, addressForm as any)
        setAddresses(prev => prev.map(a => a.id === editingAddressId ? updated : a))
        setEditingAddressId(null)
      } else {
        // Create new address
        const newAddress = await createShippingAddress(addressForm as any)
        setAddresses(prev => [...prev, newAddress])
        setShowAddAddress(false)
      }
      
      // Reset form
      setAddressForm({
        name: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        postalCode: '',
        notes: '',
      })
      setError(null)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error saving address:', err)
      }
      setError(err.message || 'Eroare la salvarea adresei')
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi această adresă?')) {
      return
    }

    try {
      await deleteShippingAddress(addressId)
      setAddresses(prev => prev.filter(a => a.id !== addressId))
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error deleting address:', err)
      }
      setError(err.message || 'Eroare la ștergerea adresei')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultShippingAddress(addressId)
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === addressId,
      })))
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error setting default address:', err)
      }
      setError(err.message || 'Eroare la setarea adresei principale')
    }
  }

  const startEditAddress = (address: ShippingAddressType) => {
    setEditingAddressId(address.id || null)
    setAddressForm({
      name: address.name,
      phone: address.phone,
      email: address.email,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
      notes: address.notes,
    })
    setShowAddAddress(true)
  }

  return (
    <RequireAuth role="client" fallbackRedirect="/login-client?redirect=/account">
      {isLoading ? (
          <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-sm text-muted-foreground">{t('account.loading', 'Se încarcă datele contului...')}</p>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                  {t('account.title', 'Contul meu')}
                </h1>
                <p className="text-base text-foreground-body">
                  {t('account.description', 'Gestionează datele personale și adresele de livrare')}
                </p>
              </motion.div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {profileSaveSuccess && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400">{t('producer.settings.profileUpdated', 'Profilul a fost actualizat cu succes!')}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Personal Data */}
                <div>
                  <Card className="border border-border rounded-2xl shadow-sm bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">{t('account.personalInfo.title', 'Date personale')}</h2>
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                            {t('account.personalInfo.fullName', 'Nume complet')}
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder={t('account.personalInfo.fullNamePlaceholder', 'Nume complet')}
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            {t('account.personalInfo.email', 'Email')}
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={clientUser?.email || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground mt-1">{t('account.personalInfo.emailCannotBeChanged', 'Email-ul nu poate fi modificat')}</p>
                        </div>

                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
                            {t('account.personalInfo.phone', 'Telefon')}
                          </label>
                          <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder={t('account.personalInfo.phonePlaceholder', '07xxxxxxxx')}
                          />
                        </div>

                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full"
                          disabled={isSavingProfile}
                        >
                          {isSavingProfile ? t('producer.settings.saving', 'Se salvează...') : t('producer.settings.saveChanges', 'Salvează modificările')}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Delivery Addresses */}
                <div>
                  <Card className="border border-border rounded-2xl shadow-sm bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">{t('account.addresses.title', 'Adrese de livrare')}</h2>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddAddress(true)
                            setEditingAddressId(null)
                            setAddressForm({
                              name: '',
                              phone: '',
                              email: '',
                              city: '',
                              address: '',
                              postalCode: '',
                              notes: '',
                            })
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('account.addresses.addButton', 'Adaugă')}
                        </Button>
                      </div>

                      {isLoadingAddresses ? (
                        <div className="text-center py-8">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-primary border-r-transparent mb-2"></div>
                          <p className="text-sm text-muted-foreground">{t('account.addresses.loading', 'Se încarcă adresele...')}</p>
                        </div>
                      ) : showAddAddress || editingAddressId ? (
                        <div className="space-y-4 mb-4 p-4 rounded-lg border border-border bg-muted/30">
                          <h3 className="font-medium text-foreground">
                            {editingAddressId ? t('account.addresses.editTitle', 'Editează adresa') : t('account.addresses.addTitle', 'Adaugă adresă nouă')}
                          </h3>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder={t('account.addresses.namePlaceholder', 'Nume complet')}
                              value={addressForm.name || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                            />
                            <input
                              type="tel"
                              placeholder={t('account.addresses.phonePlaceholder', 'Telefon')}
                              value={addressForm.phone || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                            />
                            <input
                              type="email"
                              placeholder={t('account.addresses.emailPlaceholder', 'Email (opțional)')}
                              value={addressForm.email || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                            />
                            <input
                              type="text"
                              placeholder={t('account.addresses.cityPlaceholder', 'Oraș')}
                              value={addressForm.city || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                            />
                            <textarea
                              placeholder={t('account.addresses.addressPlaceholder', 'Adresă completă')}
                              value={addressForm.address || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[80px]"
                            />
                            <input
                              type="text"
                              placeholder={t('account.addresses.postalCodePlaceholder', 'Cod poștal (opțional)')}
                              value={addressForm.postalCode || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                            />
                            <textarea
                              placeholder={t('account.addresses.notesPlaceholder', 'Notițe (opțional)')}
                              value={addressForm.notes || ''}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, notes: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[60px]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveAddress} className="flex-1">
                              {t('actions.save', 'Salvează')}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setShowAddAddress(false)
                                setEditingAddressId(null)
                                setAddressForm({
                                  name: '',
                                  phone: '',
                                  email: '',
                                  city: '',
                                  address: '',
                                  postalCode: '',
                                  notes: '',
                                })
                              }}
                            >
                              {t('common.cancel', 'Anulează')}
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        {addresses.length === 0 && !isLoadingAddresses && !showAddAddress ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">{t('account.addresses.empty', 'Nu ai adrese de livrare salvate')}</p>
                            <p className="text-xs mt-1">{t('account.addresses.emptyDescription', 'Adaugă o adresă pentru a accelera procesul de comandă')}</p>
                          </div>
                        ) : (
                          addresses.map((address) => (
                            <div
                              key={address.id || Math.random()}
                              className="p-4 rounded-lg border border-border bg-card"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  {address.isDefault && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-1">
                                      <Star className="w-3 h-3 fill-current" />
                                      {t('account.addresses.default', 'Adresă principală')}
                                    </span>
                                  )}
                                  <p className="font-medium text-foreground">{address.name}</p>
                                  <p className="text-sm text-foreground-body mt-1">
                                    {address.address}
                                    {address.postalCode && `, ${address.postalCode}`}
                                    {`, ${address.city}`}
                                  </p>
                                  {address.phone && (
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {address.phone}
                                    </p>
                                  )}
                                  {address.email && (
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {address.email}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  {!address.isDefault && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => address.id && handleSetDefault(address.id)}
                                      title="Setează ca principală"
                                    >
                                      <Star className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => startEditAddress(address)}
                                    title="Editează"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => address.id && handleDeleteAddress(address.id)}
                                    title="Șterge"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Additional Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Anchor for payment-methods */}
                <div id="payment-methods" className="scroll-mt-20" />
                {/* Anchor for settings */}
                <div id="settings" className="scroll-mt-20" />
                {/* Favorites Section */}
                <Card id="favorites" className="border border-border rounded-2xl shadow-sm bg-card scroll-mt-20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">
                          {t('favorites.title', 'Favorite')}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('favorites.title', 'Vezi produsele și producătorii pe care îi preferi')}
                    </p>
                    <Link href="/account/favorites">
                      <Button variant="outline" className="w-full">
                        <Heart className="w-4 h-4 mr-2" />
                        {t('favorites.myFavorites', 'Favoritele mele')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Subscriptions Section */}
                <Card className="border border-border rounded-2xl shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {t('account.subscriptions.title', 'Abonamentele mele')}
                      </h2>
                    </div>

                    {isLoadingSubscriptions ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          {t('common.loading', 'Se încarcă...')}
                        </p>
                      </div>
                    ) : subscriptions.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-sm text-muted-foreground mb-2">
                          {t(
                            'account.subscriptions.empty',
                            'Nu ai încă abonamente active. În curând vei putea primi coșuri recurente direct de la producătorii tăi preferați.'
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {subscriptions.map((subscription) => {
                          const getFrequencyLabel = () => {
                            switch (subscription.frequency) {
                              case 'weekly':
                                return t('subscriptions.frequency.weekly', 'Săptămânal')
                              case 'biweekly':
                                return t('subscriptions.frequency.biweekly', 'La 2 săptămâni')
                              case 'monthly':
                                return t('subscriptions.frequency.monthly', 'Lunar')
                              default:
                                return subscription.frequency
                            }
                          }

                          return (
                            <div
                              key={subscription.id}
                              className="border border-border rounded-xl p-4 bg-muted/30"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-foreground mb-1">
                                    {subscription.planName || t('account.subscriptions.plan', 'Plan abonament')}
                                  </h3>
                                  {subscription.producerName && (
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {t('account.subscriptions.fromProducer', 'De la')} {subscription.producerName}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    {t('account.subscriptions.frequency', 'Frecvență')}: {getFrequencyLabel()}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {t('account.subscriptions.nextDelivery', 'Următoarea livrare')}:{' '}
                                    {formatDate(subscription.nextDeliveryDate, locale, {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {subscription.isActive ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                          if (
                                            !confirm(
                                              t(
                                                'account.subscriptions.confirmPause',
                                                'Ești sigur că vrei să pui abonamentul în pauză?'
                                              )
                                            )
                                          )
                                            return
                                          setProcessingSubscriptionId(subscription.id)
                                          try {
                                            await pauseClientSubscription(subscription.id)
                                            const updated = await getClientSubscriptions()
                                            setSubscriptions(updated)
                                            showToast(
                                              t('account.subscriptions.paused', 'Abonamentul a fost pus în pauză'),
                                              'success'
                                            )
                                          } catch (err: any) {
                                            showToast(
                                              err.message || t('common.error', 'Eroare'),
                                              'error'
                                            )
                                          } finally {
                                            setProcessingSubscriptionId(null)
                                          }
                                        }}
                                        disabled={processingSubscriptionId === subscription.id}
                                      >
                                        <Pause className="w-4 h-4 mr-1" />
                                        {t('account.subscriptions.pause', 'Pauză')}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                          if (
                                            !confirm(
                                              t(
                                                'account.subscriptions.confirmCancel',
                                                'Ești sigur că vrei să anulezi abonamentul? Această acțiune nu poate fi anulată.'
                                              )
                                            )
                                          )
                                            return
                                          setProcessingSubscriptionId(subscription.id)
                                          try {
                                            await cancelClientSubscription(subscription.id)
                                            const updated = await getClientSubscriptions()
                                            setSubscriptions(updated)
                                            showToast(
                                              t('account.subscriptions.canceled', 'Abonamentul a fost anulat'),
                                              'success'
                                            )
                                          } catch (err: any) {
                                            showToast(
                                              err.message || t('common.error', 'Eroare'),
                                              'error'
                                            )
                                          } finally {
                                            setProcessingSubscriptionId(null)
                                          }
                                        }}
                                        disabled={processingSubscriptionId === subscription.id}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        {t('account.subscriptions.cancel', 'Anulează')}
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={async () => {
                                        setProcessingSubscriptionId(subscription.id)
                                        try {
                                          await resumeClientSubscription(subscription.id)
                                          const updated = await getClientSubscriptions()
                                          setSubscriptions(updated)
                                          showToast(
                                            t('account.subscriptions.resumed', 'Abonamentul a fost reluat'),
                                            'success'
                                          )
                                        } catch (err: any) {
                                          showToast(err.message || t('common.error', 'Eroare'), 'error')
                                        } finally {
                                          setProcessingSubscriptionId(null)
                                        }
                                      }}
                                      disabled={processingSubscriptionId === subscription.id}
                                    >
                                      <Play className="w-4 h-4 mr-1" />
                                      {t('account.subscriptions.resume', 'Reluare')}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Farmero Points Section */}
                <Card className="border border-border rounded-2xl shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-secondary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {t('account.points.title', 'Farmero Points & Farm Rewards')}
                      </h2>
                    </div>

                    {isLoadingPoints ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          {t('common.loading', 'Se încarcă...')}
                        </p>
                      </div>
                    ) : farmeroPoints ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {t('account.points.yourPoints', 'Punctele tale')}
                            </p>
                            <p className="text-3xl font-bold text-foreground">
                              {farmeroPoints.points}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground mb-1">
                              {t('account.points.level', 'Nivel')}
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 text-secondary font-medium text-sm">
                              {farmeroPoints.level === 'bronze'
                                ? t('account.points.levelBronze', 'Bronze')
                                : farmeroPoints.level === 'silver'
                                ? t('account.points.levelSilver', 'Silver')
                                : t('account.points.levelGold', 'Gold')}
                            </div>
                          </div>
                        </div>

                        {farmeroPoints.levelProgress !== undefined && farmeroPoints.levelProgress < 100 && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span>
                                {t('account.points.progressToNext', 'Progres către următorul nivel')}
                              </span>
                              <span>{Math.round(farmeroPoints.levelProgress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                                style={{ width: `${farmeroPoints.levelProgress}%` }}
                              />
                            </div>
                            {farmeroPoints.nextLevelPoints !== undefined && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {farmeroPoints.nextLevelPoints - farmeroPoints.points}{' '}
                                {t('account.points.pointsNeeded', 'puncte până la următorul nivel')}
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t(
                            'account.points.description',
                            'Primești Farmero Points când comanzi constant și ridici comenzile la timp. Un scor bun îți poate aduce mai multe beneficii în viitor.'
                          )}
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                {/* Privacy & GDPR Section */}
                <Card className="border border-border rounded-2xl shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {t('account.privacy.title', 'Date & confidențialitate')}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(
                          'account.privacy.description',
                          'Poți afla cum îți folosim datele în Politica de confidențialitate și în pagina dedicată protecției datelor.'
                        )}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/privacy"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          {t('account.privacy.privacyLink', 'Politica de confidențialitate')}
                        </Link>
                        <Link
                          href="/gdpr"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          {t('account.privacy.gdprLink', 'Drepturile tale (GDPR)')}
                        </Link>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Account deletion will be available directly from the account in the future
                            // For now, users need to contact Farmero team to request account deletion
                            alert(
                              t(
                                'account.privacy.closeAccountDialog.content',
                                'Închiderea contului și ștergerea datelor se va face în baza unei cereri către echipa Farmero. Această funcționalitate va fi disponibilă direct din contul tău în curând.'
                              )
                            )
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4 mr-2" />
                          {t('account.privacy.closeAccount', 'Închide contul')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
    </RequireAuth>
  )
}

