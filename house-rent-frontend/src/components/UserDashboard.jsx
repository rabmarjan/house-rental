import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  Search, 
  Truck,
  Bell,
  Settings,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [savedProperties, setSavedProperties] = useState([])
  const [movingRequests, setMovingRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Fetch user stats (we'll use houses as saved properties for now)
      const housesResponse = await fetch(`${API_BASE_URL}/houses/`, { headers })
      if (housesResponse.ok) {
        const housesData = await housesResponse.json()
        setSavedProperties(housesData.slice(0, 3)) // Show first 3 as saved
        setStats({
          savedProperties: 3,
          viewedProperties: housesData.length,
          movingRequests: 2,
          activeAlerts: 2
        })
      }

      // Fetch moving requests
      const movingResponse = await fetch(`${API_BASE_URL}/furniture-requests/`, { headers })
      if (movingResponse.ok) {
        const movingData = await movingResponse.json()
        setMovingRequests(movingData.slice(0, 3)) // Show first 3
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default stats if API fails
      setStats({
        savedProperties: 0,
        viewedProperties: 0,
        movingRequests: 0,
        activeAlerts: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Mock search alerts and recent activity (these would come from API in real app)
  const searchAlerts = [
    {
      id: 1,
      name: "Downtown 2BR under $3000",
      criteria: "Downtown, 2 bedrooms, max $3000",
      frequency: "Daily",
      active: true,
      newMatches: 3
    },
    {
      id: 2,
      name: "Pet-friendly apartments",
      criteria: "Pet-friendly, any area, max $2500",
      frequency: "Weekly",
      active: true,
      newMatches: 1
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "property_viewed",
      title: "Viewed Modern Downtown Apartment",
      time: "2 hours ago",
      icon: <Search className="h-4 w-4" />
    },
    {
      id: 2,
      type: "property_saved",
      title: "Saved Cozy Suburban House",
      time: "1 day ago",
      icon: <Heart className="h-4 w-4" />
    },
    {
      id: 3,
      type: "moving_request",
      title: "Submitted moving request",
      time: "3 days ago",
      icon: <Truck className="h-4 w-4" />
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600'
      case 'in_progress':
        return 'bg-blue-600'
      case 'pending':
        return 'bg-yellow-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">
                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.full_name ? user.full_name.split(' ')[0] : 'User'}!
              </h1>
              <p className="text-gray-600">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats?.savedProperties || 0}</div>
                <div className="text-sm text-gray-600">Saved Properties</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Search className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats?.viewedProperties || 0}</div>
                <div className="text-sm text-gray-600">Properties Viewed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats?.movingRequests || 0}</div>
                <div className="text-sm text-gray-600">Moving Requests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats?.activeAlerts || 0}</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="saved">Saved Properties</TabsTrigger>
            <TabsTrigger value="alerts">Search Alerts</TabsTrigger>
            <TabsTrigger value="moving">Moving Requests</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="text-gray-400">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate('/search')}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Properties
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate('/furniture-moving')}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Request Moving Service
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Create Search Alert
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={property.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-4 right-4"
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.address}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-blue-600">
                            ${property.rent_price?.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {property.bedrooms} bed
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms} bath
                          </div>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.square_feet} sqft
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Search Alerts</CardTitle>
                  <Button size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.name}</h3>
                        <div className="flex items-center space-x-2">
                          {alert.newMatches > 0 && (
                            <Badge variant="secondary">
                              {alert.newMatches} new
                            </Badge>
                          )}
                          <Badge variant={alert.active ? "default" : "secondary"}>
                            {alert.active ? "Active" : "Paused"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{alert.criteria}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Frequency: {alert.frequency}
                        </span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            {alert.active ? "Pause" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moving" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Moving Requests</CardTitle>
                  <Button size="sm" onClick={() => navigate('/furniture-moving')}>
                    <Truck className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status?.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">From:</span>
                          <span className="text-gray-900">{request.pickup_address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">To:</span>
                          <span className="text-gray-900">{request.delivery_address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-blue-600">
                          ${request.estimated_cost?.toLocaleString() || 'TBD'}
                        </span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {request.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.full_name || ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Property alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Moving updates</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Marketing emails</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <Button>Update Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserDashboard

