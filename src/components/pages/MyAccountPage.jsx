import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "@/store/userSlice";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import * as userService from "@/services/api/userService";
import * as bidService from "@/services/api/bidService";
import * as auctionService from "@/services/api/auctionService";

const MyAccountPage = () => {
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.user);
const [userBids, setUserBids] = useState([]);
  const [winningBids, setWinningBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ Name: '', email: '' });

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadUserData();
    }
  }, [isAuthenticated, currentUser]);

  const loadUserData = async () => {
try {
      setLoading(true);
      
      if (!currentUser || !currentUser.userId) {
        toast.error('Please log in to access your account');
        return;
      }

      setFormData({ Name: currentUser.firstName + ' ' + currentUser.lastName, email: currentUser.emailAddress });

      // Load user bids
      const bids = await bidService.getByUserId(currentUser.userId);
      setUserBids(bids);

      // Filter winning bids (highest bids on completed auctions)
      // For demo purposes, we'll simulate some wins
      const wins = bids.filter((_, index) => index % 3 === 0); // Every 3rd bid is a "win"
      setWinningBids(wins);
    } catch (error) {
      console.error('Failed to load account data:', error);
      toast.error('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };
const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        Name: formData.Name,
        email: formData.email
      };
      
      const updatedUser = await userService.update(currentUser.userId, updateData);
      dispatch(setUser({ ...currentUser, ...updatedUser }));
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };
const tabs = [
    { id: 'profile', name: 'Profile', icon: 'User' },
    { id: 'bids', name: 'My Bids', icon: 'TrendingUp' },
    { id: 'wins', name: 'My Wins', icon: 'Trophy' },
    { id: 'settings', name: 'Settings', icon: 'Settings' }
  ];
if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty 
          type="account"
          action={() => window.location.href = '/login'}
          actionLabel="Please Login"
        />
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-6 mb-6">
            <div className="text-center">
<div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="User" size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser.firstName} {currentUser.lastName}</h2>
              <p className="text-gray-600">{currentUser.emailAddress}</p>
              <Badge variant="primary" className="mt-2">Verified Bidder</Badge>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ApperIcon name={tab.icon} size={20} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                <Button
                  variant={editMode ? 'secondary' : 'primary'}
                  onClick={() => setEditMode(!editMode)}
                  icon={editMode ? 'X' : 'Edit'}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {editMode ? (
<form onSubmit={handleUpdateProfile} className="space-y-6">
                  <Input
                    label="Full Name"
                    value={formData.Name}
                    onChange={(e) => setFormData({...formData, Name: e.target.value})}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />

                  <div className="flex space-x-4">
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
<Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({ Name: currentUser.firstName + ' ' + currentUser.lastName, email: currentUser.emailAddress });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {currentUser.emailAddress}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Member Since
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {new Date(currentUser.accounts?.[0]?.createdOn || new Date()).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Status
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userBids.length}</div>
                      <div className="text-sm text-blue-800">Total Bids</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{winningBids.length}</div>
                      <div className="text-sm text-green-800">Auctions Won</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ${userBids.reduce((sum, bid) => sum + bid.amount, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-800">Total Bid Amount</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Bids Tab */}
          {activeTab === 'bids' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">My Bid History</h3>
              
              {userBids.length === 0 ? (
                <Empty type="bids" />
              ) : (
                <div className="space-y-4">
                  {userBids.map((bid) => (
                    <div key={bid.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Gavel" size={20} className="text-primary-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Auction #{bid.auctionId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900">
                          ${bid.amount.toLocaleString()}
                        </div>
                        <Badge variant={winningBids.some(w => w.Id === bid.Id) ? 'success' : 'info'}>
                          {winningBids.some(w => w.Id === bid.Id) ? 'Won' : 'Bid Placed'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Wins Tab */}
          {activeTab === 'wins' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">My Winning Auctions</h3>
              
              {winningBids.length === 0 ? (
                <Empty type="wins" />
              ) : (
                <div className="space-y-4">
                  {winningBids.map((bid) => (
                    <div key={bid.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Trophy" size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Auction #{bid.auctionId}
                          </div>
                          <div className="text-sm text-green-700">
                            Won {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">
                          ${bid.amount.toLocaleString()}
                        </div>
                        <Badge variant="success">Winner</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Get outbid alerts and auction updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">SMS Alerts</h4>
                      <p className="text-sm text-gray-600">Receive text alerts for urgent updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Marketing Emails</h4>
                      <p className="text-sm text-gray-600">Promotional offers and new auction alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <Button variant="danger" icon="Trash2">
                    Delete Account
                  </Button>
                  <p className="text-sm text-gray-600">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
</div>
    </div>
  );
};

export default MyAccountPage;