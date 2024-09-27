type Positions = "district_adm" | "parish_adm";

type AccountApplicationData = {
  first_name: string;
  last_name: string;
  requestor_email: string;
  phone_number: string[];
  organization: string;
  position: string;
  gender: string;
  allocation: string;
  district?: string;
  parish?: string;
  requested_position: "district_admin" | "parish_admin" | "field_agent";
  hasAccess?: boolean;
  email?: string;
  image?: string;
};

type Actions = {
  name: string;
  component: React.ReactNode;
};

type FarmerResponse = {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  tel: string[];
  gender: string;
  household_size: number;
  no_children: number;
  count_school_going: number;
  average_income_per_harvest: number;
  other_income_sources: {
    income_name: string;
  }[];
  added_by: string;
  address: string;
};

type FarmResponse = {
  land_size: number;
  land_units: string;
  crops: string[];
  location: string;
  geo_location: string[];
  average_quantity_produced: number;
  quantity_units: string;
  labourers: number;
  current_machinery: {
    machine_name: string;
    purpose: string;
  }[];
  previous_machinery: {
    machine_name: string;
    purpose: string;
  }[];
  pests: {
    pest_name: string;
    effect: string;
  }[];
  pest_control: {
    pest: string;
    control_measure: string;
  }[];
  water_source: { type: string; distance_from_farm: number };
  water_contaminants: { contaminant: string; effect: string }[];
  land_use: { crop: string; land_size: number }[];
  added_by: string;
  images: string[];
  farm_owner: string;
  fertilizers: { type: string; frequency: string }[];
  farm_name: string;
  type: string;
  is_water_contaminated: boolean;
  image_file_name: string;
  is_currently_mechanized: boolean;
  previously_mechanized: boolean;
  district: string;
  parish: string;
};

type ParishAdminResponse = {
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string[];
  organization: string;
  position: string;
  gender: string;
  allocation: string;
  granted_by: string;
  district: string;
  parish: string;
  hasAccess: boolean;
  image: string;
};

type ApplicantFields = {
  first_name: string;
  last_name: string;
  requestor_email: string;
  phone_number: string;
  organization: string;
  position: string;
  gender: "Male" | "Female" | null;
  district: string;
  parish: string;
  requested_position: string;
  email: string;
  image: File | null;
};
