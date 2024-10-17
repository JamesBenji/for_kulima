"use client";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const fetchDistricts = async (supabase: SupabaseClient<any, "public", any>) => {
  const { data, error } = await supabase
    .from("unique_sub_counties")
    .select("district, sub_county");

  if (error) {
    console.log({ error });

    return null;
  }
  return data;
};

const useLocation = () => {
  const supabase = createClient();
  
  const [locations, setLocations] = useState<
    { district: string; sub_county: string }[] | null
  >(null);

  const [locationsLoaded, setLocationsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLocationsLoaded(locations ? true : false);
  }, [locations]);

  useEffect(() => {
    if (!locationsLoaded) {
      fetchDistricts(supabase).then((response) => {
        if (response) {
          setLocations(response);
        }
      });
    }
  }, []);

  return locations;
};

export default useLocation;
