import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TableOfContents } from "lucide-react";

type ParishAdminFromDistrictAdminProps = {
  email: string;
};

export default function FarmersFromAgents({
  email,
}: ParishAdminFromDistrictAdminProps) {
  const [farms, setFarms] = useState<FarmerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch("/api/show-farmers-from-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farms");
        }

        const data = await response.json();
        // console.log({ FarmsFromFarmerError: error });

        setFarms(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* {farms.length > 0 &&
        farms?.map((farm, index) => ( */}
      <Card className="mx-auto flex flex-col align-middle justify-center">
        <CardHeader>
          <CardTitle className="max-w-prose mx-auto">
            Farmers added by this user ({farms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {farms
            ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
            .map((request) => (
              <div key={request?.tel?.[0]}>
                <div className="flex flex-row justify-between w-fit max-w-prose mx-auto p-3 mt-1">
                  <div className="flex-1 flex flex-col md:flex-row justify-evenly">
                    {/* requestor name and requested position */}
                    <div className="flex-1 py-1 px-2">
                      <h1 className="font-semibold tracking-normal text-lg">
                        {request?.first_name} {request?.last_name}
                      </h1>
                      <h2 className="font-light text-sm">
                        {request?.address || "Disrict, Parish, Village"}
                      </h2>
                    </div>
                  </div>
                  {/* review section */}
                </div>
                <div>
                  {
                    <div className="flex flex-col md:flex-row align-middle max-w-prose mx-auto justify-center md:px-3 border rounded-md animate-accordion-down md:py-2">
                      
                      <div className="flex-col p-8">
                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Name:&nbsp;
                          </span>
                          <span>
                            {request?.first_name} {request?.last_name}
                          </span>
                        </p>
                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          {" "}
                          <span className="font-semibold text-lg tracking-wide">
                            Email:&nbsp;
                          </span>
                          {request?.email || "Undefined"}
                        </p>
                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Gender:&nbsp;
                          </span>
                          {request?.gender}
                        </p>
                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Date of birth:&nbsp;
                          </span>
                          {request?.dob ? request?.dob : "Undefined"}
                        </p>
                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Address:&nbsp;
                          </span>
                          {request?.address}
                        </p>
                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            size:&nbsp;
                          </span>
                          {request?.household_size
                            ? request?.household_size
                            : "Undefined"}
                        </p>

                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Number of children:{" "}
                          </span>{" "}
                          {request?.no_children
                            ? request?.no_children
                            : "Undefined"}
                        </p>

                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            School going children:{" "}
                          </span>{" "}
                          {request?.count_school_going
                            ? request?.count_school_going
                            : "Undefined"}
                        </p>

                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          {" "}
                          <span className="font-semibold text-lg tracking-wide">
                            Phone number{"(s)"}:
                          </span>
                          {!request?.tel?.length ? (
                            "Undefined"
                          ) : request?.tel?.length === 1 ? (
                            <span>
                              {request.tel[0] ? request.tel[0] : "Undefined"}{" "}
                            </span>
                          ) : (
                            request?.tel?.map((tel) => (
                              <>
                                <span key={tel}>{tel}</span> <br />
                              </>
                            ))
                          )}
                        </p>

                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Average income per harvest:{" "}
                          </span>
                          {request.average_income_per_harvest
                            ? request.average_income_per_harvest
                            : "Undefined"}
                        </p>

                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          {" "}
                          <span className="font-semibold text-lg tracking-wide">
                            Other income sources:
                          </span>
                          {!request?.other_income_sources?.length ? (
                            "Undefined"
                          ) : request?.other_income_sources?.length === 1 ? (
                            <span>
                              {request?.tel?.[0]
                                ? request?.tel?.[0]
                                : "Undefined"}{" "}
                            </span>
                          ) : (
                            request?.other_income_sources?.map((source) => (
                              <>
                                <span key={source.income_name}>
                                  {source.income_name
                                    ? source.income_name
                                    : "Undefined"}
                                </span>{" "}
                                <br />
                              </>
                            ))
                          )}
                        </p>

                        <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                          <span className="font-semibold text-lg tracking-wide">
                            Added by:{" "}
                          </span>
                          {request?.added_by ? request?.added_by : "Undefined"}
                        </p>

                        <a
                          href={`/protected/deep-retrieval/${request.farmer_uid}`}
                          className="text-blue-500 py-2"
                        >
                          See linked farm
                        </a>
                      </div>
                    </div>
                  }
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
      {/* ))} */}
    </div>
  );
}
