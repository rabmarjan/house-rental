import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock,
  Package,
  Shield,
  Star,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react'

const FurnitureMoving = () => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    preferredDate: '',
    flexibleDates: false,
    furnitureItems: [],
    specialInstructions: '',
    contactPhone: '',
    contactEmail: ''
  })

  const [selectedItems, setSelectedItems] = useState([])
  const [currentStep, setCurrentStep] = useState(1)

  const furnitureOptions = [
    { id: 'sofa', name: 'Sofa/Couch', category: 'Living Room' },
    { id: 'dining-table', name: 'Dining Table', category: 'Dining Room' },
    { id: 'bed-queen', name: 'Queen Bed', category: 'Bedroom' },
    { id: 'bed-king', name: 'King Bed', category: 'Bedroom' },
    { id: 'dresser', name: 'Dresser', category: 'Bedroom' },
    { id: 'wardrobe', name: 'Wardrobe', category: 'Bedroom' },
    { id: 'refrigerator', name: 'Refrigerator', category: 'Kitchen' },
    { id: 'washer', name: 'Washer', category: 'Laundry' },
    { id: 'dryer', name: 'Dryer', category: 'Laundry' },
    { id: 'tv-large', name: 'Large TV (55"+)', category: 'Electronics' },
    { id: 'desk', name: 'Desk', category: 'Office' },
    { id: 'bookshelf', name: 'Bookshelf', category: 'Storage' },
    { id: 'boxes', name: 'Moving Boxes (10+)', category: 'Boxes' },
    { id: 'piano', name: 'Piano', category: 'Special Items' }
  ]

  const movingCompanies = [
    {
      id: 1,
      name: "Swift Movers",
      rating: 4.8,
      reviews: 245,
      price: "$120-180/hour",
      specialties: ["Local Moving", "Furniture Assembly"],
      phone: "(555) 123-4567",
      email: "info@swiftmovers.com",
      features: ["Insured", "Background Checked", "Same Day Service"]
    },
    {
      id: 2,
      name: "Reliable Moving Co.",
      rating: 4.9,
      reviews: 189,
      price: "$140-200/hour",
      specialties: ["Long Distance", "Fragile Items"],
      phone: "(555) 234-5678",
      email: "contact@reliablemoving.com",
      features: ["Insured", "Licensed", "Free Estimates"]
    },
    {
      id: 3,
      name: "City Movers Express",
      rating: 4.7,
      reviews: 156,
      price: "$100-150/hour",
      specialties: ["Apartment Moving", "Student Moving"],
      phone: "(555) 345-6789",
      email: "hello@citymovers.com",
      features: ["Insured", "Eco-Friendly", "Weekend Service"]
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmitRequest = () => {
    // In a real app, this would submit to the backend
    const requestData = {
      ...formData,
      furnitureItems: selectedItems.map(id => 
        furnitureOptions.find(item => item.id === id)?.name
      )
    }
    console.log('Submitting request:', requestData)
    setCurrentStep(3)
  }

  const groupedItems = furnitureOptions.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request Submitted Successfully!
            </h1>
            <p className="text-gray-600">
              We've received your moving request and will connect you with qualified movers shortly.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Quotes Within 24 Hours</h3>
                    <p className="text-gray-600 text-sm">
                      Verified moving companies will review your request and provide detailed quotes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Compare & Choose</h3>
                    <p className="text-gray-600 text-sm">
                      Review quotes, read reviews, and select the mover that best fits your needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Schedule Your Move</h3>
                    <p className="text-gray-600 text-sm">
                      Coordinate with your chosen mover to schedule your moving day.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={() => setCurrentStep(1)}>
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Furniture Moving Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get quotes from trusted, insured moving companies for your furniture and belongings. 
            Make your move to your new rental home stress-free.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">Request Details</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium">Get Quotes</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Moving Request Form</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pickup Location */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span>Pickup Location</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Street Address"
                        value={formData.pickupAddress}
                        onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                      />
                      <Input
                        placeholder="City"
                        value={formData.pickupCity}
                        onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                      />
                      <Input
                        placeholder="State"
                        value={formData.pickupState}
                        onChange={(e) => handleInputChange('pickupState', e.target.value)}
                      />
                      <Input
                        placeholder="ZIP Code"
                        value={formData.pickupZip}
                        onChange={(e) => handleInputChange('pickupZip', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>Delivery Location</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Street Address"
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                      />
                      <Input
                        placeholder="City"
                        value={formData.deliveryCity}
                        onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                      />
                      <Input
                        placeholder="State"
                        value={formData.deliveryState}
                        onChange={(e) => handleInputChange('deliveryState', e.target.value)}
                      />
                      <Input
                        placeholder="ZIP Code"
                        value={formData.deliveryZip}
                        onChange={(e) => handleInputChange('deliveryZip', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Moving Date */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span>Preferred Moving Date</span>
                    </h3>
                    <div className="space-y-4">
                      <Input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="flexible"
                          checked={formData.flexibleDates}
                          onCheckedChange={(checked) => handleInputChange('flexibleDates', checked)}
                        />
                        <label htmlFor="flexible" className="text-sm text-gray-600">
                          I'm flexible with dates (may get better rates)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Furniture Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <Package className="h-5 w-5 text-orange-600" />
                      <span>Items to Move</span>
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={item.id}
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() => handleItemToggle(item.id)}
                                />
                                <label htmlFor={item.id} className="text-sm text-gray-700">
                                  {item.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Special Instructions</h3>
                    <Textarea
                      placeholder="Any special handling requirements, access issues, or additional details..."
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Phone Number"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.pickupAddress || !formData.deliveryAddress || selectedItems.length === 0}
                  >
                    Get Moving Quotes
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Why Choose Our Service?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Verified Movers</h4>
                        <p className="text-sm text-gray-600">All companies are licensed, insured, and background-checked</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Star className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Top Rated</h4>
                        <p className="text-sm text-gray-600">Only work with highly-rated moving professionals</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Quick Response</h4>
                        <p className="text-sm text-gray-600">Get quotes within 24 hours of your request</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Local moves (hourly):</span>
                      <span className="font-medium">$100-200/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Long distance:</span>
                      <span className="font-medium">$1,200-3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packing services:</span>
                      <span className="font-medium">$25-50/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage (monthly):</span>
                      <span className="font-medium">$50-300</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    *Prices vary based on distance, items, and services required
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Moving Companies
              </h2>
              <p className="text-gray-600">
                Based on your requirements, here are qualified movers in your area
              </p>
            </div>

            <div className="space-y-6">
              {movingCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-xl font-semibold">{company.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {company.rating} ({company.reviews} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {company.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{company.email}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {company.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6 text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {company.price}
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full md:w-auto">
                            Request Quote
                          </Button>
                          <Button variant="outline" size="sm" className="w-full md:w-auto">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button onClick={handleSubmitRequest} size="lg">
                Submit Moving Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FurnitureMoving

