import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import { UserContextProvider } from './Contexts/UserContex'
import { QueryClient, QueryClientProvider } from 'react-query'

const client = new QueryClient()
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
