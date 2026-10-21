function playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
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

export function useAudio() {
  const playPositiveBeep = () => playBeep(880, 0.15, 'sine')
  const playNegativeBeep = () => {
    playBeep(220, 0.2, 'square')
    setTimeout(() => playBeep(180, 0.25, 'square'), 180)
  }

  return { playPositiveBeep, playNegativeBeep }
}
