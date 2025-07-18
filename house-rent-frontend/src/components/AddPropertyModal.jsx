import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, Minus } from 'lucide-react'
import { housesAPI } from '../services/api'

const AddPropertyModal = ({ isOpen, onClose, onPropertyAdded }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState({})
  
  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: '',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: '',
    year_built: '',
    rent_price: '',
    security_deposit: '',
    lease_term: '',
    available_date: '',
    pet_policy: '',
    parking: '',
    amenities: [],
    features: [],
    images: [],
    virtual_tour_url: '',
    floor_plan_url: '',
    agent_id: 1
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newImage, setNewImage] = useState('')

  const propertyTypes = [
    'Apartment',
    'House',
    'Condo',
    'Townhouse',
    'Studio',
    'Loft',
    'Duplex',
    'Other'
  ]

  const petPolicies = [
    'No Pets',
    'Cats Only',
    'Dogs Only',
    'Cats and Dogs',
    'All Pets Welcome'
  ]

  const parkingOptions = [
    'No Parking',
    'Street Parking',
    'Garage',
    'Driveway',
    'Covered Parking',
    'Assigned Spot'
  ]

  const leaseTerms = [
    '6 months',
    '1 year',
    '2 years',
    'Month-to-month',
    'Flexible'
  ]

  const handleInputChange = (field, value) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addToList = (listName, value, setter) => {
    if (value.trim()) {
      setPropertyData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }))
      setter('')
    }
  }

  const removeFromList = (listName, index) => {
    setPropertyData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }))
  }

  // Validation functions for each step
  const validateStep1 = () => {
    const errors = {}
    
    if (!propertyData.title.trim()) {
      errors.title = 'Property title is required'
    }
    
    if (!propertyData.property_type) {
      errors.property_type = 'Property type is required'
    }
    
    if (!propertyData.description.trim()) {
      errors.description = 'Description is required'
    }
    
    if (!propertyData.address.trim()) {
      errors.address = 'Address is required'
    }
    
    if (!propertyData.city.trim()) {
      errors.city = 'City is required'
    }
    
    if (!propertyData.state.trim()) {
      errors.state = 'State is required'
    }
    
    if (!propertyData.zip_code.trim()) {
      errors.zip_code = 'ZIP code is required'
    }
    
    return errors
  }

  const validateStep2 = () => {
    const errors = {}
    
    if (!propertyData.bedrooms || propertyData.bedrooms < 0) {
      errors.bedrooms = 'Valid number of bedrooms is required'
    }
    
    if (!propertyData.bathrooms || propertyData.bathrooms < 0) {
      errors.bathrooms = 'Valid number of bathrooms is required'
    }
    
    if (!propertyData.rent_price || propertyData.rent_price <= 0) {
      errors.rent_price = 'Valid rent price is required'
    }

    if (!propertyData.available_date) {
      errors.available_date = 'Available date is required'
    }
    
    return errors
  }

  const validateStep3 = () => {
    // Step 3 is optional fields, so no validation needed
    return {}
  }

  const handleSubmit = async () => {
    // Validate all steps before submitting
    const step1Errors = validateStep1()
    const step2Errors = validateStep2()
    const step3Errors = validateStep3()
    
    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors }
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors)
      setError('Please fix the validation errors before submitting')
      // Go back to the first step with errors
      if (Object.keys(step1Errors).length > 0) {
        setCurrentStep(1)
      } else if (Object.keys(step2Errors).length > 0) {
        setCurrentStep(2)
      }
      return
    }
    
    setIsLoading(true)
    setError('')
    setValidationErrors({})

    try {
      // Convert string numbers to actual numbers
      const submitData = {
        ...propertyData,
        bedrooms: parseInt(propertyData.bedrooms),
        bathrooms: parseFloat(propertyData.bathrooms),
        square_feet: propertyData.square_feet ? parseInt(propertyData.square_feet) : null,
        year_built: propertyData.year_built ? parseInt(propertyData.year_built) : null,
        rent_price: parseFloat(propertyData.rent_price),
        security_deposit: propertyData.security_deposit ? parseFloat(propertyData.security_deposit) : null,
        available_date: propertyData.available_date ? new Date(propertyData.available_date).toISOString() : null
      }

      const response = await housesAPI.createHouse(submitData)
      
      if (onPropertyAdded) {
        onPropertyAdded(response)
      }
      
      // Reset form and close modal
      resetForm()
      onClose()
      
    } catch (error) {
      console.error('Error creating property:', error)
      setError(error.message || 'Failed to create property')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPropertyData({
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      property_type: '',
      bedrooms: 1,
      bathrooms: 1,
      square_feet: '',
      year_built: '',
      rent_price: '',
      security_deposit: '',
      lease_term: '',
      available_date: '',
      pet_policy: '',
      parking: '',
      amenities: [],
      features: [],
      images: [],
      virtual_tour_url: '',
      floor_plan_url: '',
      agent_id: 1
    })
    setCurrentStep(1)
    setValidationErrors({})
    setError('')
  }

  const nextStep = () => {
    let errors = {}
    
    // Validate current step before proceeding
    if (currentStep === 1) {
      errors = validateStep1()
    } else if (currentStep === 2) {
      errors = validateStep2()
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors({})
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-[98vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-2xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between px-2 sm:px-6 py-2 sm:py-4">
          <CardTitle>Add New Property - Step {currentStep} of 3</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="px-2 sm:px-6 py-2 sm:py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={propertyData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Modern Downtown Apartment"
                      className={validationErrors.title ? 'border-red-500' : ''}
                    />
                    {validationErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select 
                      value={propertyData.property_type} 
                      onValueChange={(value) => handleInputChange('property_type', value)}
                    >
                      <SelectTrigger className={validationErrors.property_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.property_type && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.property_type}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={propertyData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the property..."
                    rows={4}
                    className={validationErrors.description ? 'border-red-500' : ''}
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={propertyData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className={validationErrors.address ? 'border-red-500' : ''}
                    />
                    {validationErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={propertyData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="New York"
                      className={validationErrors.city ? 'border-red-500' : ''}
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={propertyData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="NY"
                      className={validationErrors.state ? 'border-red-500' : ''}
                    />
                    {validationErrors.state && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      value={propertyData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      placeholder="10001"
                      className={validationErrors.zip_code ? 'border-red-500' : ''}
                    />
                    {validationErrors.zip_code && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.zip_code}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      value={propertyData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className={validationErrors.bedrooms ? 'border-red-500' : ''}
                    />
                    {validationErrors.bedrooms && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.bedrooms}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      step="0.5"
                      min="0"
                      value={propertyData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className={validationErrors.bathrooms ? 'border-red-500' : ''}
                    />
                    {validationErrors.bathrooms && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.bathrooms}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="square_feet">Square Feet</Label>
                    <Input
                      id="square_feet"
                      type="number"
                      value={propertyData.square_feet}
                      onChange={(e) => handleInputChange('square_feet', e.target.value)}
                      placeholder="1200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rent_price">Monthly Rent *</Label>
                    <Input
                      id="rent_price"
                      type="number"
                      step="0.01"
                      value={propertyData.rent_price}
                      onChange={(e) => handleInputChange('rent_price', e.target.value)}
                      placeholder="2500.00"
                      className={validationErrors.rent_price ? 'border-red-500' : ''}
                    />
                    {validationErrors.rent_price && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.rent_price}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="security_deposit">Security Deposit</Label>
                    <Input
                      id="security_deposit"
                      type="number"
                      step="0.01"
                      value={propertyData.security_deposit}
                      onChange={(e) => handleInputChange('security_deposit', e.target.value)}
                      placeholder="2500.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year_built">Year Built</Label>
                    <Input
                      id="year_built"
                      type="number"
                      value={propertyData.year_built}
                      onChange={(e) => handleInputChange('year_built', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                  
                  <div>
                    <label
                      htmlFor="available_date"
                      className="block cursor-pointer w-full"
                      onClick={() => {
                        const input = document.getElementById('available_date');
                        if (input) input.showPicker ? input.showPicker() : input.click();
                      }}
                    >
                      <span className="block mb-1 font-medium">Available Date *</span>
                      <Input
                        id="available_date"
                        type="date"
                        value={propertyData.available_date}
                        onChange={(e) => handleInputChange('available_date', e.target.value)}
                        required
                        className={validationErrors.available_date ? 'border-red-500' : ''}
                        style={{ width: '100%', cursor: 'pointer' }}
                        readOnly
                        onFocus={e => e.target.removeAttribute('readOnly')}
                      />
                    </label>
                    {validationErrors.available_date && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.available_date}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="lease_term">Lease Term</Label>
                    <Select value={propertyData.lease_term} onValueChange={(value) => handleInputChange('lease_term', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lease term" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaseTerms.map(term => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="pet_policy">Pet Policy</Label>
                    <Select value={propertyData.pet_policy} onValueChange={(value) => handleInputChange('pet_policy', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet policy" />
                      </SelectTrigger>
                      <SelectContent>
                        {petPolicies.map(policy => (
                          <SelectItem key={policy} value={policy}>{policy}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="parking">Parking</Label>
                    <Select value={propertyData.parking} onValueChange={(value) => handleInputChange('parking', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking option" />
                      </SelectTrigger>
                      <SelectContent>
                        {parkingOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Amenities & Media */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Amenities & Media</h3>
                
                {/* Amenities */}
                <div>
                  <Label>Amenities</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add amenity (e.g., Pool, Gym)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('amenities', newAmenity, setNewAmenity))}
                    />
                    <Button type="button" onClick={() => addToList('amenities', newAmenity, setNewAmenity)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {propertyData.amenities.map((amenity, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                        {amenity}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromList('amenities', index)}
                          className="h-4 w-4 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label>Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add feature (e.g., Hardwood Floors, Balcony)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('features', newFeature, setNewFeature))}
                    />
                    <Button type="button" onClick={() => addToList('features', newFeature, setNewFeature)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {propertyData.features.map((feature, index) => (
                      <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromList('features', index)}
                          className="h-4 w-4 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label>Image URLs</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Add image URL"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('images', newImage, setNewImage))}
                    />
                    <Button type="button" onClick={() => addToList('images', newImage, setNewImage)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {propertyData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1 text-sm truncate">{image}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromList('images', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Virtual Tour & Floor Plan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
                    <Input
                      id="virtual_tour_url"
                      value={propertyData.virtual_tour_url}
                      onChange={(e) => handleInputChange('virtual_tour_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="floor_plan_url">Floor Plan URL</Label>
                    <Input
                      id="floor_plan_url"
                      value={propertyData.floor_plan_url}
                      onChange={(e) => handleInputChange('floor_plan_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-2 sm:gap-0">
              <div>
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Property'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// // Demo component to show the modal
// const Demo = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false)
  
//   return (
//     <div className="p-8">
//       <Button onClick={() => setIsModalOpen(true)}>
//         Open Add Property Modal
//       </Button>
      
//       <AddPropertyModal 
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onPropertyAdded={(property) => {
//           console.log('Property added:', property)
//           alert('Property created successfully!')
//         }}
//       />
//     </div>
//   )
// }

export default AddPropertyModal