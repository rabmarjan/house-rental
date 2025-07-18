import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Users, 
  DollarSign, 
  TrendingUp,
  Star,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AddPropertyModal from './AddPropertyModal'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [properties, setProperties] = useState([])
  const [users, setUsers] = useState([])
  const [agents, setAgents] = useState([])
  const [analytics, setAnalytics] = useState(null)
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

      // Fetch admin stats
      const statsResponse = await fetch(`${API_BASE_URL}/dashboard/admin/stats`, { headers })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch all properties
      const propertiesResponse = await fetch(`${API_BASE_URL}/dashboard/admin/properties`, { headers })
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json()
        // setProperties(propertiesData)
        setProperties(Array.isArray(propertiesData) ? propertiesData : propertiesData.properties || [])
      }

      // Fetch all users
      const usersResponse = await fetch(`${API_BASE_URL}/dashboard/admin/users`, { headers })
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
       // setUsers(usersData)
        setUsers(Array.isArray(usersData) ? usersData : usersData.users || [])
      }

      // Fetch all agents
      const agentsResponse = await fetch(`${API_BASE_URL}/dashboard/admin/agents`, { headers })
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json()
        //setAgents(agentsData)
        setAgents(Array.isArray(agentsData) ? agentsData : agentsData.agents || [])
      }

      // Fetch analytics
      const analyticsResponse = await fetch(`${API_BASE_URL}/dashboard/admin/analytics`, { headers })
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyAdded = (newProperty) => {
    setProperties(prev => {
      const arr = Array.isArray(prev) ? prev : (Array.isArray(prev?.properties) ? prev.properties : []);
      return [newProperty, ...arr];
    });
    // Refresh stats
    fetchDashboardData();
  }
  //  const handlePropertyAdded = (newProperty) => {
  //   setProperties(prev => [newProperty, ...prev])
  //   // Refresh stats
  //   fetchDashboardData()
  // }

// const handlePropertyAdded = (newProperty) => {
//   setProperties(prev => {
//     const arr = Array.isArray(prev) ? prev : [];
//     return [newProperty, ...arr];
//   });
//   // Refresh stats
//   fetchDashboardData();
// };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Platform Overview & Management</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Agents</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_agents || 0}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats?.total_revenue?.toLocaleString() || '0'}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Recent Properties
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
                      Add First Property
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length > 0 ? users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{user.full_name || user.username}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Agents Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.length > 0 ? agents.slice(0, 6).map((agent) => (
                <div key={agent.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{agent.full_name}</h4>
                      <p className="text-sm text-gray-600">{agent.specialization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-yellow-600">★ {agent.rating || '0.0'}</span>
                        <span className="text-xs text-gray-500">
                          {agent.properties_count || 0} properties
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No agents yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        {analytics && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analytics.monthly_signups || 0}</p>
                  <p className="text-sm text-gray-600">New Users This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analytics.monthly_listings || 0}</p>
                  <p className="text-sm text-gray-600">New Listings This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analytics.average_rating || '0.0'}</p>
                  <p className="text-sm text-gray-600">Average Agent Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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

export default AdminDashboard

