import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary'
      case 'accent':
        return 'btn-accent'
      case 'secondary':
        return 'btn-secondary'
      case 'outline':
        return 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200'
      case 'ghost':
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-all duration-200'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
      default:
        return 'btn-primary'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4 text-sm'
      case 'lg':
        return 'py-4 px-8 text-lg'
      default:
        return 'py-3 px-6'
    }
  }

  const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getVariantClasses()} ${getSizeClasses()} ${className}`

  const content = (
    <>
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={18} 
          className="animate-spin mr-2" 
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          size={18} 
          className="mr-2" 
        />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          size={18} 
          className="ml-2" 
        />
      )}
    </>
  )

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export default Button