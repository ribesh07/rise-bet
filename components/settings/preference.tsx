
"use client";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";

const Preferences = () => {
  // Toggle states
  const [ghostMode, setGhostMode] = useState(false);
  const [hideStats, setHideStats] = useState(true);
  const [hideRaceStats, setHideRaceStats] = useState(true);

  const [emailOffers, setEmailOffers] = useState(true);
  const [smsOffers, setSmsOffers] = useState(false);

  const handlePrivacySave = () => {
    toast.success("Privacy settings updated successfully!");
  };

  const handleMarketingSave = () => {
    toast.success("Marketing preferences updated!");
  };

  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <Toaster position="top-right" />
      <h3 className="text-xl font-semibold mb-6">Preferences</h3>

      {/* ✅ PRIVACY */}
      <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
        <h4 className="font-semibold text-lg mb-3">Privacy</h4>
        <p className="text-gray-400 text-sm mb-4">
          User privacy is a core value. These settings allow you to stay anonymous from other players.
        </p>

        {/* ✅ Ghost Mode */}
        <div className="flex items-center justify-between py-2 border-b border-[#1c2a38]">
          <div>
            <p className="font-semibold text-sm text-gray-200">Enable Ghost Mode</p>
            <p className="text-gray-400 text-xs">Your username will not appear publicly.</p>
          </div>
          <Switch
            checked={ghostMode}
            onChange={setGhostMode}
            className={`${ghostMode ? "bg-green-500" : "bg-gray-600"}
            relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${ghostMode ? "translate-x-6" : "translate-x-1"}
              inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        {/* ✅ Hide All Stats */}
        <div className="flex items-center justify-between py-2 border-b border-[#1c2a38]">
          <div>
            <p className="font-semibold text-sm text-gray-200">Hide All Your Statistics</p>
            <p className="text-gray-400 text-xs">Others won't see wins, losses, wagered stats.</p>
          </div>
          <Switch
            checked={hideStats}
            onChange={setHideStats}
            className={`${hideStats ? "bg-green-500" : "bg-gray-600"}
            relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${hideStats ? "translate-x-6" : "translate-x-1"}
              inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        {/* ✅ Hide Race Stats */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-semibold text-sm text-gray-200">Hide All Your Race Statistics</p>
            <p className="text-gray-400 text-xs">Other users won’t see race stats.</p>
          </div>
          <Switch
            checked={hideRaceStats}
            onChange={setHideRaceStats}
            className={`${hideRaceStats ? "bg-green-500" : "bg-gray-600"}
            relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${hideRaceStats ? "translate-x-6" : "translate-x-1"}
              inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <p className="text-gray-400 text-xs mt-3 mb-3">
          Please allow up to 30 seconds for updates to take effect.
        </p>

        <div className="flex justify-end">
          <button
            onClick={handlePrivacySave}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
          >
            Save
          </button>
        </div>
      </div>

      {/* ✅ MARKETING */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <h4 className="font-semibold text-lg mb-3">Marketing</h4>

        {/* ✅ Email Offers */}
        <div className="flex items-center justify-between py-2 border-b border-[#1c2a38]">
          <div>
            <p className="font-semibold text-sm text-gray-200">Receive Email Offers From Us</p>
            <p className="text-gray-400 text-xs">Choose to hear from us via email.</p>
          </div>
          <Switch
            checked={emailOffers}
            onChange={setEmailOffers}
            className={`${emailOffers ? "bg-green-500" : "bg-gray-600"}
            relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${emailOffers ? "translate-x-6" : "translate-x-1"}
              inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        {/* ✅ SMS Offers */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-semibold text-sm text-gray-200">Receive SMS Offers From Us</p>
            <p className="text-gray-400 text-xs">Hear from us via SMS.</p>
          </div>
          <Switch
            checked={smsOffers}
            onChange={setSmsOffers}
            className={`${smsOffers ? "bg-green-500" : "bg-gray-600"}
            relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${smsOffers ? "translate-x-6" : "translate-x-1"}
              inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <p className="text-gray-400 text-xs mt-3 mb-3">
          Please allow up to 30 seconds for update to take effect.
        </p>

        <div className="flex justify-end">
          <button
            onClick={handleMarketingSave}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
