import React from 'react'
import NavigationHeader from '@/components/molecules/NavigationHeader'
import Footer from '@/components/organisms/Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationHeader />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout