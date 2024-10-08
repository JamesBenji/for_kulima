import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useLocation from "@/hooks/useLocation";

interface FilterByParishProps {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  district?: string;
}

const getUniqueSubCounties = (arr: string[]) => {
  return [...new Set(arr)];
}

export default function FilterByParish({
  state,
  setState,
  district,
}: FilterByParishProps) {
  const locations = useLocation();

  const handleParishChange = (value: string) => {
    setState(value);
  };

  const sub_counties = locations?.filter(location => location.district === district)
  const unique_sub_counties = getUniqueSubCounties(sub_counties?.map(location => location.sub_county)!)

  return (
    <div className="flex-1">
      <div className="flex align-middle">
        <Select value={state} onValueChange={(value) => handleParishChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by parish" />
          </SelectTrigger>
          <SelectContent>
            {unique_sub_counties &&
              unique_sub_counties?.length > 0 &&
              unique_sub_counties?.map((location) => (
                <SelectItem value={location}>
                  {location}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
