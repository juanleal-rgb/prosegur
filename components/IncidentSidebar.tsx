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
import { Download, AlertCircle, Clock, MapPin, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    if (location) {
      // Sort incidents by most recent first
      const sorted = [...location.incidents].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setIncidents(sorted)
    }
  }, [location, isOpen])

  const handleDownloadPDF = async (incident: Incident) => {
    try {
      // Dynamically import html2pdf.js (client-side only)
      const html2pdf = (await import('html2pdf.js')).default
      
      // Create a clean wrapper with explicit styles
      const wrapper = document.createElement('div')
      wrapper.id = 'pdf-wrapper-temp'
      
      // Set explicit styles for PDF generation
      Object.assign(wrapper.style, {
        width: '794px', // A4 width in pixels at 96 DPI
        minHeight: '1123px', // A4 height in pixels
        padding: '40px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        backgroundColor: '#ffffff',
        color: '#000000',
        boxSizing: 'border-box',
        position: 'absolute',
        left: '-9999px',
        top: '0',
        zIndex: '-1',
        visibility: 'visible',
        opacity: '1',
      })
      
      // Set the HTML content
      wrapper.innerHTML = incident.htmlReport
      
      // Force all elements to be visible and have proper colors
      const allElements = wrapper.querySelectorAll('*')
      allElements.forEach((el: Element) => {
        const htmlEl = el as HTMLElement
        
        // Force text color for text elements
        const textElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'TD', 'TH', 'LI', 'DIV', 'STRONG', 'B', 'EM', 'I']
        if (textElements.includes(htmlEl.tagName)) {
          const computedColor = window.getComputedStyle(htmlEl).color
          if (!computedColor || computedColor === 'transparent' || computedColor === 'rgba(0, 0, 0, 0)') {
            htmlEl.style.color = '#000000'
          }
        }
        
        // Ensure visibility
        htmlEl.style.visibility = 'visible'
        htmlEl.style.opacity = '1'
        htmlEl.style.display = htmlEl.style.display || ''
        
        // Fix table borders
        if (htmlEl.tagName === 'TD' || htmlEl.tagName === 'TH') {
          const border = htmlEl.style.border || window.getComputedStyle(htmlEl).border
          if (!border || border === 'none' || border === '0px') {
            htmlEl.style.border = '1px solid #000000'
          }
        }
      })
      
      // Add to DOM
      document.body.appendChild(wrapper)
      
      // Force layout recalculation
      void wrapper.offsetHeight
      void wrapper.scrollHeight
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300))

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `incidente-${incident.id}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          letterRendering: true,
          allowTaint: false,
          removeContainer: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      await html2pdf().set(opt).from(wrapper).save()
      
      // Clean up
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar PDF. Por favor, inténtalo de nuevo.')
    }
  }

  const getSeverityConfig = (severity: string) => {
    const severityLower = severity.toLowerCase()
    switch (severityLower) {
      case 'high':
        return {
          bg: 'bg-[var(--status-error-bg)]',
          text: 'text-[var(--status-error-text)]',
          border: 'border-[var(--status-error-border)]',
          dot: 'bg-red-500',
          label: 'Alta',
        }
      case 'medium':
        return {
          bg: 'bg-[var(--status-warn-bg)]',
          text: 'text-[var(--status-warn-text)]',
          border: 'border-[var(--status-warn-border)]',
          dot: 'bg-amber-500',
          label: 'Media',
        }
      case 'low':
        return {
          bg: 'bg-[var(--status-success-bg)]',
          text: 'text-[var(--status-success-text)]',
          border: 'border-[var(--status-success-border)]',
          dot: 'bg-emerald-500',
          label: 'Baja',
        }
      default:
        return {
          bg: 'bg-zinc-100 dark:bg-zinc-800',
          text: 'text-zinc-600 dark:text-zinc-400',
          border: 'border-zinc-300 dark:border-zinc-700',
          dot: 'bg-zinc-500',
          label: severity,
        }
    }
  }

  const latestIncident = incidents[0]

  if (!location) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-[var(--prosegur-primary)]/20 dark:bg-[var(--prosegur-primary)]/30 p-3">
              <MapPin className="h-6 w-6 text-[var(--prosegur-accent)] dark:text-[var(--prosegur-primary)]" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {location.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-1 text-zinc-600 dark:text-zinc-400">
                {location.address}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Latest Incident Summary */}
          {latestIncident && (
            <div
              className={cn(
                "rounded-xl p-5 border-2",
                getSeverityConfig(latestIncident.severity).bg,
                getSeverityConfig(latestIncident.severity).border
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-white/50 dark:bg-black/20 p-2">
                  <AlertCircle
                    className={cn(
                      "h-5 w-5",
                      getSeverityConfig(latestIncident.severity).text
                    )}
                  />
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm uppercase tracking-wide", getSeverityConfig(latestIncident.severity).text)}>
                    Último Incidente
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium border",
                        getSeverityConfig(latestIncident.severity).bg,
                        getSeverityConfig(latestIncident.severity).text,
                        getSeverityConfig(latestIncident.severity).border
                      )}
                    >
                      {getSeverityConfig(latestIncident.severity).label}
                    </span>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(latestIncident.createdAt).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className={cn("text-sm leading-relaxed", getSeverityConfig(latestIncident.severity).text)}>
                {latestIncident.summary}
              </p>
            </div>
          )}

          {/* Incident History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Historial de Incidentes
              </h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                ({incidents.length})
              </span>
            </div>
            {incidents.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[var(--prosegur-border)] rounded-lg">
                <AlertCircle className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-muted-foreground">No hay incidentes registrados aún.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => {
                  const severityConfig = getSeverityConfig(incident.severity)
                  return (
                    <div
                      key={incident.id}
                      className={cn(
                        "border rounded-xl p-4 space-y-3 transition-all hover:shadow-md",
                        "bg-[var(--prosegur-card)] border-[var(--prosegur-border)]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5",
                                severityConfig.bg,
                                severityConfig.text,
                                severityConfig.border
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", severityConfig.dot)} />
                              {severityConfig.label}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(incident.createdAt).toLocaleString('es-ES')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {incident.summary}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(incident)}
                        className="w-full border-[var(--prosegur-border)] hover:bg-[var(--prosegur-surface)]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Reporte PDF
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
