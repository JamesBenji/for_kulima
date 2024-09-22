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
  requested_position: "district_admin" | "parish_admin";
};
