export type TabId = 'list' | 'calendar' | 'watchlist'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
  watchlistCount: number
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'list', label: 'Schedule' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'watchlist', label: 'Watchlist' },
]

export function Tabs({ active, onChange, watchlistCount }: Props) {
  return (
    <div className="flex gap-1 bg-[#0a1628]/40 rounded-full p-1">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-white text-[#0a1628] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          {tab.label}
          {tab.id === 'watchlist' && watchlistCount > 0 && (
            <span className="ml-1.5 text-xs bg-yellow-400 text-[#0a1628] rounded-full px-1.5 py-0.5 font-bold">
              {watchlistCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
