import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Home, 
  Search, 
  User, 
  Menu, 
  X,
  Truck,
  MapPin,
  LogOut,
  Settings
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { isAuthenticated, user, userType, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleAuthSuccess = (userData, type) => {
    // Redirect based on user type
    if (type === 'agent') {
      navigate('/agent-dashboard')
    } else {
      navigate('/dashboard')
    }
  }
  
  

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
<header className="bg-white shadow-sm border-b sticky top-0 z-50">
  <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Left section: Logo and Nav */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Home className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">RentEase</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">Browse Properties</Link>
          <Link to="/map" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Map View</span>
          </Link>
          <Link to="/furniture-moving" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1">
            <Truck className="h-4 w-4" />
            <span>Moving Services</span>
          </Link>
        </nav>
      </div>

      {/* Right section: Search + Auth */}
      <div className="flex items-center space-x-4">
        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by city, neighborhood, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button type="submit" size="sm" className="px-4">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <>
            <Link to={userType === 'agent' ? '/agent-dashboard' : '/dashboard'}>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            {userType === 'user' && (
              <Link to="/admin-dashboard">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAuthModalOpen(true)}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
              Sign Up
            </Button>
          </>
        )}

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
        </button>
      </div>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden py-4 border-t">
        <div className="flex flex-col space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Mobile Links */}
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">Browse Properties</Link>
          <Link to="/map" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Map View</span>
          </Link>
          <Link to="/furniture-moving" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1">
            <Truck className="h-4 w-4" />
            <span>Moving Services</span>
          </Link>

          {/* Auth buttons on mobile */}
          <div className="flex space-x-2 pt-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <Link to={userType === 'agent' ? '/agent-dashboard' : '/dashboard'} className="flex-1">
                  <Button size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setIsAuthModalOpen(true)}>
                  Sign In
                </Button>
                <Button size="sm" className="flex-1" onClick={() => setIsAuthModalOpen(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Auth Modal */}
  <AuthModal
    isOpen={isAuthModalOpen}
    onClose={() => setIsAuthModalOpen(false)}
    onAuthSuccess={handleAuthSuccess}
  />
</header>

  )
}

export default Header

