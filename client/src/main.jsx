import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store'
import App from './App'
import './index.css'
import axios from 'axios'
import { API_BASE_URL } from './utils/apiConfig'

import { SocketProvider } from './context/SocketContext'
import { ToastProvider } from './context/ToastContext'

// Set Axios base URL globally - aik jagah change karo, sab jagah apply ho jayega
axios.defaults.baseURL = API_BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
)

