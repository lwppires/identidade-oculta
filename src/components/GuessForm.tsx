interface GuessFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function GuessForm({ value, onChange, onSubmit }: GuessFormProps) {
  return (
    <section className="bg-midnight-800/90 border border-slate-700/60 rounded-2xl p-4">
      <label className="text-xs font-bold tracking-wider uppercase text-slate-300 block mb-2">
        Digite seu palpite
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Ex: Mickey, Batman, Pikachu..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          className="w-full bg-midnight-950/80 border border-slate-700 focus:border-accent-cyan focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-slate-500 rounded-xl py-3 pl-3.5 pr-14 text-sm font-medium outline-none"
        />
        <button
          onClick={onSubmit}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-accent-emerald hover:bg-emerald-600 text-midnight-950 flex items-center justify-center font-bold shadow-md active:scale-95"
        >
          ▶
        </button>
      </div>
    </section>
  )
}
