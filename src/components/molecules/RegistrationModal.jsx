import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const RegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      await onRegister({
        name: formData.name.trim(),
        email: formData.email.trim()
      })
      
      toast.success('Registration successful! You can now place bids.')
      onClose()
      setFormData({ name: '', email: '', acceptTerms: false })
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="UserPlus" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Join QuickBid</h2>
                <p className="text-sm text-gray-500">Register to start bidding</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <div className="space-y-2">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to QuickBid's{' '}
                  <button type="button" className="text-primary-600 hover:text-primary-700 underline">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-primary-600 hover:text-primary-700 underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600 ml-7">{errors.acceptTerms}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="accent"
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Registering...' : 'Register & Bid'}
              </Button>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <ApperIcon name="Shield" size={16} />
              <span className="font-medium">Your information is secure</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              We use industry-standard encryption to protect your data.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default RegistrationModal