import { Component } from 'react'
import type { ReactNode } from 'react'
import { Home, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">出了点问题</h1>
          <p className="text-stone-500 mb-8 text-sm leading-relaxed">
            编辑器渲染时发生错误，请尝试刷新页面或返回首页。
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl
                         font-medium text-sm hover:bg-brand-hover transition-colors"
            >
              <RefreshCw size={16} />
              刷新页面
            </button>
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl
                         font-medium text-sm hover:bg-stone-200 transition-colors"
            >
              <Home size={16} />
              返回首页
            </button>
          </div>

          {this.state.error && (
            <details className="mt-6 text-left">
              <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-500">
                错误详情
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-3 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }
}
