import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  message = "No items found", 
  description = "There's nothing here yet.", 
  action,
  actionLabel = "Get Started",
  icon = "Package",
  type = "default" 
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'bids':
        return {
          icon: 'TrendingUp',
          message: 'No bids yet',
          description: 'Be the first to place a bid on this auction!'
        }
      case 'auctions':
        return {
          icon: 'Gavel',
          message: 'No auctions available',
          description: 'Check back soon for exciting new auctions.'
        }
      case 'account':
        return {
          icon: 'User',
          message: 'Welcome to QuickBid',
          description: 'Start bidding on auctions to see your activity here.'
        }
      case 'wins':
        return {
          icon: 'Trophy',
          message: 'No wins yet',
          description: 'Keep bidding to win your first auction!'
        }
      default:
        return { icon, message, description }
    }
  }

  const config = getEmptyConfig()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        <ApperIcon 
          name={config.icon} 
          size={40} 
          className="text-primary-600" 
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {config.message}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {config.description}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="btn-accent flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

export default Empty