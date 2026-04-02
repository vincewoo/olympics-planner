import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  text: string
  children: React.ReactNode
  className?: string
}

export function Tooltip({ text, children, className = '' }: Props) {
  const [visible, setVisible] = useState(false)
  const [placement, setPlacement] = useState<'above' | 'below'>('above')
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)

  // Close on outside tap / click
  useEffect(() => {
    if (!visible) return
    function handleDown(e: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener('pointerdown', handleDown)
    return () => document.removeEventListener('pointerdown', handleDown)
  }, [visible])

  // Reposition tooltip to stay within viewport
  useEffect(() => {
    if (!visible || !tooltipRef.current || !wrapperRef.current) return
    const tip = tooltipRef.current

    // Use requestAnimationFrame to ensure DOM has been updated with new placement
    const timeoutId = requestAnimationFrame(() => {
      const rect = tip.getBoundingClientRect()

      // Vertical: flip below if clipped at top
      if (placement === 'above' && rect.top < 8) {
        setPlacement('below')
        return
      }
      // If placed below but now there's room above and it's clipped below, flip back
      if (placement === 'below' && rect.bottom > window.innerHeight - 8) {
        const wrapperRect = wrapperRef.current!.getBoundingClientRect()
        if (wrapperRect.top - rect.height > 8) {
          setPlacement('above')
          return
        }
      }

      // Horizontal: keep within viewport
      if (rect.right > window.innerWidth - 8) {
        tip.style.left = 'auto'
        tip.style.right = '0'
        tip.style.transform = 'none'
      } else if (rect.left < 8) {
        tip.style.left = '0'
        tip.style.right = 'auto'
        tip.style.transform = 'none'
      }
    })

    return () => cancelAnimationFrame(timeoutId)
  }, [visible, placement])

  // Reset placement when tooltip is hidden
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!visible) setPlacement('above')
  }, [visible])

  const toggle = useCallback(() => setVisible(v => !v), [])

  const positionClasses = placement === 'above'
    ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
    : 'top-full left-1/2 -translate-x-1/2 mt-1.5'

  return (
    <span
      ref={wrapperRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={(e) => {
        e.stopPropagation()
        toggle()
      }}
    >
      {children}
      {visible && (
        <span
          ref={tooltipRef}
          role="tooltip"
          className={`absolute ${positionClasses} px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs leading-snug whitespace-pre-line shadow-lg z-50 pointer-events-none min-w-[200px] max-w-[300px] w-max text-center border border-slate-700`}
        >
          {text}
        </span>
      )}
    </span>
  )
}
