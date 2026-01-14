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
    console.log('[PDF Download] ========== PDF DOWNLOAD INITIATED ==========')
    console.log('[PDF Download] Step 1: Starting PDF generation for incident:', incident.id)
    console.log('[PDF Download] Incident data:', {
      id: incident.id,
      createdAt: incident.createdAt,
      severity: incident.severity,
      summaryLength: incident.summary?.length || 0,
      htmlReportLength: incident.htmlReport?.length || 0
    })
    
    try {
      // Dynamically import html2pdf.js (client-side only)
      console.log('[PDF Download] Step 2: Importing html2pdf.js library')
      const html2pdf = (await import('html2pdf.js')).default
      console.log('[PDF Download] html2pdf.js imported successfully')
      
      // Extract content from HTML - handle cases where HTML comes with <html> and <body> tags
      let htmlContent = incident.htmlReport
      console.log('[PDF Download] Step 3: Extracted htmlReport from incident')
      console.log('[PDF Download] Original HTML content length:', htmlContent.length)
      console.log('[PDF Download] Original HTML preview (first 500 chars):', htmlContent.substring(0, 500))
      console.log('[PDF Download] Original HTML ends with:', htmlContent.substring(Math.max(0, htmlContent.length - 100)))
      
      // Check if it's a full HTML document
      const isFullHTML = htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html>')
      console.log('[PDF Download] Is full HTML document:', isFullHTML)
      
      // Remove markdown code blocks if present
      console.log('[PDF Download] Step 4: Cleaning HTML (removing markdown blocks if present)')
      const beforeClean = htmlContent.length
      htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim()
      console.log('[PDF Download] After cleaning - length:', htmlContent.length, '(was:', beforeClean, ')')
      
      // Parse the HTML to extract styles and content
      // Use iframe approach for better HTML rendering
      console.log('[PDF Download] Step 5: Parsing HTML with DOMParser')
      let styles = ''
      let contentToUse = ''
      
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        console.log('[PDF Download] DOMParser created, document parsed')
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror')
        if (parserError) {
          console.log('[PDF Download] ERROR: HTML parsing error detected')
          console.log('[PDF Download] Parser error:', parserError.textContent)
          throw new Error('HTML parsing error')
        }
        console.log('[PDF Download] HTML parsing successful, no errors')
        
        // Extract styles from <head> or <style> tags
        console.log('[PDF Download] Step 6: Extracting styles from HTML')
        const headStyles = doc.querySelectorAll('head style, style')
        console.log('[PDF Download] Found', headStyles.length, 'style tags')
        headStyles.forEach((style, index) => {
          if (style.textContent) {
            styles += style.textContent + '\n'
            console.log(`[PDF Download] Style ${index + 1} extracted, length:`, style.textContent.length)
          }
        })
        console.log('[PDF Download] Total styles length:', styles.length)
        
        // Try to extract body content
        console.log('[PDF Download] Step 7: Extracting body content')
        const bodyElement = doc.querySelector('body')
        
        if (bodyElement) {
          // Get all body children as HTML
          const bodyChildren = Array.from(bodyElement.children)
          console.log('[PDF Download] Body has', bodyChildren.length, 'direct children')
          console.log('[PDF Download] Body children:', bodyChildren.map(el => el.tagName).join(', '))
          
          // Always use innerHTML for body content
          contentToUse = bodyElement.innerHTML
          console.log('[PDF Download] Body content extracted from innerHTML, length:', contentToUse.length)
          console.log('[PDF Download] Body innerHTML preview (first 300 chars):', contentToUse.substring(0, 300))
          
          // Verify body has actual content
          const bodyText = bodyElement.textContent || ''
          console.log('[PDF Download] Body textContent length:', bodyText.length)
          console.log('[PDF Download] Body textContent preview:', bodyText.substring(0, 300))
          
          if (bodyText.trim().length === 0) {
            console.warn('[PDF Download] WARNING: Body has no text content!')
            console.warn('[PDF Download] Body innerHTML:', bodyElement.innerHTML.substring(0, 500))
          }
          
          if (contentToUse.trim().length === 0) {
            console.error('[PDF Download] ERROR: Body innerHTML is empty!')
          }
        } else {
          console.log('[PDF Download] No body element found, trying documentElement')
          // If no body tag, try to get content from documentElement
          const htmlElement = doc.documentElement
          if (htmlElement) {
            // Get body from htmlElement
            const bodyInHtml = htmlElement.querySelector('body')
            if (bodyInHtml) {
              contentToUse = bodyInHtml.innerHTML
              console.log('[PDF Download] Body found in htmlElement, content length:', contentToUse.length)
            } else {
              // Last resort: use all content but remove head
              const clone = htmlElement.cloneNode(true) as HTMLElement
              const headToRemove = clone.querySelector('head')
              if (headToRemove) headToRemove.remove()
              contentToUse = clone.innerHTML
              console.log('[PDF Download] Content extracted from htmlElement (no body), length:', contentToUse.length)
            }
          } else {
            contentToUse = htmlContent
            console.log('[PDF Download] Using original htmlContent as fallback, length:', contentToUse.length)
          }
        }
      } catch (parseError) {
        // Fallback: use simple parsing
        console.warn('[PDF Download] DOMParser failed, using fallback:', parseError)
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = htmlContent
        
        // Extract styles
        const styleElements = tempDiv.querySelectorAll('style')
        styleElements.forEach(style => {
          if (style.textContent) {
            styles += style.textContent + '\n'
          }
        })
        console.log('[PDF Download] Fallback: extracted', styles.length, 'chars of styles')
        
        // Extract body or use all content
        const bodyElement = tempDiv.querySelector('body')
        if (bodyElement) {
          contentToUse = bodyElement.innerHTML
          console.log('[PDF Download] Fallback: body content length:', contentToUse.length)
        } else {
          // Remove style tags from content
          const clone = tempDiv.cloneNode(true) as HTMLElement
          const stylesToRemove = clone.querySelectorAll('style')
          stylesToRemove.forEach(s => s.remove())
          contentToUse = clone.innerHTML || htmlContent
          console.log('[PDF Download] Fallback: using clone content, length:', contentToUse.length)
        }
      }
      
      // Ensure we have content
      if (!contentToUse || contentToUse.trim().length === 0) {
        console.error('[PDF Download] ERROR: contentToUse is empty! Using original htmlContent')
        contentToUse = htmlContent
      }
      
      console.log('[PDF Download] Final contentToUse length:', contentToUse.length)
      console.log('[PDF Download] Final contentToUse preview:', contentToUse.substring(0, 500))
      console.log('[PDF Download] Step 8: Final content to use, length:', contentToUse.length)
      console.log('[PDF Download] Final styles length:', styles.length)
      
      // Create wrapper element for PDF generation
      console.log('[PDF Download] Step 9: Creating wrapper element for PDF')
      const element = document.createElement('div')
      element.style.fontFamily = 'Arial, sans-serif'
      element.style.padding = '20px'
      element.style.backgroundColor = '#ffffff'
      element.style.color = '#000000'
      element.style.width = '210mm' // A4 width
      element.style.boxSizing = 'border-box'
      element.style.minHeight = '297mm' // A4 height
      
      // Build the complete HTML structure
      console.log('[PDF Download] Step 10: Building final HTML structure')
      let finalHTML = ''
      
      // Always include styles if we have them
      if (styles && styles.trim().length > 0) {
        finalHTML += `<style>${styles}</style>`
        console.log('[PDF Download] Added styles to finalHTML, styles length:', styles.length)
      } else {
        console.warn('[PDF Download] WARNING: No styles extracted! HTML might not render correctly.')
      }
      
      // Ensure we have content
      if (!contentToUse || contentToUse.trim().length === 0) {
        console.error('[PDF Download] ERROR: contentToUse is empty! Using original HTML')
        // Try to extract body from original HTML as last resort
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = htmlContent
        const bodyEl = tempDiv.querySelector('body')
        contentToUse = bodyEl ? bodyEl.innerHTML : htmlContent
        console.log('[PDF Download] Fallback contentToUse length:', contentToUse.length)
      }
      
      finalHTML += contentToUse
      console.log('[PDF Download] Final HTML length:', finalHTML.length)
      console.log('[PDF Download] Final HTML preview (first 500 chars):', finalHTML.substring(0, 500))
      console.log('[PDF Download] Final HTML preview (last 200 chars):', finalHTML.substring(Math.max(0, finalHTML.length - 200)))
      
      // Set innerHTML
      element.innerHTML = finalHTML
      console.log('[PDF Download] Element innerHTML set')
      console.log('[PDF Download] Element children count:', element.children.length)
      console.log('[PDF Download] Element textContent length:', element.textContent?.length || 0)
      console.log('[PDF Download] Element textContent preview:', element.textContent?.substring(0, 200))
      
      // Verify we have actual DOM elements
      const allElementsCheck = element.querySelectorAll('*')
      console.log('[PDF Download] Total DOM elements in element:', allElementsCheck.length)
      const textElements = element.querySelectorAll('p, h1, h2, h3, td, th, div')
      console.log('[PDF Download] Text-containing elements:', textElements.length)
      
      // Ensure all elements have proper visibility and colors
      console.log('[PDF Download] Step 11: Applying visibility and color styles to all elements')
      const allElements = element.querySelectorAll('*')
      console.log('[PDF Download] Found', allElements.length, 'elements to style')
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
      console.log('[PDF Download] All elements styled')
      
      // Ensure tables and other elements are visible
      console.log('[PDF Download] Step 12: Styling tables and cells')
      const tables = element.querySelectorAll('table')
      console.log('[PDF Download] Found', tables.length, 'tables')
      tables.forEach((table, index) => {
        const htmlTable = table as HTMLElement
        htmlTable.style.borderCollapse = 'collapse'
        htmlTable.style.width = '100%'
        htmlTable.style.marginTop = '20px'
        console.log(`[PDF Download] Table ${index + 1} styled`)
      })
      
      const cells = element.querySelectorAll('th, td')
      console.log('[PDF Download] Found', cells.length, 'cells')
      cells.forEach(cell => {
        const htmlCell = cell as HTMLElement
        htmlCell.style.border = '1px solid #bdc3c7'
        htmlCell.style.padding = '12px'
        htmlCell.style.textAlign = 'left'
      })
      console.log('[PDF Download] All cells styled')
      
      // Add to DOM temporarily (off-screen) to ensure proper rendering
      console.log('[PDF Download] Step 13: Adding element to DOM (off-screen)')
      // Use absolute positioning off-screen but ensure it has dimensions
      element.style.position = 'absolute'
      element.style.left = '-9999px'
      element.style.top = '0'
      element.style.width = '210mm'
      element.style.maxWidth = '210mm'
      element.style.height = 'auto'
      element.style.minHeight = '297mm'
      element.style.zIndex = '9999'
      element.style.visibility = 'visible'
      element.style.display = 'block'
      element.style.overflow = 'visible'
      element.style.opacity = '1' // Full opacity for proper rendering
      element.style.pointerEvents = 'none'
      document.body.appendChild(element)
      console.log('[PDF Download] Element added to DOM with absolute positioning')

      // Force multiple reflows to ensure rendering
      console.log('[PDF Download] Step 14: Forcing reflow')
      void element.offsetHeight
      void element.scrollHeight
      void element.clientHeight
      
      // Wait a bit for initial render
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Force another reflow
      void element.offsetHeight
      
      console.log('[PDF Download] Initial reflow complete, element dimensions:', {
        offsetHeight: element.offsetHeight,
        offsetWidth: element.offsetWidth,
        scrollHeight: element.scrollHeight,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth
      })
      
      // Check if element has height
      if (element.offsetHeight === 0 || element.scrollHeight === 0) {
        console.warn('[PDF Download] WARNING: Element has zero height! Trying to fix...')
        // Force explicit height
        const computedHeight = element.scrollHeight || 1123
        element.style.height = `${computedHeight}px`
        element.style.minHeight = `${computedHeight}px`
        console.log('[PDF Download] Set explicit height to:', computedHeight)
        // Force another reflow
        void element.offsetHeight
      }

      // Wait for rendering and styles to apply, and for images to load
      console.log('[PDF Download] Step 15: Waiting 1500ms for rendering and styles to apply')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Force final reflow after wait
      void element.offsetHeight
      void element.scrollHeight
      
      console.log('[PDF Download] Wait complete, final dimensions:', {
        scrollHeight: element.scrollHeight,
        scrollWidth: element.scrollWidth,
        offsetHeight: element.offsetHeight,
        offsetWidth: element.offsetWidth,
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
        computedStyle: {
          height: window.getComputedStyle(element).height,
          width: window.getComputedStyle(element).width,
          display: window.getComputedStyle(element).display,
          visibility: window.getComputedStyle(element).visibility
        }
      })
      
      // Final check - element MUST have height
      if (element.offsetHeight === 0 || element.scrollHeight === 0) {
        console.error('[PDF Download] ERROR: Element still has zero height after all attempts!')
        console.error('[PDF Download] Element innerHTML length:', element.innerHTML.length)
        console.error('[PDF Download] Element children:', element.children.length)
        throw new Error('Element has zero height and cannot be rendered to PDF')
      }
      
      // Verify element has content
      if (!element.innerHTML || element.innerHTML.trim().length === 0) {
        console.error('[PDF Download] ERROR: Element is empty after rendering!')
        console.error('[PDF Download] Element innerHTML:', element.innerHTML)
        throw new Error('El elemento está vacío después del renderizado')
      }
      
      // Check if element has visible text
      const textContent = element.textContent || ''
      if (textContent.trim().length === 0) {
        console.error('[PDF Download] ERROR: Element has no text content!')
        console.error('[PDF Download] Element innerHTML length:', element.innerHTML.length)
        console.error('[PDF Download] Element innerHTML:', element.innerHTML.substring(0, 500))
        throw new Error('El elemento no tiene contenido de texto visible')
      }
      
      // Log for debugging
      console.log('[PDF Download] Step 16: Element ready for PDF generation')
      console.log('[PDF Download] Element content check:', {
        hasContent: element.innerHTML.length > 0,
        innerHTMLLength: element.innerHTML.length,
        textContentLength: textContent.length,
        textContentPreview: textContent.substring(0, 200),
        elementHeight: element.scrollHeight,
        elementWidth: element.scrollWidth,
        childrenCount: element.children.length,
        hasTables: element.querySelectorAll('table').length,
        hasParagraphs: element.querySelectorAll('p').length
      })

      const filename = `incidente-${incident.id}-${new Date().toISOString().split('T')[0]}.pdf`
      console.log('[PDF Download] Step 17: Configuring PDF options')
      console.log('[PDF Download] PDF filename:', filename)
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true, // Enable logging to debug
          backgroundColor: '#ffffff',
          letterRendering: true,
          allowTaint: true,
          windowWidth: Math.max(element.scrollWidth, element.offsetWidth, 794),
          windowHeight: Math.max(element.scrollHeight, element.offsetHeight, 1123),
          onclone: (clonedDoc: any, element: HTMLElement) => {
            console.log('[PDF Download] html2canvas onclone callback triggered')
            console.log('[PDF Download] Original element:', element)
            console.log('[PDF Download] Original element dimensions:', {
              offsetHeight: element.offsetHeight,
              offsetWidth: element.offsetWidth,
              scrollHeight: element.scrollHeight,
              scrollWidth: element.scrollWidth
            })
            
            // Find the cloned element in the cloned document
            // html2canvas passes the original element, we need to find its clone
            const clonedBody = clonedDoc.body
            console.log('[PDF Download] Cloned body:', clonedBody)
            
            // Try to find the element by its position or attributes
            // Since the element is the last child added to body, try to get it
            const allDivs = clonedBody?.querySelectorAll('div') || []
            console.log('[PDF Download] All divs in cloned body:', allDivs.length)
            
            // Find the div that matches our element's characteristics
            let clonedElement: HTMLElement | null = null
            for (let i = 0; i < allDivs.length; i++) {
              const div = allDivs[i] as HTMLElement
              // Check if this div has our content (has style tag and our content)
              if (div.innerHTML.includes('Informe de Incidencia de Seguridad') || 
                  div.innerHTML.includes('severity-high')) {
                clonedElement = div
                console.log('[PDF Download] Found cloned element at index:', i)
                break
              }
            }
            
            // If not found, try the last div (most likely our element)
            if (!clonedElement && allDivs.length > 0) {
              clonedElement = allDivs[allDivs.length - 1] as HTMLElement
              console.log('[PDF Download] Using last div as cloned element')
            }
            
            if (clonedElement) {
              console.log('[PDF Download] Cloned element found, original dimensions:', {
                offsetHeight: clonedElement.offsetHeight,
                offsetWidth: clonedElement.offsetWidth,
                scrollHeight: clonedElement.scrollHeight,
                scrollWidth: clonedElement.scrollWidth,
                clientHeight: clonedElement.clientHeight,
                clientWidth: clonedElement.clientWidth
              })
              
              // Force explicit dimensions on cloned element
              const originalHeight = element.scrollHeight || element.offsetHeight || 1123
              const originalWidth = element.scrollWidth || element.offsetWidth || 794
              
              clonedElement.style.visibility = 'visible'
              clonedElement.style.opacity = '1'
              clonedElement.style.display = 'block'
              clonedElement.style.position = 'absolute'
              clonedElement.style.left = '0'
              clonedElement.style.top = '0'
              clonedElement.style.width = `${originalWidth}px`
              clonedElement.style.height = `${originalHeight}px`
              clonedElement.style.minHeight = `${originalHeight}px`
              clonedElement.style.maxHeight = `${originalHeight}px`
              clonedElement.style.overflow = 'visible'
              
              console.log('[PDF Download] Cloned element styled with explicit dimensions:', {
                width: `${originalWidth}px`,
                height: `${originalHeight}px`
              })
              
              // Force a reflow on the cloned element
              void clonedElement.offsetHeight
              
              console.log('[PDF Download] Cloned element after styling:', {
                offsetHeight: clonedElement.offsetHeight,
                offsetWidth: clonedElement.offsetWidth,
                scrollHeight: clonedElement.scrollHeight,
                scrollWidth: clonedElement.scrollWidth,
                innerHTML: clonedElement.innerHTML.length,
                textContent: clonedElement.textContent?.length || 0
              })
            } else {
              console.error('[PDF Download] ERROR: Cloned element not found in onclone!')
              console.error('[PDF Download] Cloned body innerHTML length:', clonedBody?.innerHTML?.length || 0)
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      console.log('[PDF Download] PDF options configured:', {
        filename,
        windowWidth: opt.html2canvas.windowWidth,
        windowHeight: opt.html2canvas.windowHeight
      })

      console.log('[PDF Download] Step 18: Starting PDF generation with html2pdf')
      await html2pdf().set(opt).from(element).save()
      console.log('[PDF Download] Step 19: PDF generation complete!')
      console.log('[PDF Download] ========== PDF DOWNLOAD SUCCESSFUL ==========')
      
      // Clean up
      console.log('[PDF Download] Step 20: Cleaning up DOM element')
      if (document.body.contains(element)) {
        document.body.removeChild(element)
        console.log('[PDF Download] Element removed from DOM')
      }
    } catch (error) {
      console.error('[PDF Download] ========== PDF GENERATION ERROR ==========')
      console.error('[PDF Download] Error details:', error)
      console.error('[PDF Download] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
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
