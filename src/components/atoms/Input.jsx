import React from 'react'

const Input = ({ 
  label,
  error,
  helpText,
  type = 'text',
  className = '',
  required = false,
  ...props 
}) => {
  const inputClasses = `input-field ${error ? 'border-red-500' : ''} ${className}`

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  )
}

export default Input