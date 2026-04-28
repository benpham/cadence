import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BadgeInsProvider } from './lib/BadgeInsContext'
import { ThemeProvider } from './lib/ThemeContext'
import { AuthProvider } from './lib/AuthContext'
import { SettingsProvider } from './lib/SettingsContext'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/cadence">
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <BadgeInsProvider>
              <App />
            </BadgeInsProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
