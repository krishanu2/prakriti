import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'

const App = lazy(() => import('./App.jsx'))
const Admin = lazy(() => import('./admin/Admin.jsx'))

const isAdmin = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary context={isAdmin ? 'admin' : 'site'}>
      <Suspense fallback={null}>
        {isAdmin ? <Admin /> : <App />}
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
)
