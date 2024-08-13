"use client"
import Image from 'next/image';
import GoogleImage from "@/app/images/google-maps.svg";
import { useState } from 'react';

interface HospitalCardProps {
  name: string;
  address: string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ name, address }) => {
  const handleOpenGoogleMaps = () => {
    const formattedAddress = address.replace(/\s/g, "+");
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    window.open(url, "_blank", "rel=noopener noreferrer");
  };

  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipBoard = () => {
    const textToCopy = `${name}\n${address}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }).catch((error) => console.error("copy failed:", error));
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <div className="max-w-sm flex flex-col justify-between items-center border border-gray-200 rounded-lg hover:bg-gray-300">
      <div className="flex justify-center">
        <button onClick={handleOpenGoogleMaps}>
          <Image src={GoogleImage} width={10} height={10} alt="Google map icon" className="w-8 h-8 cursor-pointer" />
        </button>
      </div>
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-800 dark:text-gray-400">
        {name}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {address}
      </p>
      <div className="flex">
        <button className="inline-flex items-center text-gray-800 hover:text-white" onClick={copyToClipBoard}>
          {copied ? "copied" : "copy address"}
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;