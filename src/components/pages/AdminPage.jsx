import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import * as userService from '@/services/api/userService'
import * as auctionService from '@/services/api/auctionService'
import { formatDistanceToNow } from 'date-fns'
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddAuction, setShowAddAuction] = useState(false)

  const [auctionForm, setAuctionForm] = useState({
    title: '',
    description: '',
    terms: '',
    startingBid: '',
    endTime: '',
    images: ['https://via.placeholder.com/800x600/6366f1/ffffff?text=Auction+Item']
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'users') {
        const usersData = await userService.getAll()
        setUsers(usersData)
      } else if (activeTab === 'auctions') {
        const auctionsData = await auctionService.getAll()
        setAuctions(auctionsData)
}
    } catch (error) {
      console.error(`Failed to load ${activeTab}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
await userService.delete(userId)
      setUsers(users.filter(user => user.Id !== userId))
      console.log('User deleted successfully')
    } catch (error) {
      console.error('Failed to delete user')
    }
  }

  const handleDeleteAuction = async (auctionId) => {
    if (!confirm('Are you sure you want to delete this auction?')) return

    try {
await auctionService.delete(auctionId)
      setAuctions(auctions.filter(auction => auction.Id !== auctionId))
      console.log('Auction deleted successfully')
    } catch (error) {
      console.error('Failed to delete auction')
    }
  }

  const handleCreateAuction = async (e) => {
    e.preventDefault()

    try {
      const newAuction = await auctionService.create({
        ...auctionForm,
        startingBid: parseFloat(auctionForm.startingBid),
        currentBid: parseFloat(auctionForm.startingBid),
        status: 'active'
      })

      setAuctions([newAuction, ...auctions])
      setShowAddAuction(false)
      setAuctionForm({
        title: '',
        description: '',
        terms: '',
        startingBid: '',
        endTime: '',
images: ['https://via.placeholder.com/800x600/6366f1/ffffff?text=Auction+Item']
      })
      console.log('Auction created successfully')
    } catch (error) {
      console.error('Failed to create auction')
    }
  }

  const tabs = [
    { id: 'users', name: 'Users', icon: 'Users' },
    { id: 'auctions', name: 'Auctions', icon: 'Gavel' },
    { id: 'analytics', name: 'Analytics', icon: 'BarChart3' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, auctions, and platform settings</p>
        </div>
        
        {activeTab === 'auctions' && (
          <Button
            variant="accent"
            icon="Plus"
            onClick={() => setShowAddAuction(true)}
          >
            Create Auction
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={20} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <Loading type="table" />
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Registered Users ({users.length})
                </h3>
              </div>

              {users.length === 0 ? (
                <div className="p-6">
                  <Empty type="users" message="No users registered yet" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <ApperIcon name="User" size={20} className="text-primary-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.isAdmin ? 'accent' : 'success'}>
                              {user.isAdmin ? 'Admin' : 'Active'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(new Date(user.registeredAt), { addSuffix: true })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
size="sm"
                                icon="Edit"
                                onClick={() => console.log('Edit functionality coming soon')}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                icon="Trash2"
                                onClick={() => handleDeleteUser(user.Id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Auctions Tab */}
          {activeTab === 'auctions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Auctions ({auctions.length})
                </h3>
              </div>

              {auctions.length === 0 ? (
                <div className="p-6">
                  <Empty 
                    type="auctions" 
                    action={() => setShowAddAuction(true)}
                    actionLabel="Create First Auction"
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Bid
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ends
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auctions.map((auction) => (
                        <tr key={auction.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={auction.images[0]}
                                  alt={auction.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {auction.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: #{auction.Id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              ${auction.currentBid.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Starting: ${auction.startingBid.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={new Date(auction.endTime) > new Date() ? 'success' : 'error'}>
                              {new Date(auction.endTime) > new Date() ? 'Active' : 'Ended'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(new Date(auction.endTime), { addSuffix: true })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Eye"
                                onClick={() => window.open(`/auction/${auction.Id}`, '_blank')}
                              >
                                View
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                icon="Trash2"
                                onClick={() => handleDeleteAuction(auction.Id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Users" size={24} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Gavel" size={24} className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{auctions.length}</div>
                <div className="text-sm text-gray-600">Active Auctions</div>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="TrendingUp" size={24} className="text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${auctions.reduce((sum, auction) => sum + auction.currentBid, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Bid Value</div>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Activity" size={24} className="text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {auctions.filter(a => new Date(a.endTime) > new Date()).length}
                </div>
                <div className="text-sm text-gray-600">Live Auctions</div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Create Auction Modal */}
      {showAddAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Auction</h2>
                <button
                  onClick={() => setShowAddAuction(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAuction} className="space-y-6">
                <Input
                  label="Auction Title"
                  placeholder="Enter auction title"
                  value={auctionForm.title}
                  onChange={(e) => setAuctionForm({...auctionForm, title: e.target.value})}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input-field min-h-[100px] resize-vertical"
                    placeholder="Describe the auction item..."
                    value={auctionForm.description}
                    onChange={(e) => setAuctionForm({...auctionForm, description: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    className="input-field min-h-[80px] resize-vertical"
                    placeholder="Enter terms and conditions..."
                    value={auctionForm.terms}
                    onChange={(e) => setAuctionForm({...auctionForm, terms: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Starting Bid"
                    type="number"
                    placeholder="0"
                    value={auctionForm.startingBid}
                    onChange={(e) => setAuctionForm({...auctionForm, startingBid: e.target.value})}
                    required
                    min="1"
                  />

                  <Input
                    label="End Date & Time"
                    type="datetime-local"
                    value={auctionForm.endTime}
                    onChange={(e) => setAuctionForm({...auctionForm, endTime: e.target.value})}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddAuction(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    Create Auction
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminPage