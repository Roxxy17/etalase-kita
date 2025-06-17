"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Define the SME type to match our data structure
interface SME {
  id: number
  name: string
  city: string
  province: string
  shortDescription: string
  featured?: boolean
}

interface MapProps {
  smes: SME[]
  selectedSME: SME | null
  setSelectedSME: (sme: SME) => void
}

export default function Map({ smes, selectedSME, setSelectedSME }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: number]: L.Marker }>({})

  useEffect(() => {
    // Generate random coordinates for each SME (since we don't have real coordinates)
    const smeWithCoords = smes.map((sme) => ({
      ...sme,
      lat: -6.2 + Math.random() * 10 - 5, // Random coordinates around Indonesia
      lng: 106.8 + Math.random() * 10 - 5,
    }))

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([-2.5, 118], 5) // Center on Indonesia

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove()
    })
    markersRef.current = {}

    // Add markers for each SME
    smeWithCoords.forEach((sme) => {
      const marker = L.marker([sme.lat, sme.lng])
        .addTo(mapRef.current!)
        .bindPopup(
          `<strong>${sme.name}</strong><br>${sme.city}, ${sme.province}<br><small>${sme.shortDescription}</small>`,
        )
        .on("click", () => {
          setSelectedSME(sme)
        })

      markersRef.current[sme.id] = marker
    })

    // If there's a selected SME, open its popup
    if (selectedSME && markersRef.current[selectedSME.id]) {
      const marker = markersRef.current[selectedSME.id]
      marker.openPopup()
      mapRef.current.setView(marker.getLatLng(), 10)
    }

    return () => {
      // No need to clean up as we're keeping the map instance
    }
  }, [smes, selectedSME, setSelectedSME])

  return <div id="map" className="w-full h-[600px] rounded-lg border" />
}
