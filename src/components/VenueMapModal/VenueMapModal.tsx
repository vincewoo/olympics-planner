import { useEffect } from 'react'
import { X, MapPinOff, Ticket } from 'lucide-react'
import { VENUE_MAPS } from '../../data/venueMapData'

interface Props {
  venue: string
  prices?: Record<string, number>
  onClose: () => void
}

export function VenueMapModal({ venue, prices, onClose }: Props) {
  const mapInfo = VENUE_MAPS[venue]
  const displayName = mapInfo?.altName ?? venue

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 truncate">{displayName}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {mapInfo ? (
            <img
              src={`${import.meta.env.BASE_URL}venue-maps/${mapInfo.imageFile}`}
              alt={`${displayName} seating chart`}
              className="w-full object-contain rounded-lg"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <MapPinOff size={48} strokeWidth={1.5} />
              <p className="mt-3 text-sm">Seating chart not available for {venue}</p>
            </div>
          )}
        </div>

        {/* Footer — price legend */}
        {prices && (
          <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 border-t border-slate-100">
            <Ticket size={13} className="text-emerald-600 shrink-0" />
            {Object.entries(prices)
              .sort((a, b) => a[1] - b[1])
              .map(([cat, price]) => (
                <span key={cat} className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-1">
                  Category {cat} — ${Math.round(price)}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
