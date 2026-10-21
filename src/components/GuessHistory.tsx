interface GuessHistoryProps {
  guesses: string[]
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  return (
    <section className="bg-midnight-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col h-40 overflow-hidden">
      <div className="flex justify-between items-center mb-2.5 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Palpites Anteriores ({guesses.length})
        </h2>
        <span className="text-[11px] text-slate-400">Tentativas da rodada</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto custom-scroll pr-1">
        <div className="flex flex-wrap gap-2">
          {guesses.length === 0 ? (
            <span className="text-slate-500 text-sm italic">Nenhum palpite ainda</span>
          ) : (
            guesses.map((g, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-red-950/40 border border-red-500/30 text-red-300"
              >
                <span className="text-red-400">❌</span>
                {g}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
