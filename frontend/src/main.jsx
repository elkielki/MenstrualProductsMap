import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import { UserContextProvider } from './context/userContext';
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <UserContextProvider>
        <Router>
          <App /> 
        </Router>
      </UserContextProvider>
    </React.StrictMode>

)