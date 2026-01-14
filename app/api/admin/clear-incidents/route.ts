import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Endpoint para borrar todos los incidentes (mantiene las ubicaciones)
export async function POST(request: NextRequest) {
  try {
    const deletedCount = await prisma.incident.deleteMany({})

    return NextResponse.json(
      {
        success: true,
        message: `Se eliminaron ${deletedCount.count} incidente(s)`,
        deletedCount: deletedCount.count,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting incidents:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// También permitir GET para verificar que el endpoint funciona
export async function GET() {
  try {
    const count = await prisma.incident.count()
    return NextResponse.json(
      {
        message: 'Endpoint funcionando correctamente',
        currentIncidents: count,
        usage: 'Usa POST para borrar todos los incidentes',
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
