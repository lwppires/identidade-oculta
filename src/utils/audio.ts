export function playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
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
  } catch {}
}

export function playPositiveBeep() {
  playBeep(880, 0.15, 'sine')
}

export function playNegativeBeep() {
  playBeep(220, 0.2, 'square')
  setTimeout(() => playBeep(180, 0.25, 'square'), 180)
}

export function speak(text: string, onStart?: () => void, onEnd?: () => void) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'pt-BR'
  utterance.rate = 0.9

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices()
    const preferred = ['Google português do Brasil', 'Google portugu', 'Microsoft Maria', 'Luciana', 'Joana']
    let voice = null
    for (const name of preferred) {
      voice = voices.find(v => v.name.includes(name) && v.lang.toLowerCase().startsWith('pt'))
      if (voice) break
    }
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().startsWith('pt-br')) || voices.find(v => v.lang.toLowerCase().startsWith('pt'))
    }
    if (voice) utterance.voice = voice
    utterance.onstart = () => onStart?.()
    utterance.onend = () => onEnd?.()
    utterance.onerror = () => onEnd?.()
    window.speechSynthesis.speak(utterance)
  }

  if (window.speechSynthesis.getVoices().length > 0) setVoice()
  else window.speechSynthesis.onvoiceschanged = setVoice
}
