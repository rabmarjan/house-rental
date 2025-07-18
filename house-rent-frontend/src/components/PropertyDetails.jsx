import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { housesAPI, agentsAPI } from '../services/api'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Phone,
  Mail,
  Calendar,
  Heart,
  Share2,
  ArrowLeft,
  Car,
  Wifi,
  Dumbbell,
  Shield,
  PawPrint,
  Thermometer,
  Loader2
} from 'lucide-react'

const PropertyDetails = () => {
const { id } = useParams()
const navigate = useNavigate()
const [currentImageIndex, setCurrentImageIndex] = useState(0)
const [isFavorited, setIsFavorited] = useState(false)
const [property, setProperty] = useState(null)
const [agent, setAgent] = useState(null)
const [propertyLoading, setPropertyLoading] = useState(true)
const [agentLoading, setAgentLoading] = useState(false)
const [error, setError] = useState(null)

// Fetch property data
useEffect(() => {
  const fetchPropertyData = async () => {
    try {
      setPropertyLoading(true)
      setError(null)
      
      const propertyData = await housesAPI.getHouse(id)
      setProperty(propertyData)
    } catch (err) {
      console.error('Failed to fetch property data:', err)
      setError('Failed to load property details. Please try again.')
    } finally {
      setPropertyLoading(false)
    }
  }

  if (id) {
    fetchPropertyData()
  }
}, [id])

// Fetch agent data when property is loaded and has agent_id
useEffect(() => {
  const fetchAgentData = async () => {
    try {
      setAgentLoading(true)
      
      const agentData = await agentsAPI.getAgent(property.agent_id)
      setAgent(agentData)
    } catch (agentError) {
      console.error('Failed to fetch agent data:', agentError)
      // Continue without agent data
    } finally {
      setAgentLoading(false)
    }
  }

  if (property && property.agent_id) {
    fetchAgentData()
  }
}, [property])
  // Default amenities mapping
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-5 w-5" />
    } else if (amenityLower.includes('gym') || amenityLower.includes('fitness')) {
      return <Dumbbell className="h-5 w-5" />
    } else if (amenityLower.includes('parking') || amenityLower.includes('garage')) {
      return <Car className="h-5 w-5" />
    } else if (amenityLower.includes('security')) {
      return <Shield className="h-5 w-5" />
    } else if (amenityLower.includes('ac') || amenityLower.includes('heat') || amenityLower.includes('climate')) {
      return <Thermometer className="h-5 w-5" />
    } else if (amenityLower.includes('pet')) {
      return <PawPrint className="h-5 w-5" />
    } else {
      return <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
    }
  }

  const handleContactAgent = () => {
    if (agent) {
      navigate(`/agent/${agent.id}`)
    }
  }

  const handleScheduleTour = () => {
    // In a real app, this would open a scheduling modal or form
    alert('Tour scheduling feature would be implemented here')
  }

  const handleApplyNow = () => {
    // In a real app, this would open an application form
    alert('Application form would be implemented here')
  }

  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  // Parse amenities from string array to objects with icons
  const amenitiesWithIcons = property.amenities ? property.amenities.map(amenity => ({
    icon: getAmenityIcon(amenity),
    name: amenity
  })) : []

  // Use property.images if available and non-empty, otherwise fallback to default image
  const propertyImages = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ]

  // Format address
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Results</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img
                  src={propertyImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                  {currentImageIndex + 1} / {propertyImages.length}
                </div>
              </div>
              
              {propertyImages.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {propertyImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Property ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer ${
                        index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {fullAddress}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ${property.rent_price ? property.rent_price.toLocaleString() : 'N/A'}/mo
                  </div>
                  <Badge className={property.is_available ? "bg-green-600" : "bg-red-600"}>
                    {property.is_available ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-8 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms || 'N/A'} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms || 'N/A'} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2" />
                  <span>{property.square_feet || 'N/A'} sq ft</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="amenities" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="lease">Lease Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="amenities" className="mt-6">
                {amenitiesWithIcons.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesWithIcons.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <div className="text-blue-600">
                          {amenity.icon}
                        </div>
                        <span className="text-gray-700">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No amenities listed for this property.</p>
                )}
              </TabsContent>
              
              <TabsContent value="lease" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Lease Terms</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent:</span>
                        <span className="font-medium">${property.rent_price ? property.rent_price.toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium">${property.security_deposit ? property.security_deposit.toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium capitalize">{property.property_type || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-medium">{property.is_available ? 'Available Now' : 'Not Available'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Pet Policy</h3>
                    <p className="text-gray-700">
                      {property.pet_policy || 'Pet policy not specified. Please contact the agent for details.'}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Address Details</h3>
                    <div className="space-y-2">
                      <div className="text-gray-700">
                        <strong>Address:</strong> {property.address}
                      </div>
                      <div className="text-gray-700">
                        <strong>City:</strong> {property.city}
                      </div>
                      <div className="text-gray-700">
                        <strong>State:</strong> {property.state}
                      </div>
                      <div className="text-gray-700">
                        <strong>ZIP Code:</strong> {property.zip_code}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Neighborhood</h3>
                    <p className="text-gray-700">
                      Located in {property.city}, {property.state}. Contact the agent for more details about the neighborhood and nearby amenities.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
            <Card className="mb-6 sticky top-24">
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent>
                {agent ? (
                  <>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={agent.profile_picture} alt={agent.full_name} />
                        <AvatarFallback>{agent.full_name ? agent.full_name.split(' ').map(n => n[0]).join('') : 'A'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.full_name || agent.username}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {agent.rating || 'N/A'} ({agent.total_reviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {agent.bio || 'Professional real estate agent ready to help you find your perfect home.'}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{agent.phone || 'Contact via email'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{agent.email}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full" onClick={handleScheduleTour}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Tour
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleContactAgent}>
                        View Agent Profile
                      </Button>
                      <Button variant="secondary" className="w-full" onClick={handleApplyNow}>
                        Apply Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Agent information not available</p>
                    <div className="space-y-3">
                      <Button className="w-full" onClick={handleScheduleTour}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Tour
                      </Button>
                      <Button variant="secondary" className="w-full" onClick={handleApplyNow}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Moving Services CTA */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Need Moving Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get quotes from trusted moving companies for your furniture and belongings.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/furniture-moving')}
                >
                  Get Moving Quotes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails

