import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { housesAPI, agentsAPI } from '../services/api'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Filter,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'


const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([1000, 5000])
  const [selectedBedrooms, setSelectedBedrooms] = useState('')
  const [selectedPropertyType, setSelectedPropertyType] = useState('')
  const [sortBy, setSortBy] = useState('price-low')

  // Properties state from API
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [agents, setAgents] = useState({})

  // Fetch properties from API based on filters/searchParams
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch agents
        const agentsList = await agentsAPI.getAgents()
        const agentsMap = {}
        agentsList.forEach(agent => {
          agentsMap[agent.id] = agent
        })
        setAgents(agentsMap)

        // Build params from searchParams and filters
        const params = {}
        for (const [key, value] of searchParams.entries()) {
          if (value) params[key] = value
        }
        if (selectedBedrooms) params.bedrooms = selectedBedrooms
        if (selectedPropertyType) params.property_type = selectedPropertyType
        if (priceRange) {
          params.minPrice = priceRange[0]
          params.maxPrice = priceRange[1]
        }
        const data = await housesAPI.searchHouses(params)
        setProperties(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch properties')
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, selectedBedrooms, selectedPropertyType, priceRange])
  

  // Sorting (assume API returns filtered, but sort client-side)
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.rent_price || a.price || 0) - (b.rent_price || b.price || 0)
      case 'price-high':
        return (b.rent_price || b.price || 0) - (a.rent_price || a.price || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'sqft':
        return (b.square_feet || b.sqft || 0) - (a.square_feet || a.sqft || 0)
      default:
        return 0
    }
  })

  const PropertyCard = ({ property, isListView = false }) => {
    const agentName = agents[property.agent_id]?.full_name || agents[property.agent_id]?.name || property.agent_name || property.agent || 'N/A'
    return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${isListView ? 'flex flex-row' : ''}`}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className={`relative ${isListView ? 'w-1/3' : ''}`}>
        <img
          src={property.images && property.images.length > 0 ? property.images[0] : property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'}
          alt={property.title}
          className={`object-cover ${isListView ? 'w-full h-full' : 'w-full h-48'}`}
        />
        <Badge className="absolute top-4 left-4 bg-green-600">
          {property.available || 'Available'}
        </Badge>
      </div>
      <CardContent className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className={isListView ? 'flex justify-between items-start' : ''}>
          <div className={isListView ? 'flex-1 pr-4' : ''}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {property.title}
            </h3>
            <p className="text-gray-600 mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-blue-600">
                ${property.rent_price?.toLocaleString() || property.price?.toLocaleString() || 'N/A'}/mo
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{property.rating || 'N/A'}</span>
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
                {property.square_feet || property.square_feet || 'N/A'} sqft
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(property.amenities || []).slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
          <div className={isListView ? 'flex flex-col items-end' : 'flex items-center justify-between'}>
            <span className="text-sm text-gray-600 mb-2">
              Agent: {agentName}
            </span>
            <Button size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading properties...' : `Found ${sortedProperties.length} properties matching your criteria`}
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}> 
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  ×
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={500}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setPriceRange([1000, 5000])
                  setSelectedBedrooms('')
                  setSelectedPropertyType('')
                }}
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="sqft">Largest First</option>
                </select>
              </div>
            </div>
            {/* Property Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading properties...</p>
              </div>
            ) : sortedProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No properties found matching your criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setPriceRange([1000, 5000])
                    setSelectedBedrooms('')
                    setSelectedPropertyType('')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    isListView={viewMode === 'list'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults

