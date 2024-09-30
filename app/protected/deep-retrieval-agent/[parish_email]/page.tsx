"use client";
import FieldAgentsFromParishAdmin from "@/components/shared/FieldAgentsFromParishAdmin";
import React, { useMemo } from "react";

export default function AgentFromParishEmail({
  params,
}: {
  params: { parish_email: string };
}) {
  const district_email = useMemo(() => params?.parish_email, [params]);
  return (
    <div>
      <FieldAgentsFromParishAdmin email={district_email} />
    </div>
  );
}
