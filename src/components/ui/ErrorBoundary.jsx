import React from "react";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Show toast notification for user awareness
    toast.error('An unexpected error occurred. Please try refreshing the page.');
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoHome = () => {
    // Navigate to home and reset error state
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI for when an error occurs
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
          <div className="w-full max-w-lg p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2">
                Something went wrong
              </h1>
              <p className="text-surface-600 dark:text-surface-400">
                We encountered an unexpected error. This might be a temporary issue.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full px-6 py-3 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-md hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors font-medium"
              >
                Go to Homepage
</button>
            </div>

            {(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-surface-500 dark:text-surface-400 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-surface-100 dark:bg-surface-900 p-3 rounded border overflow-auto text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;