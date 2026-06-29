import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { migrateFromOldKey } from './utils/storage'
import App from './App'
import './index.css'

// Migrate localStorage from old key before app renders
migrateFromOldKey()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
