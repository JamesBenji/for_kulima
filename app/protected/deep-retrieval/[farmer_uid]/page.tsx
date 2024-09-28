'use client'
import FarmsFromFarmer from '@/components/shared/FarmsFromFarmer'
import React, { useMemo } from 'react'

export default function FarmsDataFromFarmerUID({params} : {params: {farmer_uid: number}}) {

    const farmer_uid = useMemo(() => params?.farmer_uid, [params])
  return (
    <div>page
        {String(params?.farmer_uid)}

        <FarmsFromFarmer farmer_uid={farmer_uid}/>
    </div>
    
  )
}
