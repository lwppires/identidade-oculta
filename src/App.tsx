import { useState } from 'react'
import { baralho, type Carta } from './baralho'

function normalize(str: string): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toUpperCase()
    .trim()
}

interface ModalState {
  title: string
  message: string
  onConfirm: () => void
}

export default function App() {
  const [available, setAvailable] = useState<Carta[]>(() => [...baralho])
  const [current, setCurrent] = useState<Carta | null>(null)
  const [revealedTips, setRevealedTips] = useState<Set<number>>(new Set())
  const [showGuess, setShowGuess] = useState(false)
  const [guess, setGuess] = useState('')
  const [modal, setModal] = useState<ModalState | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const allRevealed = !!current && revealedTips.size === current.dicas.length

  const speak = (text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.92
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const drawCard = () => {
    if (available.length === 0) return
    const idx = Math.floor(Math.random() * available.length)
    const card = available[idx]
    setCurrent(card)
    setRevealedTips(new Set())
    setShowGuess(false)
    setGuess('')
  }

  const finishCard = () => {
    if (current) {
      setAvailable(prev => prev.filter(c => c !== current))
    }
    setCurrent(null)
    setRevealedTips(new Set())
    setShowGuess(false)
    setGuess('')
    setModal(null)
  }

  const handleTipClick = (index: number, tip: string) => {
    const isRevealed = revealedTips.has(index)
    if (!isRevealed) {
      setRevealedTips(prev => new Set(prev).add(index))
    }
    speak(tip)
  }

  const submitGuess = () => {
    if (!guess.trim() || !current) return

    const normGuess = normalize(guess)
    const normAnswer = normalize(current.resposta)

    if (normGuess && normGuess === normAnswer) {
      const closed = current.dicas.length - revealedTips.size
      setModal({
        title: 'Acertou!',
        message: `Você acertou! Ande ${closed} casas no tabuleiro`,
        onConfirm: finishCard,
      })
    } else {
      setModal({
        title: 'Errou',
        message: 'Palpite errado',
        onConfirm: () => setModal(null),
      })
    }

    setGuess('')
    setShowGuess(false)
  }

  const handleSkip = () => {
    if (!current || !allRevealed) return

    const nextAvailable = available.filter(c => c !== current)
    setAvailable(nextAvailable)
    setRevealedTips(new Set())
    setShowGuess(false)
    setGuess('')
    setModal(null)

    if (nextAvailable.length > 0) {
      const idx = Math.floor(Math.random() * nextAvailable.length)
      const card = nextAvailable[idx]
      setCurrent(card)
    } else {
      setCurrent(null)
    }
  }

  if (available.length === 0 && !current) {
    return (
      <div>
        <h1>Identidade Oculta</h1>
        <div className="end">
          <h2>Baralho esgotado!</h2>
          <p>Todas as cartas foram usadas.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reiniciar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Identidade Oculta</h1>
      <div className="info">Cartas restantes: {available.length}</div>

      {!current ? (
        <div className="deck" onClick={drawCard}>
          <div className="deck-text">
            BARALHO
            <br />
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              Clique para sortear uma carta
            </span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="tema">TEMA: {current.tipo}</div>

          <div className="tips">
            {current.dicas.map((tip, index) => {
              const isRevealed = revealedTips.has(index)
              return (
                <div
                  key={index}
                  className={`tip-item ${isRevealed ? 'revealed' : 'hidden'}`}
                  onClick={() => handleTipClick(index, tip)}
                >
                  <div className="tip-header">
                    <span className="tip-number">Dica {index + 1}</span>
                    {isRevealed && (
                      <span className="audio-indicator">
                        {isSpeaking ? '🔊' : '🔊'}
                      </span>
                    )}
                  </div>
                  {isRevealed ? (
                    <div className="tip-text">{tip}</div>
                  ) : (
                    <div className="tip-placeholder">Clique para revelar</div>
                  )}
                </div>
              )
            })}
          </div>

          {!showGuess ? (
            <button className="btn btn-success" onClick={() => setShowGuess(true)}>
              PALPITE
            </button>
          ) : (
            <div className="guess-box">
              <input
                type="text"
                placeholder="Digite seu palpite..."
                value={guess}
                onChange={e => setGuess(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitGuess()}
                autoFocus
              />
              <button className="btn btn-success" onClick={submitGuess}>
                CONFIRMAR PALPITE
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowGuess(false)
                  setGuess('')
                }}
              >
                CANCELAR
              </button>
            </div>
          )}

          {allRevealed && (
            <button className="btn btn-warning" onClick={handleSkip}>
              PULAR CARTA
            </button>
          )}
        </div>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modal.title}</h2>
            <p>{modal.message}</p>
            <button className="btn btn-primary" onClick={modal.onConfirm}>
              CONFIRMAR
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
