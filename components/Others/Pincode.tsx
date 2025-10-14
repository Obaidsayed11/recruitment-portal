import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { AreaName } from "./AreaName";

interface PostOffice {
  Name: string;
  State: string;
  District: string;
}

interface PincodeProps {
  data?: {
    pincode: string;
    area: string;
    state: string;
    district: string;
  };
  onAreaSelect: (data: {
    pincode: string;
    area: string;
    state: string;
    district: string;
  }) => void;
  className?: string;
}

const Pincode: React.FC<PincodeProps> = ({ data, onAreaSelect, className }) => {
  const [pincode, setPincode] = useState(data?.pincode || "");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [selectedArea, setSelectedArea] = useState(data?.area || "");
  const [state, setState] = useState(data?.state || "");
  const [district, setDistrict] = useState(data?.district || "");

  useEffect(() => {
    if (data) {
      setPincode(data.pincode);
      setSelectedArea(data.area);
      setState(data.state);
      setDistrict(data.district);
    }
  }, [data]);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
      if (value.length === 6) {
        fetchPinCode(value); // Fetch data only if the pincode is exactly 6 digits
      } else {
        clearLocationData(); // Clear related fields if pincode is not valid
      }
    }
  };

  const fetchPinCode = async (code: string) => {
    if (!/^\d{6}$/.test(code)) return; // Ensure pincode is exactly 6 digits before fetching

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${code}`
      );
      const offices = response.data[0]?.PostOffice || [];
      if (offices.length > 0) {
        setPostOffices(offices);
        setState(offices[0].State);
        setDistrict(offices[0].District);
      } else {
        console.warn("No offices found for pincode:", code);
        clearLocationData();
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      clearLocationData();
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    const updatedData = {
      pincode,
      area,
      state,
      district,
    };
    onAreaSelect(updatedData);
  };

  const clearLocationData = () => {
    setPostOffices([]);
    setSelectedArea("");
    setState("");
    setDistrict("");
  };

  return (
    <div className={`${className} grid gap-3 sm:grid-cols-2`}>
      <Input
        name="pincode"
        type="text"
        value={pincode}
        onChange={handlePincodeChange}
        placeholder="6-digit pincode"
        max={6}
      />
      <AreaName
        options={postOffices.map((office) => ({
          value: office.Name,
          label: office.Name,
        }))}
        selectedValue={selectedArea}
        onSelect={handleAreaSelect}
      />
      <Input
        name="state"
        type="text"
        placeholder="State"
        value={state}
        disabled
      />
      <Input
        name="district"
        type="text"
        placeholder="District"
        value={district}
        disabled
      />
    </div>
  );
};

export default Pincode;
