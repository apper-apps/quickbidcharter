import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'accent':
        return 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border-accent-300'
      case 'primary':
        return 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border-primary-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'lg':
        return 'px-4 py-2 text-base'
      default:
        return 'px-3 py-1 text-sm'
    }
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${getVariantClasses()} ${getSizeClasses()} ${className}`}>
      {children}
    </span>
  )
}

export default Badge