import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Initialize dark mode before rendering to prevent flash
(function initializeDarkMode() {
  try {
    const saved = localStorage.getItem('darkMode')
    const html = document.documentElement
    if (saved === 'true') {
      html.classList.add('dark')
    } else if (saved === 'false') {
      html.classList.remove('dark')
    } else {
      // No saved preference, use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark')
      }
    }
  } catch (e) {
    // Silently fail if localStorage is not available
  }
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

