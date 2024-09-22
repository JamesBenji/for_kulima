"use client";

import RequestAccountAccessButton from "@/components/client-rej-by-server/user-details/RequestAccountAccessButton";
import React from "react";

function ApplicantDetails() {
  const data: AccountApplicationData = {
    first_name: "Benjamin",
    last_name: "James",
    requestor_email: "np@gmail.com",
    phone_number: ["0764277121"],
    organization: "NEMA",
    position: "Senior administrator",
    gender: "Male",
    allocation: "Kampala",
    requested_position: 'parish_admin'
  };
  return (
    <div>
      <div>Apply for an account</div>
      <RequestAccountAccessButton data={data} />
    </div>
  );
}

export default ApplicantDetails;
