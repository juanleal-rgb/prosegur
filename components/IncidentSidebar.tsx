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
      
      // Extract content from HTML - handle cases where HTML comes with <html> and <body> tags
      let htmlContent = incident.htmlReport
      
      // Remove markdown code blocks if present
      htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim()
      
      // Parse the HTML to extract styles and content
      // Create a temporary document to parse the HTML properly
      let styles = ''
      let contentToUse = ''
      
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror')
        if (parserError) {
          throw new Error('HTML parsing error')
        }
        
        // Extract styles from <head> or <style> tags
        const headStyles = doc.querySelectorAll('head style, style')
        headStyles.forEach(style => {
          if (style.textContent) {
            styles += style.textContent + '\n'
          }
        })
        
        // Try to extract body content, or use the whole document body
        const bodyElement = doc.querySelector('body')
        
        if (bodyElement && bodyElement.innerHTML.trim()) {
          contentToUse = bodyElement.innerHTML
        } else {
          // If no body tag, use the entire HTML content but remove html/head tags
          const htmlElement = doc.documentElement
          if (htmlElement) {
            // Remove head and style tags from content
            const clone = htmlElement.cloneNode(true) as HTMLElement
            const headToRemove = clone.querySelector('head')
            const stylesToRemove = clone.querySelectorAll('style')
            if (headToRemove) headToRemove.remove()
            stylesToRemove.forEach(s => s.remove())
            contentToUse = clone.innerHTML
          } else {
            contentToUse = htmlContent
          }
        }
      } catch (parseError) {
        // Fallback: use simple parsing
        console.warn('DOMParser failed, using fallback:', parseError)
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = htmlContent
        
        // Extract styles
        const styleElements = tempDiv.querySelectorAll('style')
        styleElements.forEach(style => {
          if (style.textContent) {
            styles += style.textContent + '\n'
          }
        })
        
        // Extract body or use all content
        const bodyElement = tempDiv.querySelector('body')
        if (bodyElement) {
          contentToUse = bodyElement.innerHTML
        } else {
          // Remove style tags from content
          const clone = tempDiv.cloneNode(true) as HTMLElement
          const stylesToRemove = clone.querySelectorAll('style')
          stylesToRemove.forEach(s => s.remove())
          contentToUse = clone.innerHTML || htmlContent
        }
      }
      
      // Ensure we have content
      if (!contentToUse || contentToUse.trim().length === 0) {
        contentToUse = htmlContent
      }
      
      // Create wrapper element for PDF generation
      const element = document.createElement('div')
      element.style.fontFamily = 'Arial, sans-serif'
      element.style.padding = '20px'
      element.style.backgroundColor = '#ffffff'
      element.style.color = '#000000'
      element.style.width = '210mm' // A4 width
      element.style.boxSizing = 'border-box'
      element.style.minHeight = '297mm' // A4 height
      
      // Build the complete HTML structure
      let finalHTML = ''
      if (styles) {
        finalHTML += `<style>${styles}</style>`
      }
      finalHTML += contentToUse
      
      element.innerHTML = finalHTML
      
      // Ensure all elements have proper visibility and colors
      const allElements = element.querySelectorAll('*')
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        htmlEl.style.visibility = 'visible'
        htmlEl.style.opacity = '1'
        
        // Ensure text is black if not specified
        const computedColor = window.getComputedStyle(htmlEl).color
        if (computedColor === 'rgba(0, 0, 0, 0)' || computedColor === 'transparent') {
          htmlEl.style.color = '#000000'
        }
      })
      
      // Ensure tables and other elements are visible
      const tables = element.querySelectorAll('table')
      tables.forEach(table => {
        const htmlTable = table as HTMLElement
        htmlTable.style.borderCollapse = 'collapse'
        htmlTable.style.width = '100%'
        htmlTable.style.marginTop = '20px'
      })
      
      const cells = element.querySelectorAll('th, td')
      cells.forEach(cell => {
        const htmlCell = cell as HTMLElement
        htmlCell.style.border = '1px solid #bdc3c7'
        htmlCell.style.padding = '12px'
        htmlCell.style.textAlign = 'left'
      })
      
      // Add to DOM temporarily (off-screen) to ensure proper rendering
      element.style.position = 'absolute'
      element.style.left = '-9999px'
      element.style.top = '0'
      element.style.zIndex = '-1'
      element.style.visibility = 'visible'
      element.style.display = 'block'
      document.body.appendChild(element)

      // Force a reflow to ensure rendering
      void element.offsetHeight

      // Wait for rendering and styles to apply, and for images to load
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Verify element has content
      if (!element.innerHTML || element.innerHTML.trim().length === 0) {
        throw new Error('El elemento está vacío después del renderizado')
      }
      
      // Log for debugging
      console.log('Generando PDF con contenido:', {
        hasContent: element.innerHTML.length > 0,
        elementHeight: element.scrollHeight,
        elementWidth: element.scrollWidth
      })

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `incidente-${incident.id}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true, // Enable logging to debug
          backgroundColor: '#ffffff',
          letterRendering: true,
          allowTaint: true,
          windowWidth: element.scrollWidth || 800,
          windowHeight: element.scrollHeight || 1200,
          onclone: (clonedDoc: any) => {
            // Ensure cloned document has proper styles
            const clonedElement = clonedDoc.body?.querySelector('div')
            if (clonedElement) {
              clonedElement.style.visibility = 'visible'
              clonedElement.style.opacity = '1'
              clonedElement.style.display = 'block'
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().set(opt).from(element).save()
      
      // Clean up
      if (document.body.contains(element)) {
        document.body.removeChild(element)
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
