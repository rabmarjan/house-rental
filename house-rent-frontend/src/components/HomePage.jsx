import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Users,
  Home,
  Truck,
  Shield,
  Clock
} from 'lucide-react'
import { housesAPI, agentsAPI } from '../services/api'

const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [agents, setAgents] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch featured properties and agents on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch houses
        const housesData = await housesAPI.getHouses({ limit: 3 })
        
        // Fetch agents
        const agentsData = await agentsAPI.getAgents()
        
        // Create agents lookup object
        const agentsLookup = {}
        agentsData.forEach(agent => {
          agentsLookup[agent.id] = agent
        })
        
        setFeaturedProperties(housesData)
        setAgents(agentsLookup)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to empty arrays if API fails
        setFeaturedProperties([])
        setAgents({})
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchLocation) params.append('location', searchLocation)
    if (minPrice) params.append('minPrice', minPrice)
    if (maxPrice) params.append('maxPrice', maxPrice)
    if (bedrooms) params.append('bedrooms', bedrooms)
    
    navigate(`/search?${params.toString()}`)
  }
  
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "Smart Search",
      description: "Find your perfect home with our advanced search filters and map integration"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Expert Agents",
      description: "Connect with verified real estate agents who know your area best"
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Moving Services",
      description: "Seamless furniture moving services to help you settle into your new home"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure & Trusted",
      description: "All listings are verified and agents are thoroughly vetted for your safety"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-blue-600 block">Rental Home</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover amazing rental properties with the help of expert agents and enjoy seamless moving services. 
            Your dream home is just a search away.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="City, neighborhood, or area"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-12"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-12"
              />
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
            <Button type="submit" size="lg" className="w-full h-12 text-lg">
              <Search className="h-5 w-5 mr-2" />
              Search Properties
            </Button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose RentEase?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and moving to your new home as easy as possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked properties from our top-rated agents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${property.rent_price?.toLocaleString()}/mo
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{agents[property.agent_id]?.rating || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
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

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Agent: {agents[property.agent_id]?.full_name || 'Loading...'}
                    </span>
                    <Button size="sm" onClick={() => navigate(`/property/${property.id}`)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => navigate('/search')}>
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied renters who found their perfect home through RentEase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
              <Home className="h-5 w-5 mr-2" />
              Browse Properties
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Clock className="h-5 w-5 mr-2" />
              Schedule a Tour
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

