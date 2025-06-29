import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ImageGallery from '@/components/molecules/ImageGallery'
import CountdownTimer from '@/components/molecules/CountdownTimer'
import BidForm from '@/components/molecules/BidForm'
import BidHistory from '@/components/molecules/BidHistory'
import RegistrationModal from '@/components/molecules/RegistrationModal'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import * as auctionService from '@/services/api/auctionService'
import * as bidService from '@/services/api/bidService'
import * as userService from '@/services/api/userService'

const AuctionPage = () => {
  const { id } = useParams()
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidsLoading, setBidsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [showRegistration, setShowRegistration] = useState(false)

  // Get the current auction (using first auction if no ID provided)
  const loadAuction = async () => {
    try {
      setError('')
      setLoading(true)
      
      let auctionData
      if (id) {
        auctionData = await auctionService.getById(parseInt(id))
      } else {
        // Get first available auction
        const auctions = await auctionService.getAll()
        auctionData = auctions[0]
      }
      
      if (!auctionData) {
        setError('Auction not found')
        return
      }
      
      setAuction(auctionData)
      await loadBids(auctionData.Id)
    } catch (err) {
      setError('Failed to load auction details')
    } finally {
      setLoading(false)
    }
  }

  const loadBids = async (auctionId) => {
    try {
      setBidsLoading(true)
      const bidsData = await bidService.getByAuctionId(auctionId)
      setBids(bidsData)
    } catch (err) {
      console.error('Failed to load bids:', err)
    } finally {
      setBidsLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    try {
      const newUser = await userService.create(userData)
      setCurrentUser(newUser)
      localStorage.setItem('quickbid_user', JSON.stringify(newUser))
    } catch (err) {
      throw new Error('Registration failed')
    }
  }

  const handleBidSubmit = async (amount) => {
    if (!currentUser) {
      setShowRegistration(true)
      return
    }

    try {
      const newBid = await bidService.create({
        auctionId: auction.Id,
        userId: currentUser.Id,
        bidderName: currentUser.name,
        amount: amount
      })

      // Update auction with new highest bid
      const updatedAuction = await auctionService.update(auction.Id, {
        currentBid: amount,
        highestBidderId: currentUser.Id
      })

      setAuction(updatedAuction)
      await loadBids(auction.Id)
    } catch (err) {
      throw new Error('Failed to place bid')
    }
  }

  const handleAuctionExpire = () => {
    toast.info('This auction has ended!')
  }

  useEffect(() => {
    loadAuction()
    
    // Check for existing user
    const savedUser = localStorage.getItem('quickbid_user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [id])

  // Real-time updates simulation
  useEffect(() => {
    if (!auction) return

    const interval = setInterval(() => {
      loadBids(auction.Id)
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [auction])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="auction" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          message={error} 
          onRetry={loadAuction}
          type="auction"
        />
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Auction not found" type="auction" />
      </div>
    )
  }

  const isAuctionActive = new Date(auction.endTime) > new Date()
  const minimumBid = Math.max(auction.currentBid + 25, auction.startingBid)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Auction Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                {auction.title}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge variant={isAuctionActive ? 'success' : 'error'}>
                  {isAuctionActive ? 'Live Auction' : 'Auction Ended'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Auction #{auction.Id}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Bid</div>
              <div className="text-3xl font-black text-green-600">
                ${auction.currentBid.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ImageGallery images={auction.images} title={auction.title} />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {auction.description}
              </p>
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-blue-50 border-blue-200"
          >
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
              <ApperIcon name="FileText" size={20} className="mr-2" />
              Terms & Conditions
            </h3>
            <div className="text-blue-800 text-sm leading-relaxed">
              {auction.terms}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CountdownTimer 
              endTime={auction.endTime}
              onExpire={handleAuctionExpire}
            />
          </motion.div>

          {/* Bid Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isAuctionActive ? (
              <BidForm
                currentBid={auction.currentBid}
                minimumBid={minimumBid}
                onBidSubmit={handleBidSubmit}
                disabled={!isAuctionActive}
              />
            ) : (
              <div className="card-premium p-6 text-center">
                <ApperIcon name="Clock" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Auction Ended
                </h3>
                <p className="text-gray-600 mb-4">
                  This auction has concluded.
                </p>
                {auction.highestBidderId && (
                  <Badge variant="success" size="lg">
                    Winner: {bids[0]?.bidderName || 'Anonymous'}
                  </Badge>
                )}
              </div>
            )}
          </motion.div>

          {/* Current User Info */}
          {currentUser && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-4 bg-primary-50 border-primary-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-primary-900">
                    {currentUser.name}
                  </div>
                  <div className="text-sm text-primary-700">
                    Registered Bidder
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Registration Prompt */}
          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 text-center bg-gradient-to-br from-accent-50 to-orange-50 border-accent-200"
            >
              <ApperIcon name="UserPlus" size={48} className="mx-auto text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Join to Bid
              </h3>
              <p className="text-gray-600 mb-4">
                Register now to participate in this auction
              </p>
              <Button
                variant="accent"
                onClick={() => setShowRegistration(true)}
                className="w-full"
                icon="Zap"
              >
                Quick Register
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bid History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <BidHistory 
          bids={bids}
          loading={bidsLoading}
          currentUserId={currentUser?.Id}
        />
      </motion.div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onRegister={handleRegister}
      />
    </div>
  )
}

export default AuctionPage