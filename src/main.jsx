import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App.jsx'

import "primereact/resources/themes/lara-light-cyan/theme.css"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <PrimeReactProvider value={{ ripple: true }}>
    <App />
  </PrimeReactProvider>
)
