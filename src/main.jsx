import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: '#0a0e27', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              {this.state.error?.message || 'An error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #7a5af8 0%, #d66efd 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
