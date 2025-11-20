
"use client";

import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Verification = () => {
  const [profile, setProfile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);

  // local previews
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);

  // already uploaded from backend
  const [existingProfile, setExistingProfile] = useState<string | null>(null);
  const [existingDocuments, setExistingDocuments] = useState<string[]>([]);

  const [isVerified, setIsVerified] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const FULL_URL = "https://api.playrise.vip";

  // -----------------------------
  // FETCH EXISTING DOCUMENTS
  // -----------------------------
  useEffect(() => {
    const fetchUserDocs = async () => {
      try {
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!id || !token) return;

        const res = await fetch(`${BASE_URL}/users/${id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data?.success) return;

        const user = data.data;

        // Set existing images using FULL_URL
        if (user.profileImage) {
          setExistingProfile(FULL_URL + user.profileImage);
        }

        if (user.documentImages?.length > 0) {
          setExistingDocuments(
            user.documentImages.map((img: string) => FULL_URL + img)
          );
        }

        // Disable submit button if already uploaded
        if (user.profileImage && user.documentImages?.length > 0) {
          setIsVerified(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserDocs();
  }, []);

  // -----------------------------
  // HANDLE PROFILE
  // -----------------------------
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setProfile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // -----------------------------
  // HANDLE DOCUMENT IMAGES
  // -----------------------------
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setDocuments(files);
    setDocumentPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // -----------------------------
  // SUBMIT TO BACKEND
  // -----------------------------
  const handleSubmit = async () => {
    if (!profile) return toast.error("Please upload selfie first!");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("profileImage", profile);
      documents.forEach((doc) => formData.append("documents", doc));

      const res = await fetch(`${BASE_URL}/users/upload-user-files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Files uploaded successfully!");
        setIsVerified(true);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Something went wrong during upload");
      console.error(err);
    }
  };

  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <Toaster position="top-right" />
      <h3 className="text-xl font-semibold mb-4">Identity Verification</h3>

      {isVerified && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-md">
          <p className="text-green-400 font-semibold">
            Verification already submitted.
          </p>
        </div>
      )}

      {/* ================= DOCUMENTS ================= */}
      <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
        <h4 className="font-semibold">Government ID (Front / Back)</h4>
        <p className="text-gray-400 text-sm mb-4">
          Upload driver’s license, passport, or national ID card.
        </p>

        {!isVerified && (
          <label className="bg-[#1a2c38] border border-[#233341] rounded-md px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-[#213544] transition">
            <Upload size={18} /> Upload Front / Back
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleDocumentChange}
            />
          </label>
        )}

        {/* EXISTING DOCUMENTS */}
        {existingDocuments.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {existingDocuments.map((src, i) => (
              <img
                key={i}
                src={src}
                className="rounded-md border border-gray-700 h-28 w-full object-cover"
              />
            ))}
          </div>
        )}

        {/* NEW DOCUMENT PREVIEWS */}
        {!isVerified && documentPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {documentPreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  className="rounded-md border border-gray-700 h-28 w-full object-cover"
                />
                <button
                  className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-md"
                  onClick={() => {
                    setDocuments((prev) => prev.filter((_, idx) => idx !== i));
                    setDocumentPreviews((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    );
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SELFIE ================= */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <h4 className="font-semibold">Selfie Verification</h4>
        <p className="text-gray-400 text-sm mb-4">
          Hold your ID and take a clear facial photo.
        </p>

        {!isVerified && (
          <label className="bg-[#1a2c38] border border-[#233341] rounded-md px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-[#213544] transition">
            <Upload size={18} /> Upload Selfie Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
          </label>
        )}

        {/* EXISTING PROFILE */}
        {existingProfile && (
          <div className="mt-4 relative w-32 h-32">
            <img
              src={existingProfile}
              className="rounded-md border border-gray-700 object-cover w-full h-full"
            />
          </div>
        )}

        {/* NEW SELFIE PREVIEW */}
        {!isVerified && profilePreview && (
          <div className="mt-4 relative w-32 h-32">
            <img
              src={profilePreview}
              className="rounded-md border border-gray-700 object-cover w-full h-full"
            />
            <button
              className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-md"
              onClick={() => {
                setProfile(null);
                setProfilePreview(null);
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex justify-end mt-5">
          <button
            disabled={isVerified}
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-md font-semibold ${
              isVerified
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isVerified ? "Already Submitted" : "Submit Verification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
