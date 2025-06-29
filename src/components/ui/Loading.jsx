import React from 'react'

const Loading = ({ type = 'auction' }) => {
  if (type === 'auction') {
    return (
      <div className="animate-pulse space-y-8">
        {/* Image Gallery Skeleton */}
        <div className="relative">
          <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* Auction Details Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
        
        {/* Bid Section Skeleton */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (type === 'bids') {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="animate-pulse">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="bg-gray-50 px-6 py-4">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default loading
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  )
}

export default Loading