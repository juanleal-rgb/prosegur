'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import IncidentSidebar from './IncidentSidebar'
import { cn } from '@/lib/utils'
import { MapPin, AlertTriangle, Activity, Shield } from 'lucide-react'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface Incident {
  id: string
  createdAt: string
  summary: string
  severity: string
  htmlReport: string
}

interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  incidents: Incident[]
}

export default function MapDashboard() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocations()
    // Refresh every 30 seconds to get new incidents
    const interval = setInterval(fetchLocations, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location)
    setIsSidebarOpen(true)
  }

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalLocations = locations.length
    const totalIncidents = locations.reduce((sum, loc) => sum + loc.incidents.length, 0)
    const highSeverityIncidents = locations.reduce(
      (sum, loc) => sum + loc.incidents.filter(inc => inc.severity.toLowerCase() === 'high').length,
      0
    )
    const recentIncidents = locations.reduce(
      (sum, loc) => {
        const recent = loc.incidents.filter(inc => {
          const incidentDate = new Date(inc.createdAt)
          const hoursAgo = (Date.now() - incidentDate.getTime()) / (1000 * 60 * 60)
          return hoursAgo < 24
        }).length
        return sum + recent
      },
      0
    )

    return {
      totalLocations,
      totalIncidents,
      highSeverityIncidents,
      recentIncidents,
    }
  }, [locations])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--prosegur-bg)]">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="w-5 h-5 border-2 border-zinc-700 border-t-[var(--prosegur-primary)] rounded-full animate-spin" />
          <span className="font-mono text-sm">CARGANDO MAPA...</span>
        </div>
      </div>
    )
  }

  // Default center to Madrid
  const center: [number, number] = [40.4168, -3.7038]

  return (
    <div className="flex flex-col h-screen bg-[var(--prosegur-bg)] overflow-hidden">
      {/* Header */}
      <header className="flex-none z-30 bg-[var(--prosegur-bg)]/80 backdrop-blur-xl border-b border-[var(--prosegur-border)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              Centro de Control de Incidentes
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5 font-mono">
              MONITOREO EN TIEMPO REAL
            </p>
          </div>
        </div>
      </header>

      {/* KPI Strip */}
      <div className="flex-none grid grid-cols-2 md:grid-cols-4 gap-4 p-6 pb-4">
        <div
          className={cn(
            "relative overflow-hidden rounded-lg px-4 py-3",
            "bg-[var(--prosegur-card)] border border-[var(--prosegur-border)]",
            "shadow-sm transition-all hover:border-zinc-600 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Ubicaciones
              </p>
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-mono">
                {kpis.totalLocations}
              </span>
            </div>
            <div className="rounded-full p-1.5 bg-blue-500/10 text-blue-500">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-lg px-4 py-3",
            "bg-[var(--prosegur-card)] border border-[var(--prosegur-border)]",
            "shadow-sm transition-all hover:border-zinc-600 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Incidentes
              </p>
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-mono">
                {kpis.totalIncidents}
              </span>
            </div>
            <div className="rounded-full p-1.5 bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-lg px-4 py-3",
            "bg-[var(--prosegur-card)] border border-[var(--prosegur-border)]",
            "shadow-sm transition-all hover:border-zinc-600 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Alta Severidad
              </p>
              <span
                className={cn(
                  "text-2xl font-bold tracking-tight font-mono",
                  kpis.highSeverityIncidents > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-900 dark:text-white"
                )}
              >
                {kpis.highSeverityIncidents}
              </span>
            </div>
            <div
              className={cn(
                "rounded-full p-1.5",
                kpis.highSeverityIncidents > 0
                  ? "bg-red-500/10 text-red-500"
                  : "bg-zinc-500/10 text-zinc-500"
              )}
            >
              <Shield className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-lg px-4 py-3",
            "bg-[var(--prosegur-card)] border border-[var(--prosegur-border)]",
            "shadow-sm transition-all hover:border-zinc-600 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Últimas 24h
              </p>
              <span
                className={cn(
                  "text-2xl font-bold tracking-tight font-mono",
                  kpis.recentIncidents > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {kpis.recentIncidents}
              </span>
            </div>
            <div
              className={cn(
                "rounded-full p-1.5",
                kpis.recentIncidents > 0
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-emerald-500/10 text-emerald-500"
              )}
            >
              <Activity className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative min-h-0 p-6 pt-0">
        <div className="h-full w-full rounded-xl overflow-hidden border border-[var(--prosegur-border)] bg-zinc-900/50 shadow-xl">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => {
              const hasHighSeverity = location.incidents.some(
                inc => inc.severity.toLowerCase() === 'high'
              )
              const hasRecentIncidents = location.incidents.some(inc => {
                const incidentDate = new Date(inc.createdAt)
                const hoursAgo = (Date.now() - incidentDate.getTime()) / (1000 * 60 * 60)
                return hoursAgo < 24
              })

              return (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  eventHandlers={{
                    click: () => {
                      handleMarkerClick(location)
                    },
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <strong className="text-sm">{location.name}</strong>
                      <br />
                      <span className="text-xs text-gray-600">{location.address}</span>
                      <br />
                      <div className="mt-2 space-y-1">
                        <span className="text-xs text-gray-500">
                          {location.incidents.length} incidente(s)
                        </span>
                        {hasHighSeverity && (
                          <div className="text-xs text-red-600 font-medium">
                            ⚠ Alta severidad
                          </div>
                        )}
                        {hasRecentIncidents && (
                          <div className="text-xs text-amber-600 font-medium">
                            🕐 Reciente
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-blue-600 mt-1 block">
                        Click para ver detalles
                      </span>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>

      <IncidentSidebar
        location={selectedLocation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  )
}
