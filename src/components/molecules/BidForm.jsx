import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const BidForm = ({ currentBid, minimumBid, onBidSubmit, disabled = false }) => {
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const amount = parseFloat(bidAmount)
    
    if (!amount || amount < minimumBid) {
      toast.error(`Minimum bid is $${minimumBid.toLocaleString()}`)
      return
    }

    if (amount <= currentBid) {
      toast.error(`Bid must be higher than current bid of $${currentBid.toLocaleString()}`)
      return
    }

    setLoading(true)
    
    try {
      await onBidSubmit(amount)
      setBidAmount('')
      toast.success(`Bid of $${amount.toLocaleString()} placed successfully!`)
    } catch (error) {
      toast.error('Failed to place bid. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const suggestedBids = [
    currentBid + 50,
    currentBid + 100,
    currentBid + 250,
    currentBid + 500
  ]

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Place Your Bid</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Current Bid</div>
          <div className="text-2xl font-black text-green-600">
            ${currentBid.toLocaleString()}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Bid Amount"
          type="number"
          placeholder={`Minimum: $${minimumBid.toLocaleString()}`}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
          min={minimumBid}
          step="1"
          className="text-xl font-semibold"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {suggestedBids.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setBidAmount(amount.toString())}
              className="px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            variant="accent"
            size="lg"
            icon="Gavel"
            loading={loading}
            disabled={disabled || !bidAmount}
            className="w-full text-lg font-bold"
          >
            {loading ? 'Placing Bid...' : 'Place Bid'}
          </Button>
        </motion.div>
      </form>

      <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
        <ApperIcon name="Shield" size={16} className="mr-2" />
        Secure bidding powered by QuickBid
      </div>
    </div>
  )
}

export default BidForm