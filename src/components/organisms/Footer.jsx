import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  const footerLinks = {
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Auction Rules', href: '/rules' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Live Chat', href: '/chat' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ]
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black">QuickBid</h3>
                <p className="text-sm text-gray-400">Lightning Fast Auctions</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              The world's fastest and most trusted auction platform. 
              Bid with confidence, win with speed.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Facebook" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Linkedin" size={20} />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 QuickBid. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <ApperIcon name="Shield" size={16} />
                <span>Secure Payments</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <ApperIcon name="Clock" size={16} />
                <span>24/7 Support</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <ApperIcon name="Award" size={16} />
                <span>Trusted Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-8 text-xs text-gray-500">
            <span>SSL Encrypted</span>
            <span>•</span>
            <span>PCI Compliant</span>
            <span>•</span>
            <span>GDPR Compliant</span>
            <span>•</span>
            <span>SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer