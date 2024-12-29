import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Toaster} from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider.tsx'
import HeaderComponent from './components/Header.tsx'
import Footer from './components/Footer.tsx'
createRoot(document.getElementById('root')).render(
<AuthProvider>

    <BrowserRouter>
<Toaster/>
<HeaderComponent/>
<div className="min-h-[82.9vh] bg-gradient-to-br from-yellow-100 to-yellow-300">
  <App />
</div>

<Footer/>
</BrowserRouter>
</AuthProvider>
)
