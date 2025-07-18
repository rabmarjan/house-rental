import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const Map = ({ 
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 13,
  properties = [],
  onPropertyClick = () => {},
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Add property markers
    properties.forEach(property => {
      if (property.lat && property.lng) {
        const marker = L.marker([property.lat, property.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${property.title}</h3>
              <p class="text-xs text-gray-600 mb-1">${property.address}</p>
              <p class="text-sm font-bold text-blue-600">$${property.price.toLocaleString()}/mo</p>
              <div class="text-xs text-gray-600 mt-1">
                ${property.bedrooms} bed • ${property.bathrooms} bath • ${property.sqft} sqft
              </div>
            </div>
          `)
          .on('click', () => onPropertyClick(property))

        markersRef.current.push(marker)
      }
    })

    // Fit map to show all markers if there are properties
    if (properties.length > 0 && properties.some(p => p.lat && p.lng)) {
      const group = new L.featureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [properties, onPropertyClick])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom)
    }
  }, [center, zoom])

  return (
    <div 
      ref={mapRef} 
      style={{ height }} 
      className={`w-full rounded-lg border ${className}`}
    />
  )
}

export default Map

