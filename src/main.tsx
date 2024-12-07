import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@coinbase/onchainkit/styles.css'
import './index.css'
import App from './App.tsx'
import { Providers } from './Provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Providers>
    <App />
  </Providers>
  </StrictMode>,
)