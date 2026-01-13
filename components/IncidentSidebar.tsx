'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, AlertCircle, Clock } from 'lucide-react'

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

interface IncidentSidebarProps {
  location: Location | null
  isOpen: boolean
  onClose: () => void
}

export default function IncidentSidebar({
  location,
  isOpen,
  onClose,
}: IncidentSidebarProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    console.log('IncidentSidebar - isOpen:', isOpen, 'location:', location)
    if (location) {
      // Sort incidents by most recent first
      const sorted = [...location.incidents].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setIncidents(sorted)
      console.log('Incidents sorted:', sorted.length)
    }
  }, [location, isOpen])

  const handleDownloadPDF = async (incident: Incident) => {
    try {
      // Dynamically import html2pdf.js (client-side only)
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = document.createElement('div')
      element.innerHTML = incident.htmlReport

      const opt = {
        margin: 1,
        filename: `incident-${incident.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      }

      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const latestIncident = incidents[0]

  return (
    <Dialog open={isOpen && !!location} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{location.name}</DialogTitle>
          <DialogDescription className="text-base">
            {location.address}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Latest Incident Summary */}
          {latestIncident && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Resumencillo</h3>
              </div>
              <p className="text-blue-800">{latestIncident.summary}</p>
            </div>
          )}

          {/* Incident History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Incident History</h3>
            {incidents.length === 0 ? (
              <p className="text-muted-foreground">No incidents recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(incident.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{incident.summary}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(incident)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
