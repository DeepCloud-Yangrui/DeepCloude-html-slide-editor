import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import PresentationPage from './pages/PresentationPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path="/present/:id" element={<PresentationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
