interface TipItemProps {
  index: number
  tip: string
  isRevealed: boolean
  onClick: () => void
}

export function TipItem({ index, tip, isRevealed, onClick }: TipItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
        isRevealed
          ? 'bg-midnight-700/60 border border-slate-700/70'
          : 'bg-midnight-700/30 border border-dashed border-slate-700/90 hover:bg-midnight-700/50 hover:border-cyan-500/50 cursor-pointer'
      }`}
    >
      <div className="flex-1 pr-2">
        <span className={`text-xs font-bold block ${isRevealed ? 'text-cyan-400' : 'text-slate-400'}`}>
          Dica {index + 1}
        </span>
        {isRevealed ? (
          <p className="text-sm font-semibold text-slate-200 mt-0.5 leading-snug">{tip}</p>
        ) : (
          <span className="text-xs text-slate-400 italic block mt-0.5">Clique para revelar</span>
        )}
      </div>
      {!isRevealed && (
        <span className="text-xs font-semibold text-cyan-400 px-2.5 py-1 bg-cyan-950/40 rounded border border-cyan-800/50">
          Revelar
        </span>
      )}
    </div>
  )
}
