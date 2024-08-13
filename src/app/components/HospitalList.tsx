"use client";
import React from "react";
import HospitalCard from "./HospitalCard"; 

interface Provider {
  name: string;
  address: string;
  phone: string;
}

interface HospitalListProps {
  providers: Provider[];
}

const HospitalList: React.FC<HospitalListProps> = ({ providers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {providers.map((provider, index) => (
        <HospitalCard
          key={index}
          name={provider.name}
          address={provider.address}
        //   phone={provider.phone}
        />
      ))}
    </div>
  );
};

export default HospitalList;