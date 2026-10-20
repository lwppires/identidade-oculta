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
  const [guesses, setGuesses] = useState<string[]>([])

  const allRevealed = !!current && revealedTips.size === current.dicas.length

  // Beep generator
  const playBeep = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.connect(gain)
      gain.connect(ctx.destination)

      oscillator.start()
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      console.warn('Audio not supported')
    }
  }

  const playPositiveBeep = () => playBeep(880, 0.15, 'sine')
  const playNegativeBeep = () => {
    playBeep(220, 0.2, 'square')
    setTimeout(() => playBeep(180, 0.25, 'square'), 180)
  }

  const speak = (text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.9

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = [
        'Google português do Brasil',
        'Google portugu',
        'Microsoft Maria',
        'Luciana',
        'Joana'
      ]
      let voice = null
      for (const name of preferred) {
        voice = voices.find(v => v.name.includes(name) && v.lang.toLowerCase().startsWith('pt'))
        if (voice) break
      }
      if (!voice) voice = voices.find(v => v.lang.toLowerCase().startsWith('pt-br')) || voices.find(v => v.lang.toLowerCase().startsWith('pt'))
      if (voice) utterance.voice = voice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice()
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice
    }
  }

  const drawCard = () => {
    if (available.length === 0) return
    const idx = Math.floor(Math.random() * available.length)
    const card = available[idx]
    setCurrent(card)
    setRevealedTips(new Set())
    setShowGuess(false)
    setGuess('')
    setGuesses([])
  }

  const finishCard = () => {
    if (current) {
      setAvailable(prev => prev.filter(c => c !== current))
    }
    setCurrent(null)
    setRevealedTips(new Set())
    setShowGuess(false)
    setGuess('')
    setGuesses([])
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

    // Adiciona o palpite na lista
    setGuesses(prev => [...prev, guess.trim()])

    if (normGuess && normGuess === normAnswer) {
      const closed = current.dicas.length - revealedTips.size
      playPositiveBeep()
      setTimeout(() => {
        speak(`Acertou! Você pode andar ${closed} casas no tabuleiro.`)
      }, 250)

      setModal({
        title: 'Acertou!',
        message: `Você acertou! Ande ${closed} casas no tabuleiro`,
        onConfirm: finishCard,
      })
    } else {
      playNegativeBeep()
      setTimeout(() => {
        speak('Palpite incorreto')
      }, 300)

      setModal({
        title: 'Errou',
        message: 'Palpite incorreto',
        onConfirm: () => setModal(null),
      })
    }

    setGuess('')
    setShowGuess(false)
  }

  const handleSkip = () => {
    if (!current || !allRevealed) return

    playNegativeBeep()
    setTimeout(() => {
      speak(`A resposta era ${current.resposta}`)
    }, 400)

    const nextAvailable = available.filter(c => c !== current)
    setAvailable(nextAvailable)
    setRevealedTips(new Set())
    setShowGuess(false)
    setGuess('')
    setGuesses([])
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
                    {isRevealed && <span className="audio-indicator">🔊</span>}
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

          <div className="guesses-container">
            <div className="guesses-title">Palpites já feitos</div>
            {guesses.length === 0 ? (
              <div className="guesses-empty">Nenhum palpite ainda</div>
            ) : (
              <ul className="guesses-list">
                {guesses.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
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
