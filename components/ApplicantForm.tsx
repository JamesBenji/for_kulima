"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface FormErrors {
  [key: string]: string;
}

export default function ApplicantForm() {
  const [formData, setFormData] = useState<ApplicantFields>({
    first_name: "",
    last_name: "",
    requestor_email: "",
    phone_number: "",
    organization: "",
    position: "",
    gender: null,
    district: "",
    parish: "",
    requested_position: "",
    email: "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = () => {
    let newErrors: FormErrors = {};

    (
      [
        "first_name",
        "last_name",
        "image",
        "organization",
        "position",
        "gender",
        "district",
        "parish",
        "requested_position",
        "phone_number",
        "email",
      ] as const
    ).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.requestor_email &&
      !emailRegex.test(formData.requestor_email)
    ) {
      newErrors.requestor_email = "Invalid email format";
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate phone number
    if (
      formData.phone_number[0] &&
      /^07[0-9]{8}$/.test(formData.phone_number[0])
    ) {
      newErrors.phone_number = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      const logObject: Record<string, string | File | null> = {};

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formDataToSend.append(key, value, value.name);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      console.log("Form values to be submitted:");
      Object.entries(logObject).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          console.log(
            `${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      });


      toast.loading('Saving your data', {duration: 3000})
      fetch("/api/register-applicant", {
        method: "POST",
        body: formDataToSend,
      }).then(() => {
        toast.success('Access request made successfully', {duration: 3000});
        window.location.replace('/protected')
        window.location.reload()
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-5">
      <CardHeader>
        <CardTitle>Account Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* <div>
            <Label htmlFor="requestor_email">Requestor Email</Label>
            <Input
              id="requestor_email"
              name="requestor_email"
              type="email"
              value={formData.requestor_email}
              onChange={handleInputChange}
              className={errors.requestor_email ? "border-red-500" : ""}
            />
            {errors.requestor_email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.requestor_email}
              </p>
            )}
          </div> */}

          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              //   required
              //   onChange={handlePhoneChange}
              className={errors.phone_number ? "border-red-500" : ""}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className={errors.organization ? "border-red-500" : ""}
              />
              {errors.organization && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.organization}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={errors.position ? "border-red-500" : ""}
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={errors.district ? "border-red-500" : ""}
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
              )}
            </div>
            <div>
              <Label htmlFor="parish">Parish</Label>
              <Input
                id="parish"
                name="parish"
                value={formData.parish}
                onChange={handleInputChange}
                className={errors.parish ? "border-red-500" : ""}
              />
              {errors.parish && (
                <p className="text-red-500 text-sm mt-1">{errors.parish}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="requested_position">Requested Position</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("requested_position", value)
              }
            >
              <SelectTrigger
                className={errors.requested_position ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select requested position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="district_admin">District Admin</SelectItem>
                <SelectItem value="parish_admin">Parish Admin</SelectItem>
                <SelectItem value="field_agent">Field Agent</SelectItem>
              </SelectContent>
            </Select>
            {errors.requested_position && (
              <p className="text-red-500 text-sm mt-1">
                {errors.requested_position}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Profile Image (Required)</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </CardContent>
      {/* <div>
            <div>Apply for an account</div>
            <div></div>
            <RequestAccountAccessButton data={data} />
          </div> */}
    </Card>
  );
}
