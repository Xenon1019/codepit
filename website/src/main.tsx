import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CssVarsProvider, CssBaseline } from '@mui/joy'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssVarsProvider defaultMode='dark'>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>,
)
