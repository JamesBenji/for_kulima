import ApplicantForm from "@/components/ApplicantForm";
import { hasRequestedRole } from "@/lib/request-account/functions";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function ApplicantDetails() {
  // const data: AccountApplicationData = {
  //   first_name: "Benjamin",
  //   last_name: "James",
  //   requestor_email: "johnduran@gmail.com",
  //   phone_number: ["0764277121"],
  //   organization: "NEMA",
  //   position: "Senior administrator",
  //   gender: "Male",
  //   allocation: "Kampala",
  //   requested_position: "parish_admin",
  // };

  // check if applied
  const supabase = createClient();


  const {
    data: { user },
  } = await supabase.auth.getUser();

  const applicant = await hasRequestedRole(supabase, user?.email!);

  if (applicant) {
    return (
      <div className="max-w-prose m-auto">
        {applicant && (
          <h1>
            You already made an application for access as{" "}
            {applicant.requested_position === "district_admin"
              ? "district administrator"
              : "parish administrator"}
            . Please wait for your account to be activated upon review. If the
            account is not activated within 7 days from application, please
            contact the{" "}
            {applicant.requested_position === "district_admin"
              ? "Head of this project at the Ministry of ..."
              : "District administrator for your district."}
          </h1>
        )}
      </div>
    );
  }

  /**
   * upload client image
   * send formData to server /register-access-request
   *
   */

  return <ApplicantForm />;
}

export default ApplicantDetails;
