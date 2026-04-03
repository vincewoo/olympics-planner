import { List, Star } from 'lucide-react'
import type { ReactNode } from 'react'

export type TabId = 'list' | 'watchlist' | 'shared-watchlist'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
  watchlistCount: number
}

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'list', label: 'Schedule', icon: <List size={16} /> },
  { id: 'watchlist', label: 'Watchlist', icon: <Star size={16} /> },
]

export function Tabs({ active, onChange, watchlistCount }: Props) {
  return (
    <div className="flex gap-1 bg-[#0a1628]/40 rounded-full p-1">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-white text-[#0a1628] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span className="sm:hidden">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
          {tab.id === 'watchlist' && watchlistCount > 0 && (
            <span className="text-xs bg-yellow-400 text-[#0a1628] rounded-full px-1.5 py-0.5 font-bold">
              {watchlistCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
