import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    // Also log to console for full stack + sourcemaps
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
    this.setState({ info })
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, background: '#0b0f1a', color: '#ff6b6b', fontFamily: 'ui-monospace, Menlo, monospace' }}>
          <h2>Runtime error</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
          {this.state.info?.componentStack && (
            <>
              <h3>Component stack</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.info.componentStack}</pre>
            </>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
