import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AddPropertyModal from './AddPropertyModal'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AgentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [properties, setProperties] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Fetch agent stats
      const statsResponse = await fetch(`${API_BASE_URL}/dashboard/agent/stats`, { headers })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch agent properties
      const propertiesResponse = await fetch(`${API_BASE_URL}/dashboard/agent/properties`, { headers })
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json()
        setProperties(Array.isArray(propertiesData) ? propertiesData : propertiesData.properties || [])
      }

      // Fetch inquiries
      const inquiriesResponse = await fetch(`${API_BASE_URL}/dashboard/agent/inquiries`, { headers })
      if (inquiriesResponse.ok) {
        const inquiriesData = await inquiriesResponse.json()
       // setInquiries(inquiriesData)
        setInquiries(Array.isArray(inquiriesData) ? inquiriesData : inquiriesData.inquiries || [])
        
      }

      // Fetch recent activities
      const activitiesResponse = await fetch(`${API_BASE_URL}/dashboard/agent/recent-activity`, { headers })
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        // setActivities(activitiesData)
        setActivities(Array.isArray(activitiesData) ? activitiesData : activitiesData.activities || [])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyAdded = (newProperty) => {
    setProperties(prev => {
    const arr = Array.isArray(prev) ? prev : [];
    return [newProperty, ...arr];
  });
    // Refresh stats
    fetchDashboardData();
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || user?.username}</p>
          </div>
          <Button onClick={() => setIsAddPropertyModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_properties || 0}</p>
                </div>
                <Home className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats?.monthly_revenue?.toLocaleString() || '0'}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.average_rating || '0.0'}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.active_inquiries || 0}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                My Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.length > 0 ? properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{property.title}</h4>
                      <p className="text-sm text-gray-600">{property.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-medium text-green-600">
                          ${property.rent_price}/mo
                        </span>
                        <Badge variant={property.is_available ? "default" : "secondary"}>
                          {property.is_available ? "Available" : "Rented"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No properties yet</p>
                    <Button 
                      onClick={() => setIsAddPropertyModalOpen(true)}
                      className="mt-2"
                      variant="outline"
                    >
                      Add Your First Property
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inquiries.length > 0 ? inquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{inquiry.user_name}</h4>
                      <p className="text-sm text-gray-600">{inquiry.property_title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        inquiry.status === 'pending' ? 'default' :
                        inquiry.status === 'approved' ? 'default' :
                        'secondary'
                      }>
                        {inquiry.status}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No inquiries yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'property_created' && <Plus className="h-5 w-5 text-green-600" />}
                    {activity.type === 'inquiry_received' && <Users className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'property_viewed' && <Eye className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-600">{activity.timestamp}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </div>
  )
}

export default AgentDashboard

