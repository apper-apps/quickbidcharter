import bidData from '@/services/mockData/bids.json'

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

let bids = [...bidData]

export const getAll = async () => {
  await delay()
  return [...bids].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const getById = async (id) => {
  await delay()
  const bid = bids.find(b => b.Id === id)
  if (!bid) throw new Error('Bid not found')
  return { ...bid }
}

export const getByAuctionId = async (auctionId) => {
  await delay()
  return [...bids]
    .filter(b => b.auctionId === auctionId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const getByUserId = async (userId) => {
  await delay()
  return [...bids]
    .filter(b => b.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const create = async (bidData) => {
  await delay()
  
  // Find highest existing Id and add 1
  const maxId = bids.length > 0 ? Math.max(...bids.map(b => b.Id)) : 0
  const newBid = {
    Id: maxId + 1,
    auctionId: bidData.auctionId,
    userId: bidData.userId,
    bidderName: bidData.bidderName,
    amount: bidData.amount,
    timestamp: new Date().toISOString()
  }
  
  bids.unshift(newBid) // Add to beginning
  return { ...newBid }
}

export const update = async (id, updateData) => {
  await delay()
  
  const index = bids.findIndex(b => b.Id === id)
  if (index === -1) throw new Error('Bid not found')
  
  bids[index] = { ...bids[index], ...updateData }
  return { ...bids[index] }
}

export const delete_ = async (id) => {
  await delay()
  
  const index = bids.findIndex(b => b.Id === id)
  if (index === -1) throw new Error('Bid not found')
  
  bids.splice(index, 1)
  return true
}

// Export delete as delete for backward compatibility
export { delete_ as delete }