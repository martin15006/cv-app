import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CvPublico from './pages/CvPublico.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CvPublico />} />
        <Route
          path="/admin"
          element={<p style={{ padding: 24 }}>Panel admin — Fase 2 🚧</p>}
        />
      </Routes>
    </BrowserRouter>
  )
}
