"use client";

import Link from "next/link";
import Image from "next/image";
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils/cn'

export type ProducerCardProps = {
  id: string;
  name: string;
  slug: string;
  regionName?: string;
  locationText?: string;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
  isVerified?: boolean;
  isTopProducer?: boolean;
  thumbnailUrl?: string;
  featuredProducts?: {
    name: string;
    priceText?: string;
  }[];
  deliveryOptions?: string[];
};

export function ProducerCard(props: ProducerCardProps) {
  const {
    name,
    slug,
    regionName,
    locationText,
    rating,
    ratingCount,
    tags = [],
    isVerified,
    isTopProducer,
    thumbnailUrl,
    featuredProducts = [],
    deliveryOptions = [],
  } = props;

  const location = locationText || regionName;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md dark:border-border dark:bg-card">
      {/* Cover / imagine */}
      <div className="relative h-40 w-full overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-400/30 via-lime-400/20 to-emerald-600/20 dark:from-emerald-400/10 dark:via-lime-400/5 dark:to-emerald-500/10" />
        )}

        {/* Badge-uri de colț */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {isVerified && (
            <span className="inline-flex items-center rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              ✔ Producător verificat
            </span>
          )}
          {isTopProducer && (
            <span className="inline-flex items-center rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              ★ Top producător
            </span>
          )}
        </div>
      </div>

      {/* Conținut */}
      <div className="flex flex-1 flex-col p-4">
        {/* Titlu + locație */}
        <div className="flex flex-col gap-1.5">
          <h3 className={typography.cardTitle.base}>
            {name}
          </h3>

          {location && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{location}</span>
            </p>
          )}

          {/* Rating */}
          {typeof rating === "number" && (
            <p className="flex items-center gap-1 text-xs text-foreground-body">
              <span>★ {rating.toFixed(1)}</span>
              {ratingCount ? (
                <span className="text-muted-foreground">
                  ({ratingCount} recenzii)
                </span>
              ) : null}
            </p>
          )}
        </div>

        {/* Tag-uri */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Produse reprezentative */}
        {featuredProducts.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {featuredProducts.slice(0, 3).map((product) => (
              <p
                key={product.name}
                className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300"
              >
                <span className="truncate">• {product.name}</span>
                {product.priceText && (
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {product.priceText}
                  </span>
                )}
              </p>
            ))}
          </div>
        )}

        {/* Footer card */}
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5">
            {deliveryOptions.slice(0, 3).map((opt) => (
              <span
                key={opt}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {opt}
              </span>
            ))}
          </div>

          <Link
            href={`/producers/${slug}`}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600 dark:text-slate-900"
          >
            Vezi producătorul
          </Link>
        </div>
      </div>
    </div>
  );
}

