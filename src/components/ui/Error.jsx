import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'auction':
        return 'Gavel'
      case 'bid':
        return 'TrendingUp'
      default:
        return 'AlertCircle'
    }
  }

  const getErrorTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Problem'
      case 'auction':
        return 'Auction Unavailable'
      case 'bid':
        return 'Bid Failed'
      default:
        return 'Oops! Something went wrong'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <ApperIcon 
          name={getErrorIcon()} 
          size={32} 
          className="text-red-500" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default Error