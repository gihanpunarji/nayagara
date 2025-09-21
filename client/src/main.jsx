import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CustomerRegistration from './components/ui/CustomerRegistration.jsx'
import CustomerLogin from './components/ui/customerLogin.jsx'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='/login' element={<CustomerLogin/>}/>
    <Route path='/register' element={<CustomerRegistration/>}/>
  </Routes>
</BrowserRouter>
)
