import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CountdownTimer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  })
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        
        setTimeLeft({ days, hours, minutes, seconds })
        
        // Mark as urgent if less than 5 minutes
        setIsUrgent(difference < 5 * 60 * 1000)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onExpire) onExpire()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpire])

  const TimeUnit = ({ value, label }) => (
    <motion.div
      key={value}
      initial={{ scale: 1 }}
      animate={{ scale: isUrgent ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
      className={`text-center ${isUrgent ? 'timer-urgent' : ''}`}
    >
      <div className={`text-3xl md:text-4xl font-black ${isUrgent ? 'text-red-500' : 'text-gray-900'}`}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  )

  return (
    <div className={`card-premium p-6 ${isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        {isUrgent ? '🔥 Auction Ending Soon!' : 'Time Remaining'}
      </h3>
      
      <div className="grid grid-cols-4 gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
      
      {isUrgent && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            ⚡ Last chance to bid!
          </span>
        </div>
      )}
    </div>
  )
}

export default CountdownTimer