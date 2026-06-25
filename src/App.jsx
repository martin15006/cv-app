import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CvPublico from './pages/CvPublico.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CvPublico />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
