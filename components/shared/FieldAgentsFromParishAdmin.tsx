import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type ParishAdminFromDistrictAdminProps = {
  email: string;
};

export default function FieldAgentsFromParishAdmin({
  email,
}: ParishAdminFromDistrictAdminProps) {
  const [farms, setFarms] = useState<ParishAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch("/api/show-parish-links-agent", {
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
          <Card
            className="mx-auto flex flex-col align-middle justify-center"
          >
            <CardHeader>
              <CardTitle className="max-w-prose mx-auto">Field agents added by this user</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-prose mx-auto">
                {farms
                  ?.sort((a, b) => a?.first_name?.localeCompare(b.last_name))
                  .map((request) => (
                    <div className="flex-col basis-2/3 p-8">
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Name:&nbsp;
                        </span>
                        <span>
                          {request.first_name} {request.last_name}
                        </span>
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Email:&nbsp;
                        </span>
                        {request.email}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Gender:&nbsp;
                        </span>
                        {request.gender}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Organization:&nbsp;
                        </span>
                        {request.organization}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Phone number{"(s)"}:
                        </span>
                        {request.phone_number.length === 1 ? (
                          <span>{request.phone_number[0]} </span>
                        ) : (
                          request.phone_number.map((tel) => (
                            <>
                              <span key={tel}>{tel} </span> <br />
                            </>
                          ))
                        )}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Allocation:{" "}
                        </span>{" "}
                        {request.allocation? request.allocation : 'Undefined'}
                        {/* {`${request.district} ${request.parish}`} */}
                      </p>

                      
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Granted by:{" "}
                        </span>
                        {request.granted_by}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Has system access:{" "}
                        </span>
                        {request.hasAccess ? "True" : "False"}
                      </p>
                      <p>
                        <a href={`/protected/deep-retrieval-farmer/${request.email}`} className="text-blue-500 py-2">See linked farmers</a>
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        {/* ))} */}
    </div>
  );
}
