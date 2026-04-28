import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BadgeInsProvider } from './lib/BadgeInsContext'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BadgeInsProvider>
        <App />
      </BadgeInsProvider>
    </BrowserRouter>
  </StrictMode>,
)
