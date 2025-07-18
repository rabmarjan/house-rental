import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Thermometer
} from 'lucide-react'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  // Mock property data
  const property = {
    id: 1,
    title: "Modern Downtown Apartment",
    address: "123 Main St, Downtown",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    propertyType: "apartment",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&h=600&fit=crop"
    ],
    agent: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
      rating: 4.8,
      reviews: 127,
      phone: "(555) 123-4567",
      email: "sarah.johnson@rentease.com",
      bio: "Experienced real estate agent specializing in downtown properties with over 8 years in the industry."
    },
    description: "This stunning modern apartment offers the perfect blend of luxury and convenience in the heart of downtown. With floor-to-ceiling windows, high-end finishes, and an open-concept layout, this space is ideal for professionals or couples looking for urban living at its finest.",
    amenities: [
      { icon: <Wifi className="h-5 w-5" />, name: "High-Speed Internet" },
      { icon: <Dumbbell className="h-5 w-5" />, name: "Fitness Center" },
      { icon: <Car className="h-5 w-5" />, name: "Parking Garage" },
      { icon: <Shield className="h-5 w-5" />, name: "24/7 Security" },
      { icon: <Thermometer className="h-5 w-5" />, name: "Central AC/Heat" },
      { icon: <PawPrint className="h-5 w-5" />, name: "Pet Friendly" }
    ],
    features: [
      "Hardwood floors throughout",
      "Stainless steel appliances",
      "In-unit washer/dryer",
      "Walk-in closets",
      "Private balcony",
      "Dishwasher",
      "Microwave",
      "Refrigerator"
    ],
    lease: {
      term: "12 months",
      deposit: 2500,
      available: "Available Now",
      petPolicy: "Cats and small dogs allowed with deposit"
    },
    location: {
      neighborhood: "Downtown",
      walkScore: 95,
      transitScore: 88,
      bikeScore: 82,
      nearby: [
        "Whole Foods - 0.2 miles",
        "Metro Station - 0.3 miles",
        "Central Park - 0.5 miles",
        "Shopping Center - 0.7 miles"
      ]
    }
  }

  // const handleContactAgent = () => {
  //   if (property.agent && property.agent.id) {
  //     navigate(`/agent/${property.agent.id}`)
  //   }
  // }

  const handleContactAgent = () => {
    if (property.agent && property.agent.id) {
      navigate(`/agent/${property.agent.id}`)
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
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
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
                    {property.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ${property.price.toLocaleString()}/mo
                  </div>
                  <Badge className="bg-green-600">
                    {property.lease.available}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-8 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2" />
                  <span>{property.sqft} sq ft</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="amenities" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="lease">Lease Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="amenities" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                      <div className="text-blue-600">
                        {amenity.icon}
                      </div>
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="lease" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Lease Terms</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lease Term:</span>
                        <span className="font-medium">{property.lease.term}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium">${property.lease.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-medium">{property.lease.available}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Pet Policy</h3>
                    <p className="text-gray-700">{property.lease.petPolicy}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Walkability Scores</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Walk Score:</span>
                        <Badge variant="secondary">{property.location.walkScore}/100</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transit Score:</span>
                        <Badge variant="secondary">{property.location.transitScore}/100</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bike Score:</span>
                        <Badge variant="secondary">{property.location.bikeScore}/100</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Nearby</h3>
                    <div className="space-y-2">
                      {property.location.nearby.map((place, index) => (
                        <div key={index} className="text-gray-700 text-sm">
                          {place}
                        </div>
                      ))}
                    </div>
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
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={property.agent.avatar} alt={property.agent.name} />
                    <AvatarFallback>{property.agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {property.agent.rating} ({property.agent.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {property.agent.bio}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{property.agent.email}</span>
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

