import dynamic from 'next/dynamic'

const MapDashboard = dynamic(() => import('@/components/MapDashboard'), {
  ssr: false,
})

export default function Home() {
  return <MapDashboard />
}
