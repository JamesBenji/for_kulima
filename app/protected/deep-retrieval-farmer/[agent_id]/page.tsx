'use client'
import FarmersFromAgents from '@/components/shared/FarmersFromAgents'
import React, { useMemo } from 'react'

export default function FarmerFromAgent({params} : {params: {agent_id: string}}) {

    const agent_id = useMemo(() => params?.agent_id, [params])
  return (
    <div>page
        {String(params?.agent_id)}

        <FarmersFromAgents email={agent_id}/>
    </div>
    
  )
}
