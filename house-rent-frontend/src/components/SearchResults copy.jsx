import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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

import { housesAPI, agentsAPI } from '../services/api'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([1000, 5000])
  const [selectedBedrooms, setSelectedBedrooms] = useState('')
  const [selectedPropertyType, setSelectedPropertyType] = useState('')
  const [sortBy, setSortBy] = useState('price-low')

  // Mock properties data
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
      amenities: ["Gym", "Pool", "Parking"],
      available: "Available Now"
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
      amenities: ["Garden", "Garage", "Fireplace"],
      available: "Available Dec 1"
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
      amenities: ["Concierge", "Rooftop", "Gym"],
      available: "Available Now"
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
      amenities: ["High Ceilings", "Exposed Brick", "Natural Light"],
      available: "Available Now"
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
      amenities: ["Backyard", "Garage", "Near Schools"],
      available: "Available Jan 15"
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
      amenities: ["Water View", "Balcony", "Marina Access"],
      available: "Available Now"
    }
  ])
  

  const filteredProperties = properties.filter(property => {
    if (property.price < priceRange[0] || property.price > priceRange[1]) return false
    if (selectedBedrooms && property.bedrooms.toString() !== selectedBedrooms) return false
    if (selectedPropertyType && property.propertyType !== selectedPropertyType) return false
    return true
  })

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'sqft':
        return b.sqft - a.sqft
      default:
        return 0
    }
  })

  const PropertyCard = ({ property, isListView = false }) => (
    <Card 
      className={`overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${
        isListView ? 'flex flex-row' : ''
      }`}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className={`relative ${isListView ? 'w-1/3' : ''}`}>
        <img
          src={property.image}
          alt={property.title}
          className={`object-cover ${isListView ? 'w-full h-full' : 'w-full h-48'}`}
        />
        <Badge className="absolute top-4 left-4 bg-green-600">
          {property.available}
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
                ${property.price.toLocaleString()}/mo
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{property.rating}</span>
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
                {property.sqft} sqft
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className={isListView ? 'flex flex-col items-end' : 'flex items-center justify-between'}>
            <span className="text-sm text-gray-600 mb-2">
              Agent: {property.agent}
            </span>
            <Button size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Found {sortedProperties.length} properties matching your criteria
          </p>
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

            {sortedProperties.length === 0 && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults

