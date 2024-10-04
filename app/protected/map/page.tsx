import React from 'react'

import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/components/map/MapPage'),
  { ssr: false }
)
 
export default function Page() {
  return (
    <div className='w-full'>
      <DynamicComponentWithNoSSR />
    </div>
  )
}

