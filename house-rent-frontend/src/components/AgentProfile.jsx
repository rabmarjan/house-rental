import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Bed,
  Bath,
  Square,
  Building
} from 'lucide-react'

import { housesAPI, agentsAPI, reviewsAPI, agentStatsAPI } from '../services/api'

const AgentProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Main agent data
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Secondary data with separate loading states
  const [agentProperties, setAgentProperties] = useState([])
  const [propertiesLoading, setPropertiesLoading] = useState(false)
  
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  
  const [agentStat, setAgentStat] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Fetch main agent data first (critical path)
  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await agentsAPI.getAgent(id)
        setAgent(data)
      } catch (err) {
        console.error('Failed to fetch agent:', err)
        setError('Failed to load agent profile')
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [id])

  // Fetch agent properties (only after agent is loaded)
  useEffect(() => {
    const fetchProperties = async () => {
      if (!agent?.id) return
      
      setPropertiesLoading(true)
      try {
        const data = await housesAPI.getHousesByAgent(agent.id)
        setAgentProperties(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch properties:', err)
        setAgentProperties([])
      } finally {
        setPropertiesLoading(false)
      }
    }

    fetchProperties()
  }, [agent?.id])

  // Fetch reviews (only after agent is loaded)
  useEffect(() => {
    const fetchReviews = async () => {
      if (!agent?.id) return
      
      setReviewsLoading(true)
      try {
        const data = await reviewsAPI.getReviewsByAgent(agent.id)
        setReviews(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [agent?.id])

  // Fetch agent stats (only after agent is loaded)
  useEffect(() => {
    const fetchStats = async () => {
      if (!agent?.id) return
      
      setStatsLoading(true)
      try {
        const data = await agentStatsAPI.getAgentStats(agent.id)
        setAgentStat(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
        setAgentStat(null)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [agent?.id])


  // Fetch agent's properties from the API
  // const [agentProperties, setAgentProperties] = useState([])
  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     try {
  //       const data = await housesAPI.getHousesByAgent(id)
  //       setAgentProperties(Array.isArray(data) ? data : [])
  //     } catch (err) {
  //       setAgentProperties([])
  //     }
  //   }
  //   if (id) fetchProperties()
  // }, [id])

  // TODO: Replace with API call for agent's reviews
  // Fetch reviews for the agent from the API
  
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const data = await reviewsAPI.getReviewsByAgent(id)
  //       setReviews(Array.isArray(data) ? data : [])
  //     } catch (err) {
  //       setReviews([])
  //     }
  //     }
  //   if (id) fetchReviews()
  // }, [id])
  //const reviews = []

  const handleContactAgent = () => {
    // In a real app, this would open a contact form or messaging interface
    alert('Contact form would be implemented here')
  }

  const handleScheduleMeeting = () => {
    // In a real app, this would open a scheduling interface
    alert('Scheduling interface would be implemented here')
  }


  if (loading) return <div className="p-8 text-center">Loading agent profile...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!agent) return <div>Agent not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Agent Avatar and Basic Info */}
                <div className="text-center mb-6">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={agent.avatar || agent.profile_picture} alt={agent.full_name} />
                    <AvatarFallback className="text-2xl">
                      {agent.full_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {agent.full_name}
                  </h1>
                  <p className="text-gray-600 mb-2">{agent.title}</p>
                  <p className="text-sm text-gray-500 mb-4">{agent.company}</p>
                  
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-gray-600">({agent.total_reviews} reviews)</span>
                  </div>

                  <Badge variant="secondary" className="mb-4">
                    {agent.years_experience} Years Experience
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{agent.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full" onClick={handleContactAgent}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleScheduleMeeting}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Rentals:</span>
                      <span className="font-medium">{agentStat?.total_rentals ?? agentStat?.totalRentals ?? agentStat?.total_rentals ?? '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium">{agentStat?.average_response_time ?? agentStat?.averageResponseTime ?? agentStat?.average_response_time ?? '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client Satisfaction:</span>
                      <span className="font-medium">{agentStat?.client_satisfaction ?? agentStat?.clientSatisfaction ?? agentStat?.client_satisfaction ?? '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repeat Clients:</span>
                      <span className="font-medium">{agentStat?.repeat_clients ?? agentStat?.repeatClients ?? agentStat?.repeat_clients ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {agent.bio}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Specialties */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(agent.specialties) && agent.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Service Areas */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Service Areas</h3>
                        <div className="space-y-2">
                          {Array.isArray(agent.service_areas) && agent.service_areas.map((area, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(agent.languages) && agent.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                        <div className="space-y-2">
                          {Array.isArray(agent.certifications) && agent.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Award className="h-4 w-4 text-blue-600" />
                              <span>{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="properties" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Properties</CardTitle>
                    
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {agentProperties.map((property) => (
                        <div 
                          key={property.id} 
                          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <div className="relative">
                            <img
                              src={Array.isArray(property.images) ? (property.images[0] || '/default-property.jpg') : (property.images || '/default-property.jpg')}
                              alt={property.title}
                              className="w-full h-48 object-cover"
                            />
                            <Badge 
                              className={`absolute top-4 left-4 ${
                                property.is_available ? 'bg-green-600' : 'bg-gray-600'
                              }`}
                            >
                              {property.is_available ? 'Available' : `Not Available`}
                            </Badge>
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
                                {property.rent_price !== undefined && property.rent_price !== null ? `$${property.rent_price.toLocaleString()}/mo` : '-'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
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

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.author}</h4>
                              <div className="flex items-center space-x-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.isArray(agent.achievements) && agent.achievements.map((achievement, index) => (
                        <div key={index} className="text-center p-6 bg-blue-50 rounded-lg">
                          <Award className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                          <h3 className="font-semibold text-gray-900">{achievement}</h3>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentProfile

