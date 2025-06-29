import userData from '@/services/mockData/users.json'

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

let users = [...userData]

export const getAll = async () => {
  await delay()
  return [...users]
}

export const getById = async (id) => {
  await delay()
  const user = users.find(u => u.Id === id)
  if (!user) throw new Error('User not found')
  return { ...user }
}

export const create = async (userData) => {
  await delay()
  
  // Find highest existing Id and add 1
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.Id)) : 0
  const newUser = {
    Id: maxId + 1,
    name: userData.name,
    email: userData.email,
    registeredAt: new Date().toISOString(),
    isAdmin: false
  }
  
  users.push(newUser)
  return { ...newUser }
}

export const update = async (id, updateData) => {
  await delay()
  
  const index = users.findIndex(u => u.Id === id)
  if (index === -1) throw new Error('User not found')
  
  users[index] = { ...users[index], ...updateData }
  return { ...users[index] }
}

export const delete_ = async (id) => {
  await delay()
  
  const index = users.findIndex(u => u.Id === id)
  if (index === -1) throw new Error('User not found')
  
  users.splice(index, 1)
  return true
}

// Export delete as delete for backward compatibility
export { delete_ as delete }