import { ClueItem } from './ClueItem'
import type { Card } from '../types/card'

interface CardProps {
  card: Card
  revealedTips: Set<number>
  onTipClick: (index: number, tip: string) => void
}

export function Card({ card, revealedTips, onTipClick }: CardProps) {
  return (
    <article className="bg-midnight-800/90 border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/30">
      <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
        <span className="text-xs font-extrabold uppercase tracking-wider text-accent-cyan bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-500/30">
          TEMA: {card.tipo}
        </span>
        <span className="text-[11px] text-slate-400 bg-midnight-700/50 px-2.5 py-1 rounded-full border border-slate-700/40">
          <strong className="text-cyan-300">{revealedTips.size}</strong>/{card.dicas.length} reveladas
        </span>
      </div>

      <div className="max-h-[280px] overflow-y-auto pr-1.5 flex flex-col gap-2.5 mt-3 custom-scroll">
        {card.dicas.map((tip, index) => (
          <ClueItem
            key={index}
            index={index}
            tip={tip}
            isRevealed={revealedTips.has(index)}
            onClick={() => onTipClick(index, tip)}
          />
        ))}
      </div>
    </article>
  )
}
