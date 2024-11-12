import { useState } from "react";

interface FormData {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
}

const initialFormData: FormData = {
  monthlyLeads: 0,
  responseRate: 1,
  meetingRate: 1,
  currentCost: 0,
  leadValue: 0,
  meetingsToClose: 0,
};

export const useROIForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSliderChange = (field: keyof FormData, value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value[0] }));
  };

  const handleInputChange = (field: keyof FormData) => (value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const allFieldsFilled = !Object.entries(formData)
    .some(([key, value]) => value === 0 || (["responseRate", "meetingRate"].includes(key) && value === 1));

  return {
    formData,
    handleSliderChange,
    handleInputChange,
    allFieldsFilled
  };
};