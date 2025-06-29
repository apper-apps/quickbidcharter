import auctionData from '@/services/mockData/auctions.json'

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

let auctions = [...auctionData]

export const getAll = async () => {
  await delay()
  return [...auctions]
}

export const getById = async (id) => {
  await delay()
  const auction = auctions.find(a => a.Id === id)
  if (!auction) throw new Error('Auction not found')
  return { ...auction }
}

export const create = async (auctionData) => {
  await delay()
  
  // Find highest existing Id and add 1
  const maxId = auctions.length > 0 ? Math.max(...auctions.map(a => a.Id)) : 0
  const newAuction = {
    Id: maxId + 1,
    title: auctionData.title,
    description: auctionData.description,
    terms: auctionData.terms,
    images: auctionData.images || ['https://via.placeholder.com/800x600/6366f1/ffffff?text=Auction+Item'],
    startingBid: auctionData.startingBid,
    currentBid: auctionData.currentBid || auctionData.startingBid,
    highestBidderId: auctionData.highestBidderId || null,
    endTime: auctionData.endTime,
    status: auctionData.status || 'active'
  }
  
  auctions.unshift(newAuction) // Add to beginning
  return { ...newAuction }
}

export const update = async (id, updateData) => {
  await delay()
  
  const index = auctions.findIndex(a => a.Id === id)
  if (index === -1) throw new Error('Auction not found')
  
  auctions[index] = { ...auctions[index], ...updateData }
  return { ...auctions[index] }
}

export const delete_ = async (id) => {
  await delay()
  
  const index = auctions.findIndex(a => a.Id === id)
  if (index === -1) throw new Error('Auction not found')
  
  auctions.splice(index, 1)
  return true
}

// Export delete as delete for backward compatibility
export { delete_ as delete }