/**
 * Producer Profile Header Component
 * 
 * Header component pentru pagina de detaliu producător
 */

'use client'

import Image from 'next/image'

type ProducerProfileHeaderProps = {
  name: string
  regionName?: string
  locationText?: string
  tagline?: string
  storyShort?: string
  rating?: number
  ratingCount?: number
  isVerified?: boolean
  isTopProducer?: boolean
  specialties?: string[]
  tags?: string[]
  avatarUrl?: string
  productCount?: number
  partnerSince?: string
}

export function ProducerProfileHeader(props: ProducerProfileHeaderProps) {
  const {
    name,
    regionName,
    locationText,
    tagline,
    storyShort,
    rating,
    ratingCount,
    isVerified,
    isTopProducer,
    specialties = [],
    tags = [],
    avatarUrl,
    productCount,
    partnerSince,
  } = props

  const location = locationText || regionName
  const displayTags = specialties.length > 0 ? specialties : tags

  return (
    <section className="rounded-[32px] border border-border bg-card p-5 shadow-premium backdrop-blur-sm md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Stânga: avatar + info */}
        <div className="flex flex-1 items-start gap-4 md:gap-5">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/40 via-primary-soft/30 to-primary/40 md:h-20 md:w-20">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 64px, 80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-primary-foreground">
                {name?.[0]?.toUpperCase() ?? 'F'}
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {name}
              </h1>

              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  ✔ Producător verificat
                </span>
              )}

              {isTopProducer && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                  ★ Top producător
                </span>
              )}
            </div>

            {location && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{location}</span>
                <span className="h-3 w-px bg-border" />
                <span className="text-[11px] uppercase tracking-wide text-primary">
                  Preț de producător
                </span>
              </p>
            )}

            {tagline && (
              <p className="text-sm font-medium text-foreground">
                {tagline}
              </p>
            )}

            {storyShort && (
              <p className="max-w-xl text-xs text-foreground-body md:text-sm">
                {storyShort}
              </p>
            )}

            {/* rating + specializări */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground-body">
              {typeof rating === 'number' && (
                <span className="inline-flex items-center gap-1">
                  <span>★ {rating.toFixed(1)}</span>
                  {ratingCount ? (
                    <span className="text-muted-foreground">
                      ({ratingCount} recenzii)
                    </span>
                  ) : null}
                </span>
              )}

              {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {displayTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dreapta: micro-info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-foreground-body md:grid-cols-3">
          {partnerSince && (
            <div className="rounded-2xl bg-muted px-3 py-2">
              <p className="text-[11px] text-muted-foreground">
                An debut pe platformă
              </p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(partnerSince).getFullYear()}
              </p>
            </div>
          )}
          <div className="rounded-2xl bg-muted px-3 py-2">
            <p className="text-[11px] text-muted-foreground">
              Tip producător
            </p>
            <p className="text-sm font-semibold text-foreground">
              Gospodărie locală
            </p>
          </div>
          {typeof productCount === 'number' && (
            <div className="rounded-2xl bg-muted px-3 py-2">
              <p className="text-[11px] text-muted-foreground">
                Produse active
              </p>
              <p className="text-sm font-semibold text-foreground">
                {productCount}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

