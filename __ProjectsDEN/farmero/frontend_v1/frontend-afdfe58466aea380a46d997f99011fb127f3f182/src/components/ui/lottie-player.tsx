/**
 * Lottie Player Component
 * 
 * Component pentru redarea animațiilor Lottie
 */

'use client'

import { useEffect, useRef } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { cn } from '@/lib/utils/cn'

interface LottiePlayerProps {
  animationData: unknown
  className?: string
  loop?: boolean
  autoplay?: boolean
  width?: number | string
  height?: number | string
}

export function LottiePlayer({
  animationData,
  className,
  loop = true,
  autoplay = true,
  width = '100%',
  height = '100%',
}: LottiePlayerProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    if (lottieRef.current && autoplay) {
      lottieRef.current.play()
    }
  }, [autoplay])

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ width, height }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width, height }}
      />
    </div>
  )
}

