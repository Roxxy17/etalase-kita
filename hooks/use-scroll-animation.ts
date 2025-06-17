"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  resetOnExit?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.2, rootMargin = "-50px", triggerOnce = false, resetOnExit = true } = options
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasAnimated(true)
          }
        } else {
          // Reset animasi ketika elemen keluar dari viewport
          if (resetOnExit && !triggerOnce) {
            setIsVisible(false)
          } else if (!triggerOnce || !hasAnimated) {
            setIsVisible(false)
          }
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasAnimated, resetOnExit])

  return { elementRef, isVisible }
}
