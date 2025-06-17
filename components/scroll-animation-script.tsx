"use client"

import { useEffect } from "react"

export default function ScrollAnimationScript() {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("visible")
        }
      })
    }

    window.addEventListener("scroll", animateOnScroll)
    // Trigger once on load
    animateOnScroll()

    return () => {
      window.removeEventListener("scroll", animateOnScroll)
    }
  }, [])

  return null
}
