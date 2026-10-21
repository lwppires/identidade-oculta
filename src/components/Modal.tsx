interface ModalProps {
  title: string
  message: string
  onConfirm: () => void
}

export function Modal({ title, message, onConfirm }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-midnight-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-black mb-2">{title}</h2>
        <p className="text-slate-400 mb-5">{message}</p>
        <button
          onClick={onConfirm}
          className="bg-accent-emerald text-midnight-950 font-bold px-6 py-2.5 rounded-xl"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  )
}
