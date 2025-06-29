import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/organisms/Layout'
import AuctionPage from '@/components/pages/AuctionPage'
import MyAccountPage from '@/components/pages/MyAccountPage'
import AdminPage from '@/components/pages/AdminPage'
function App() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <Routes>
          <Route path="/" element={<AuctionPage />} />
          <Route path="/auction/:id" element={<AuctionPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
</Routes>
      </Layout>
    </div>
  )
}

export default App