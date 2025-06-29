import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ImageGallery = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
        <ApperIcon name="Image" size={48} className="text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={images[selectedIndex]}
          alt={`${title} - Image ${selectedIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
        />
        
        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full">
          <ApperIcon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={20} />
        </div>
        
        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {selectedIndex + 1} / {images.length}
        </div>
      </motion.div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === selectedIndex
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery