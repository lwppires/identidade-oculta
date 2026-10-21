import { useState } from 'react'
import deck from '../data/deck.json'
import type { Card } from '../types/card'
import { normalize } from '../utils/normalize'
import { useSpeech } from './useSpeech'
import { useAudio } from './useAudio'
import type { ModalState } from '../types/game'

export function useGame() {
  const [available, setAvailable] = useState<Card[]>(() => [...deck])
  const [current, setCurrent] = useState<Card | null>(null)
  const [revealedTips, setRevealedTips] = useState<Set<number>>(new Set())
  const [guesses, setGuesses] = useState<string[]>([])
  const [modal, setModal] = useState<ModalState | null>(null)

  const { speak } = useSpeech()
  const { playPositiveBeep, playNegativeBeep } = useAudio()

  const allRevealed = !!current && revealedTips.size === current.dicas.length

  const drawCard = () => {
    if (available.length === 0) return
    const idx = Math.floor(Math.random() * available.length)
    const card = available[idx]
    setCurrent(card)
    setRevealedTips(new Set())
    setGuesses([])
  }

  const finishCard = () => {
    if (current) setAvailable(prev => prev.filter(c => c !== current))
    setCurrent(null)
    setRevealedTips(new Set())
    setGuesses([])
    setModal(null)
  }

  const revealTip = (index: number, tip: string) => {
    if (!revealedTips.has(index)) {
      setRevealedTips(prev => new Set(prev).add(index))
    }
    speak(tip)
  }

  const submitGuess = (guess: string) => {
    if (!guess.trim() || !current) return
    const normGuess = normalize(guess)
    const normAnswer = normalize(current.resposta)
    setGuesses(prev => [...prev, guess.trim()])

    if (normGuess && normGuess === normAnswer) {
      const closed = current.dicas.length - revealedTips.size
      playPositiveBeep()
      setTimeout(() => speak(`Você acertou! Avance ${closed} casas.`), 250)
      setModal({
        title: 'Você acertou!',
        message: `Você acertou avance ${closed} casas!`,
        onConfirm: finishCard,
      })
    } else {
      playNegativeBeep()
      setTimeout(() => speak('Você não acertou'), 300)
      setModal({
        title: 'Você errou!',
        message: 'Você não acertou!',
        onConfirm: () => setModal(null),
      })
    }
  }

  const skipCard = () => {
    if (!current || !allRevealed) return
    playNegativeBeep()
    setTimeout(() => speak(`A resposta era ${current.resposta}.`), 400)
    const nextAvailable = available.filter(c => c !== current)
    setAvailable(nextAvailable)
    setRevealedTips(new Set())
    setGuesses([])
    setModal(null)
    if (nextAvailable.length > 0) {
      const idx = Math.floor(Math.random() * nextAvailable.length)
      setCurrent(nextAvailable[idx])
    } else {
      setCurrent(null)
    }
  }

  return {
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
    closeModal: () => setModal(null),
  }
}
