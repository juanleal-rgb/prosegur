import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location_name, severity, category, summary, html_report } = body

    // Validate required fields
    if (!location_name || !severity || !summary || !html_report) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find location by name
    const location = await prisma.location.findFirst({
      where: {
        name: location_name,
      },
    })

    if (!location) {
      return NextResponse.json(
        { error: `Location "${location_name}" not found` },
        { status: 404 }
      )
    }

    // Create incident
    const incident = await prisma.incident.create({
      data: {
        summary,
        severity,
        htmlReport: html_report,
        locationId: location.id,
      },
      include: {
        location: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        incident: {
          id: incident.id,
          createdAt: incident.createdAt,
          summary: incident.summary,
          severity: incident.severity,
          location: {
            name: incident.location.name,
            address: incident.location.address,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
