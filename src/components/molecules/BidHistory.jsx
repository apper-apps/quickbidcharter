import React from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'

const BidHistory = ({ bids, loading = false, currentUserId = null }) => {
  if (loading) {
    return <Loading type="bids" />
  }

  if (!bids || bids.length === 0) {
    return <Empty type="bids" />
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Bid History</h3>
        <Badge variant="info">
          {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bids.map((bid, index) => (
          <motion.div
            key={bid.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              index === 0 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                : 'bg-gray-50 hover:bg-gray-100'
            } ${
              bid.userId === currentUserId ? 'ring-2 ring-primary-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {index === 0 ? (
                  <ApperIcon name="Crown" size={16} className="text-white" />
                ) : (
                  <ApperIcon name="User" size={16} className="text-white" />
                )}
              </div>
              
              <div>
                <div className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{bid.bidderName || 'Anonymous Bidder'}</span>
                  {bid.userId === currentUserId && (
                    <Badge variant="primary" size="sm">You</Badge>
                  )}
                  {index === 0 && (
                    <Badge variant="success" size="sm">Highest</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className={`text-right ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              <div className="font-bold text-lg">
                ${bid.amount.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BidHistory