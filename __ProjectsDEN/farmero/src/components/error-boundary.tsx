/**
 * Error Boundary Component
 * 
 * Component pentru gestionarea erorilor la nivel de component
 * Afișează un mesaj prietenos când apare o eroare
 */

'use client'

import { Component, ReactNode } from 'react'
import { captureException } from '@/lib/sentry'
import { I18nErrorFallback } from './error-boundary-fallback'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // Log to error tracking service (Sentry)
    captureException(error, {
      react: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Use i18n fallback component
      return (
        <I18nErrorFallback 
          error={this.state.error} 
          reset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

