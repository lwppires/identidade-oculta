import { useState } from 'react'
import { useGame } from './hooks/useGame'
import { Card } from './components/Card'
import { GuessForm } from './components/GuessForm'
import { GuessHistory } from './components/GuessHistory'
import { Modal } from './components/Modal'

export default function App() {
  const {
    available,
    current,
    revealedTips,
    guesses,
    modal,
    allRevealed,
    drawCard,
    revealTip,
    submitGuess,
    skipCard,
  } = useGame()

  const [guess, setGuess] = useState('')

  const handleSubmit = () => {
    if (!guess.trim()) return
    submitGuess(guess)
    setGuess('')
  }

  if (available.length === 0 && !current) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-center mb-6">Identidade Oculta</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Baralho esgotado!</h2>
          <p className="text-slate-400 mb-6">Todas as cartas foram usadas.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent-emerald text-midnight-950 font-bold px-6 py-3 rounded-xl"
          >
            Reiniciar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <h1 className="text-2xl font-extrabold text-center mb-4 tracking-tight">Identidade Oculta</h1>

      <div className="flex justify-between items-center bg-midnight-800 border border-slate-700 rounded-xl px-3 py-2 mb-4 text-sm">
        <span className="text-slate-400">
          Cartas restantes: <strong className="text-slate-200">{available.length}</strong>
        </span>
        {current && (
          <button
            onClick={drawCard}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-midnight-700 hover:bg-midnight-600 text-slate-300 border border-slate-600 hover:border-accent-cyan transition-colors"
          >
            ↻ Nova Carta
          </button>
        )}
      </div>

      {!current ? (
        <div
          onClick={drawCard}
          className="bg-gradient-to-br from-midnight-800 to-midnight-700 border border-slate-700 rounded-2xl min-h-[280px] flex items-center justify-center text-center cursor-pointer hover:border-accent-cyan transition-colors p-6"
        >
          <div className="font-extrabold text-xl tracking-wide">
            BARALHO
            <div className="text-sm font-medium mt-1 text-slate-300">Clique para sortear</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <Card card={current} revealedTips={revealedTips} onTipClick={revealTip} />
          <GuessForm value={guess} onChange={setGuess} onSubmit={handleSubmit} />
          <GuessHistory guesses={guesses} />
          {allRevealed && (
            <button
              onClick={skipCard}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl"
            >
              PULAR CARTA
            </button>
          )}
        </div>
      )}

      {modal && (
        <Modal title={modal.title} message={modal.message} onConfirm={modal.onConfirm} />
      )}
    </div>
  )
}
