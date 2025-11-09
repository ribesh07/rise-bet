"use client";
import React from "react";
import { Upload } from "lucide-react";

const Verification = () => {
  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <h3 className="text-xl font-semibold mb-4">Identity Verification</h3>

      <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
        <h4 className="font-semibold">Government ID</h4>
        <p className="text-gray-400 text-sm mb-4">
          Upload driver’s license, passport, or national ID card.
        </p>

        <label className="bg-[#1a2c38] border border-[#233341] rounded-md px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-[#213544] transition">
          <Upload size={18} /> Upload Front / Back
          <input type="file" className="hidden" />
        </label>
      </div>

      <div className="border border-[#1c2a38] rounded-md p-5">
        <h4 className="font-semibold">Selfie Verification</h4>
        <p className="text-gray-400 text-sm mb-4">
          Hold your ID and take a clear facial photo.
        </p>

        <label className="bg-[#1a2c38] border border-[#233341] rounded-md px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-[#213544] transition">
          <Upload size={18} /> Upload Selfie Photo
          <input type="file" className="hidden" />
        </label>

        <div className="flex justify-end mt-4">
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold">
            Submit Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
