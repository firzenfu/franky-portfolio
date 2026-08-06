import { useEffect, useState, type RefObject } from 'react'

type ViewportMediaOptions = {
  disabled?: boolean
  rootMargin?: string
}

export function useViewportMedia(
  targetRef: RefObject<Element | null>,
  { disabled = false, rootMargin = '600px 0px' }: ViewportMediaOptions = {},
) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (disabled) {
      setActive(false)
      return
    }

    const target = targetRef.current
    if (!target || typeof IntersectionObserver === 'undefined') {
      setActive(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { rootMargin, threshold: 0.01 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [disabled, rootMargin, targetRef])

  return active
}
