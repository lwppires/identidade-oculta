export function useSpeech() {
  const speak = (text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.85
    utterance.pitch = 1.0
    utterance.volume = 1

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = [
        'Google português do Brasil',
        'Google portugu',
        'Microsoft Maria Online',
        'Microsoft Maria',
        'Luciana',
        'Joana',
        'Daniel'
      ]

      let voice = null
      for (const name of preferred) {
        voice = voices.find(v =>
          v.name.toLowerCase().includes(name.toLowerCase()) &&
          v.lang.toLowerCase().startsWith('pt')
        )
        if (voice) break
      }

      if (!voice) {
        voice = voices.find(v => v.lang.toLowerCase().startsWith('pt-br'))
          || voices.find(v => v.lang.toLowerCase().startsWith('pt'))
      }

      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      }

      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice()
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice
    }
  }

  return { speak }
}
