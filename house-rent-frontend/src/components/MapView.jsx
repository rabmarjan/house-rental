import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import Map from './Map'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Filter,
  Search,
  X,
  List,
  SlidersHorizontal
} from 'lucide-react'

const MapView = () => {
  const navigate = useNavigate()
  const [searchLocation, setSearchLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [priceRange, setPriceRange] = useState([1000, 5000])
  const [selectedBedrooms, setSelectedBedrooms] = useState('')
  const [selectedPropertyType, setSelectedPropertyType] = useState('')
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]) // NYC default

  // Mock properties with coordinates
  const [properties] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main St, Downtown",
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      propertyType: "apartment",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      agent: "Sarah Johnson",
      rating: 4.8,
      lat: 40.7589,
      lng: -73.9851,
      amenities: ["Gym", "Pool", "Parking"]
    },
    {
      id: 2,
      title: "Cozy Suburban House",
      address: "456 Oak Ave, Suburbia",
      price: 3200,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1800,
      propertyType: "house",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      agent: "Mike Chen",
      rating: 4.9,
      lat: 40.7282,
      lng: -73.7949,
      amenities: ["Garden", "Garage", "Fireplace"]
    },
    {
      id: 3,
      title: "Luxury Penthouse",
      address: "789 Sky Tower, Uptown",
      price: 5500,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2200,
      propertyType: "condo",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      agent: "Emily Davis",
      rating: 5.0,
      lat: 40.7831,
      lng: -73.9712,
      amenities: ["Concierge", "Rooftop", "Gym"]
    },
    {
      id: 4,
      title: "Studio Loft",
      address: "321 Art District, Creative Quarter",
      price: 1800,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      propertyType: "studio",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      agent: "Alex Rivera",
      rating: 4.6,
      lat: 40.7505,
      lng: -73.9934,
      amenities: ["High Ceilings", "Exposed Brick", "Natural Light"]
    },
    {
      id: 5,
      title: "Family Townhouse",
      address: "654 Family Lane, Quiet Neighborhood",
      price: 2800,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2000,
      propertyType: "townhouse",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      agent: "Lisa Park",
      rating: 4.7,
      lat: 40.6892,
      lng: -74.0445,
      amenities: ["Backyard", "Garage", "Near Schools"]
    },
    {
      id: 6,
      title: "Waterfront Condo",
      address: "987 Harbor View, Marina District",
      price: 4200,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      propertyType: "condo",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      agent: "David Kim",
      rating: 4.9,
      lat: 40.7061,
      lng: -74.0087,
      amenities: ["Water View", "Balcony", "Marina Access"]
    }
  ])

  const filteredProperties = properties.filter(property => {
    if (property.price < priceRange[0] || property.price > priceRange[1]) return false
    if (selectedBedrooms && property.bedrooms.toString() !== selectedBedrooms) return false
    if (selectedPropertyType && property.propertyType !== selectedPropertyType) return false
    return true
  })

  const handleLocationSearch = () => {
    // In a real app, this would use a geocoding service
    // For demo, we'll just center on NYC
    if (searchLocation.toLowerCase().includes('brooklyn')) {
      setMapCenter([40.6782, -73.9442])
    } else if (searchLocation.toLowerCase().includes('queens')) {
      setMapCenter([40.7282, -73.7949])
    } else if (searchLocation.toLowerCase().includes('manhattan')) {
      setMapCenter([40.7831, -73.9712])
    } else {
      setMapCenter([40.7128, -74.0060])
    }
  }

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
  }

  const PropertyCard = ({ property, isSelected = false }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => handlePropertyClick(property)}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-32 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-green-600">
          Available
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 mb-1">
          {property.title}
        </h3>
        <p className="text-gray-600 text-xs mb-2 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {property.address}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-600">
            ${property.price.toLocaleString()}/mo
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{property.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <div className="flex items-center">
            <Bed className="h-3 w-3 mr-1" />
            {property.bedrooms} bed
          </div>
          <div className="flex items-center">
            <Bath className="h-3 w-3 mr-1" />
            {property.bathrooms} bath
          </div>
          <div className="flex items-center">
            <Square className="h-3 w-3 mr-1" />
            {property.sqft} sqft
          </div>
        </div>

        <div className="text-xs text-gray-600">
          Agent: {property.agent}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Property Map View
            </h1>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none">
                <div className="flex">
                  <Input
                    placeholder="Search location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="rounded-r-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  />
                  <Button 
                    onClick={handleLocationSearch}
                    className="rounded-l-none"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    min={500}
                    step={100}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={selectedBedrooms}
                    onChange={(e) => setSelectedBedrooms(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bedroom/Sublet</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>
                
                <div>
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
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPriceRange([1000, 5000])
                    setSelectedBedrooms('')
                    setSelectedPropertyType('')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Property List Sidebar */}
        <div className="w-1/3 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Properties ({filteredProperties.length})
              </h2>
            </div>
            
            <div className="space-y-3">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                />
              ))}
            </div>
            
            {filteredProperties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No properties found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            center={mapCenter}
            zoom={13}
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
            height="100%"
          />
          
          {/* Selected Property Details */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedProperty.address}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  ${selectedProperty.price.toLocaleString()}/mo
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{selectedProperty.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {selectedProperty.bedrooms} bed
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {selectedProperty.bathrooms} bath
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {selectedProperty.sqft} sqft
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/property/${selectedProperty.id}`)}
                >
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapView

