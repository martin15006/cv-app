import { useEffect } from 'react'
import { createPortal } from 'react-dom'

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

  // Portal al <body>: así el modal escapa de cualquier panel con
  // backdrop-filter/transform y su position:fixed cubre toda la pantalla.
  return createPortal(
    <div className="a-modal-bg" onClick={onCerrar}>
      <div className="a-modal" onClick={(e) => e.stopPropagation()}>
        <div className="a-modal-top">
          <h3>{titulo}</h3>
          <button className="a-btn small" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="a-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  )
}
