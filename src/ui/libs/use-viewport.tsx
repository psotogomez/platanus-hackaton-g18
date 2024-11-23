'use client'

import React from 'react'

export const Viewport = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const useViewport = () => {
  const [width, setWidth] = React.useState<number>(Viewport.sm)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    setWidth(window.innerWidth)
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  // Return the width so we can use it in our components
  return width
}
