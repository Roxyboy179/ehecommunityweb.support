import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Once visible, stop observing (animate only once)
        if (options.once !== false) {
          observer.unobserve(entry.target)
        }
      } else if (options.once === false) {
        setIsVisible(false)
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px'
    })

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options.threshold, options.rootMargin, options.once])

  return [ref, isVisible]
}

/**
 * Hook that returns animation class based on visibility
 * @param {string} animationClass - CSS animation class to apply
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, className] - Ref and className to apply
 */
export function useScrollAnimationClass(animationClass = 'animate-fade-in-up', options = {}) {
  const [ref, isVisible] = useScrollAnimation(options)
  const className = isVisible ? animationClass : 'will-animate'
  
  return [ref, className]
}
