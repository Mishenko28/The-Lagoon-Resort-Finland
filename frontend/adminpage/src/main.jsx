import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AdminContextProvider } from './hooks/useAdmin'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AdminContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AdminContextProvider>
    </StrictMode>,
)
