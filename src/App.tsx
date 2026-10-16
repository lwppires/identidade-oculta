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
  const [opened, setOpened] = useState<string[]>([])
  const [remainingTips, setRemainingTips] = useState<string[]>([])
  const [showGuess, setShowGuess] = useState(false)
  const [guess, setGuess] = useState('')
  const [modal, setModal] = useState<ModalState | null>(null)

  const allOpened = !!current && remainingTips.length === 0

  const drawCard = () => {
    if (available.length === 0) return
    const idx = Math.floor(Math.random() * available.length)
    const card = available[idx]
    setCurrent(card)
    setOpened([])
    setRemainingTips([...card.dicas])
    setShowGuess(false)
    setGuess('')
  }

  const finishCard = () => {
    if (current) {
      setAvailable(prev => prev.filter(c => c !== current))
    }
    setCurrent(null)
    setOpened([])
    setRemainingTips([])
    setShowGuess(false)
    setGuess('')
    setModal(null)
  }

  const openTip = () => {
    setRemainingTips(prev => {
      if (prev.length === 0) return prev

      const idx = Math.floor(Math.random() * prev.length)
      const tip = prev[idx]

      // Adiciona a dica aberta
      setOpened(openedPrev => [...openedPrev, tip])

      // Remove a dica sorteada do array restante
      return prev.filter((_, i) => i !== idx)
    })
  }

  const submitGuess = () => {
    if (!guess.trim() || !current) return

    const normGuess = normalize(guess)
    const normAnswer = normalize(current.resposta)

    if (normGuess && normGuess === normAnswer) {
      const closed = remainingTips.length
      setModal({
        title: 'Acertou!',
        message: `Você acertou ande ${closed} casas no tabuleiro`,
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
    if (!current || !allOpened) return

    const nextAvailable = available.filter(c => c !== current)
    setAvailable(nextAvailable)
    setOpened([])
    setRemainingTips([])
    setShowGuess(false)
    setGuess('')
    setModal(null)

    if (nextAvailable.length > 0) {
      const idx = Math.floor(Math.random() * nextAvailable.length)
      const card = nextAvailable[idx]
      setCurrent(card)
      setRemainingTips([...card.dicas])
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

          <button
            className="btn btn-primary"
            onClick={openTip}
            disabled={remainingTips.length === 0}
          >
            ABRIR DICA ({opened.length}/15)
          </button>

          <div className="tips">
            {opened.length === 0 ? (
              <div className="empty">Nenhuma dica aberta ainda</div>
            ) : (
              <ol>
                {opened.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ol>
            )}
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

          {allOpened && (
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
