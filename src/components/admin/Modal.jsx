import { useEffect } from 'react'

export default function Modal({ titulo, onCerrar, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onCerrar])

  return (
    <div className="a-modal-bg" onClick={onCerrar}>
      <div className="a-modal" onClick={(e) => e.stopPropagation()}>
        <div className="a-modal-top">
          <h3>{titulo}</h3>
          <button className="a-btn small" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="a-modal-body">{children}</div>
      </div>
    </div>
  )
}
