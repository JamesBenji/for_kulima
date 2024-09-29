'use client'
import ParishAdminFromDistrictAdmin from '@/components/shared/ParishAdminFromDistrictAdmin'
import React, { useMemo } from 'react'

export default function ParishFromDistrictEmail({params} : {params: {district_email: string}}) {

    const district_email = useMemo(() => params?.district_email, [params])
  return (
    <div>
        <ParishAdminFromDistrictAdmin email={district_email}/>
    </div>
    
  )
}
