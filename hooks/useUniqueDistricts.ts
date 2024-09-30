"use client";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, UserResponse } from "@supabase/supabase-js";
import { error } from "console";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Location = {
  district: string;
  parish: string;
};

const fetchDistricts = async (supabase: SupabaseClient<any, "public", any>) => {
  const { data, error } = await supabase
    .from("unique_districts")
    .select("district");

  if (error) {
    console.log({ error });

    return null;
  }
  return data;
};

const useUniquesDistricts = () => {
  const supabase = createClient();
  const [locations, setLocations] = useState<{ district: string }[] | null>(
    null
  );

  const [tracker, setTracker] = useState<boolean>(false);
  useEffect(() => {
    setTracker(locations ? true : false);
  }, [locations]);

  useEffect(() => {
    if (!tracker) {
      fetchDistricts(supabase).then((response) => {
        if (response) {
          setLocations(response);
        }
      });
    }
  }, [tracker]);

  return locations;
};

export default useUniquesDistricts;
