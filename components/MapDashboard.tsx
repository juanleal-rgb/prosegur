'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import IncidentSidebar from './IncidentSidebar'
import { cn } from '@/lib/utils'
import { MapPin, AlertTriangle, Activity, Shield, Satellite, Map as MapIcon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

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

type MapStyle = 'satellite' | 'streets' | 'dark' | 'light'

export default function MapDashboard() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mapStyle, setMapStyle] = useState<MapStyle>('satellite')
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const mapRef = useRef<MapRef>(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetchLocations()
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

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true)
  }, [])

  // Map style URLs based on selection
  const getMapStyle = (): string => {
    switch (mapStyle) {
      case 'satellite':
        return 'mapbox://styles/mapbox/satellite-streets-v12'
      case 'streets':
        return 'mapbox://styles/mapbox/streets-v12'
      case 'dark':
        return 'mapbox://styles/mapbox/dark-v11'
      case 'light':
        return 'mapbox://styles/mapbox/light-v11'
      default:
        return 'mapbox://styles/mapbox/satellite-streets-v12'
    }
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
  const center: [number, number] = [-3.7038, 40.4168] // [lng, lat] for Mapbox

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
            <div className="rounded-full p-1.5 bg-[var(--prosegur-primary)]/10 text-[var(--prosegur-primary)]">
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
        <div className="h-full w-full rounded-xl overflow-hidden border border-[var(--prosegur-border)] shadow-xl relative">
          {/* Map Style Toggle */}
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
            <div className="backdrop-blur-lg bg-black/70 dark:bg-black/80 border border-zinc-700 rounded-lg p-1 flex flex-col gap-1">
              <button
                onClick={() => setMapStyle('satellite')}
                className={cn(
                  "p-2 rounded transition-all",
                  mapStyle === 'satellite'
                    ? "bg-[var(--prosegur-primary)] text-[var(--prosegur-text-on-yellow)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                )}
                title="Vista Satélite"
              >
                <Satellite className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMapStyle('streets')}
                className={cn(
                  "p-2 rounded transition-all",
                  mapStyle === 'streets'
                    ? "bg-[var(--prosegur-primary)] text-[var(--prosegur-text-on-yellow)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                )}
                title="Vista Calles"
              >
                <MapIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMapStyle(theme === 'dark' ? 'dark' : 'light')}
                className={cn(
                  "p-2 rounded transition-all",
                  (mapStyle === 'dark' || mapStyle === 'light')
                    ? "bg-[var(--prosegur-primary)] text-[var(--prosegur-text-on-yellow)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                )}
                title={theme === 'dark' ? 'Vista Oscura' : 'Vista Clara'}
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: center[0],
                latitude: center[1],
                zoom: 13,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={getMapStyle()}
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              onLoad={handleMapLoad}
              attributionControl={false}
              reuseMaps
            >
              {locations.map((location) => {
                const hasHighSeverity = location.incidents.some(
                  inc => inc.severity.toLowerCase() === 'high'
                )
                const hasRecentIncidents = location.incidents.some(inc => {
                  const incidentDate = new Date(inc.createdAt)
                  const hoursAgo = (Date.now() - incidentDate.getTime()) / (1000 * 60 * 60)
                  return hoursAgo < 24
                })
                const incidentCount = location.incidents.length

                return (
          <Marker
            key={location.id}
                    longitude={location.lng}
                    latitude={location.lat}
                    anchor="bottom"
                  >
                    <div className="relative group cursor-pointer" onClick={() => handleMarkerClick(location)}>
                      {/* Radar ping effect for high severity or recent incidents */}
                      {(hasHighSeverity || hasRecentIncidents) && (
                        <>
                          <div
                            className={cn(
                              "absolute rounded-full border-2 pointer-events-none",
                              hasHighSeverity ? "border-red-500" : "border-amber-500"
                            )}
                            style={{
                              width: '60px',
                              height: '60px',
                              top: '-18px',
                              left: '-18px',
                              animation: 'radar-ping 3s ease-out infinite',
                            }}
                          />
                          <div
                            className={cn(
                              "absolute rounded-full border-2 pointer-events-none",
                              hasHighSeverity ? "border-red-500" : "border-amber-500"
                            )}
                            style={{
                              width: '60px',
                              height: '60px',
                              top: '-18px',
                              left: '-18px',
                              animation: 'radar-ping 3s ease-out infinite 1s',
                            }}
                          />
                        </>
                      )}

                      {/* Custom marker */}
                      <div
                        className={cn(
                          "relative flex items-center justify-center rounded-full border-2 shadow-xl transition-all hover:scale-110",
                          hasHighSeverity
                            ? "bg-red-500 border-red-400 text-white"
                            : hasRecentIncidents
                              ? "bg-amber-500 border-amber-400 text-white"
                              : "bg-[var(--prosegur-primary)] border-[var(--prosegur-primary-dark)] text-[var(--prosegur-text-on-yellow)]"
                        )}
                        style={{ width: '32px', height: '32px' }}
                      >
                        <MapPin className="h-4 w-4" />
                        {incidentCount > 0 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                            {incidentCount}
                          </div>
                        )}
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        <div className="backdrop-blur-lg bg-black/90 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono shadow-xl min-w-[200px]">
                          <div className="font-semibold text-white">{location.name}</div>
                          <div className="text-zinc-400 text-[10px] mt-1">{location.address}</div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-700">
                            <span className="text-zinc-500 text-[10px]">
                              {incidentCount} incidente{incidentCount !== 1 ? 's' : ''}
                            </span>
                            {hasHighSeverity && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-300">
                                ALTA
                </span>
                            )}
                            {hasRecentIncidents && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300">
                                RECIENTE
                </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Marker>
                )
              })}
            </Map>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-zinc-900/50">
              <div className="text-center space-y-2">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                <p className="text-zinc-400 font-mono text-sm">
                  MAPBOX_TOKEN no configurado
                </p>
                <p className="text-zinc-500 font-mono text-xs">
                  Agrega NEXT_PUBLIC_MAPBOX_TOKEN a tu .env
                </p>
              </div>
            </div>
          )}
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
