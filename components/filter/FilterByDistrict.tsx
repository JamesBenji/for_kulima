import useUniquesDistricts from "@/hooks/useUniqueDistricts";
import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FilterByDistrictProps {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

export default function FilterByDistrict({
  state,
  setState,
}: FilterByDistrictProps) {
  const districts = useUniquesDistricts();

  const handleDistrictChange = (value: string) => {
    setState(value);
  };



  return (
    <div className="flex-1">
      <div className="flex align-middle">
        <Select value={state} onValueChange={(value) => handleDistrictChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by district" />
          </SelectTrigger>
          <SelectContent>
            {districts &&
              districts?.length > 0 &&
              districts?.map((district) => (
                <SelectItem value={district.district}>
                  {district.district}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
