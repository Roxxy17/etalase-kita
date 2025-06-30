"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Marker icon langsung dari CDN (tanpa perlu file lokal)
const pinIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
})

interface SME {
  id: number
  name: string
  city: string
  province: string
  short_description: string
  latitude: number
  longitude: number
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
    // Inisialisasi map jika belum dibuat
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([-2.5, 118], 5) // Tengah Indonesia

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    // Hapus semua marker lama
    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    // Tambahkan marker baru untuk setiap SME
    smes.forEach((sme) => {
      if (
        typeof sme.latitude === "number" &&
        typeof sme.longitude === "number" &&
        !isNaN(sme.latitude) &&
        !isNaN(sme.longitude)
      ) {
        const marker = L.marker([sme.latitude, sme.longitude], { icon: pinIcon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <strong>${sme.name ?? "Tanpa Nama"}</strong><br>
            ${sme.city ?? "Tanpa Kota"}, ${sme.province ?? "Tanpa Provinsi"}<br>
            <small>${sme.short_description ?? "Tidak ada deskripsi"}</small>
          `)
          .on("click", () => setSelectedSME(sme))

        markersRef.current[sme.id] = marker
      }
    })

    // Fokuskan ke marker terpilih
    if (selectedSME && markersRef.current[selectedSME.id]) {
      const marker = markersRef.current[selectedSME.id]
      marker.openPopup()
      mapRef.current.setView(marker.getLatLng(), 13)
    }
  }, [smes, selectedSME, setSelectedSME])

  return <div id="map" className="w-full h-[600px] rounded-lg border" />
}
