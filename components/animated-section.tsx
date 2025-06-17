"use client"

import type { ReactNode } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: "fade" | "scale"
  delay?: number
  duration?: number
  triggerOnce?: boolean
  resetOnExit?: boolean
}

export function AnimatedSection({
  children,
  className = "",
  animation = "fade",
  delay = 0,
  duration = 800,
  triggerOnce = false,
  resetOnExit = true,
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    triggerOnce,
    resetOnExit,
    threshold: 0.1,
    rootMargin: "-20px",
  })

  const getAnimationClasses = () => {
    const baseClasses = "transition-all ease-out"
    const durationClass = `duration-[${duration}ms]`
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : ""

    switch (animation) {
      case "scale":
        return `${baseClasses} ${durationClass} ${delayClass} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`
      default: // fade
        return `${baseClasses} ${durationClass} ${delayClass} ${isVisible ? "opacity-100" : "opacity-0"}`
    }
  }

  return (
    <div ref={elementRef} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  )
}
