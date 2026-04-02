import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  text: string
  children: React.ReactNode
  className?: string
}

export function Tooltip({ text, children, className = '' }: Props) {
  const [visible, setVisible] = useState(false)
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
    const rect = tip.getBoundingClientRect()

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
  }, [visible])

  const toggle = useCallback(() => setVisible(v => !v), [])

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
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs leading-snug whitespace-pre-line shadow-lg z-50 pointer-events-none max-w-[220px] text-center border border-slate-700"
        >
          {text}
        </span>
      )}
    </span>
  )
}
