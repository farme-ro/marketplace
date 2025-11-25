/**
 * Product Form Component
 * 
 * Formular reutilizabil pentru creare și editare produs
 */

'use client'

import { useState, useEffect } from 'react'
import { Input } from 'farme-ui'
import { Select } from 'farme-ui'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface Product {
  id?: string
  name?: string
  description?: string
  price?: number
  unit?: string
  stock?: number
  isActive?: boolean
  isBio?: boolean
  isTraditional?: boolean
  categoryId?: string
  regionId?: string
}

interface ProductFormProps {
  product?: Product | null
  onSubmit: (data: any) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    unit: product?.unit || 'kg',
    stock: product?.stock?.toString() || '0',
    isActive: product?.isActive ?? true,
    isBio: product?.isBio ?? false,
    isTraditional: product?.isTraditional ?? false,
    categoryId: product?.categoryId || '',
    regionId: product?.regionId || '',
  })

  // Update form data when product changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        unit: product.unit || 'kg',
        stock: product.stock?.toString() || '0',
        isActive: product.isActive ?? true,
        isBio: product.isBio ?? false,
        isTraditional: product.isTraditional ?? false,
        categoryId: product.categoryId || '',
        regionId: product.regionId || '',
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validare basic
    if (!formData.name || formData.name.trim().length === 0) {
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      return
    }

    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Detalii produs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Detalii produs
        </h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Nume produs *
          </label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ex: Miere de salcâm"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            {t('producer.products.description', 'Descriere')}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descriere detaliată a produsului..."
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-2xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">
              {t('producer.products.category', 'Categorie')}
            </label>
            <Select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full"
            >
              <option value="">{t('producer.products.selectCategory', 'Selectează categoria')}</option>
              <option value="fruits">Fructe</option>
              <option value="vegetables">Legume</option>
              <option value="dairy">Lactate</option>
              <option value="meat">Carne</option>
              <option value="honey">Miere</option>
            </Select>
          </div>

          <div>
            <label htmlFor="regionId" className="block text-sm font-medium text-foreground mb-2">
              {t('producer.products.region', 'Regiune')}
            </label>
            <Select
              id="regionId"
              value={formData.regionId}
              onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
              className="w-full"
            >
              <option value="">{t('producer.products.selectRegion', 'Selectează regiunea')}</option>
              <option value="1">Sibiu</option>
              <option value="2">Cluj</option>
              <option value="3">București</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Preț & unitate */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          {t('producer.products.priceAndUnit', 'Preț & unitate')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
              {t('producer.products.price', 'Preț (RON)')} *
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="45.00"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-foreground mb-2">
              Unitate *
            </label>
            <Select
              id="unit"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full"
            >
              <option value="kg">kg</option>
              <option value="buc">buc</option>
              <option value="litru">litru</option>
              <option value="500g">500g</option>
              <option value="1L">1L</option>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Prețul afișat către client este considerat preț de producător.
        </p>
      </div>

      {/* Disponibilitate */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Disponibilitate
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              Produs activ (vizibil în marketplace)
            </span>
          </label>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">
              Stoc (bucăți)
            </label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="10"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Etichete / tag-uri */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Etichete / tag-uri
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBio}
              onChange={(e) => setFormData({ ...formData, isBio: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Bio</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isTraditional}
              onChange={(e) => setFormData({ ...formData, isTraditional: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Tradițional</span>
          </label>
        </div>
      </div>

      {/* Imagini */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          {t('producer.products.images', 'Imagini')}
        </h2>
        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t('producer.products.uploadImage', 'Upload imagine produs')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('producer.products.uploadComingSoon', 'Funcționalitatea de upload va fi disponibilă în curând.')}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-semibold shadow-premium"
        >
          {isSubmitting ? t('producer.settings.saving', 'Se salvează...') : t('producer.products.saveProduct', 'Salvează produsul')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 rounded-full"
        >
          {t('actions.cancel', 'Anulează')}
        </Button>
      </div>
    </form>
  )
}

