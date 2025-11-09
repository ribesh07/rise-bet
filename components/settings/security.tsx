
"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SecurityPage = () => {
  // ✅ Password States
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const passwordsMatch = newPass === confirmPass && newPass.length > 0;

  const [showToast, setShowToast] = useState(false);

  // ✅ Sessions
  const [sessions, setSessions] = useState([
    {
      id: 1,
      browser: "Chrome (Windows PC)",
      near: "NP, Butwal",
      ip: "202.51.80.195",
      last: "29 minutes ago",
      status: "Current",
    },
    {
      id: 2,
      browser: "Chrome (Windows PC)",
      near: "NP, Gaur",
      ip: "202.51.80.198",
      last: "2 hours ago",
      status: "Active",
    },
    {
      id: 3,
      browser: "Chrome (Windows PC)",
      near: "NP, Kathmandu",
      ip: "45.64.161.204",
      last: "34 days ago",
      status: "Removed",
    },
  ]);

  const [filter, setFilter] = useState("All");

  // ✅ Filter Function
  const filteredSessions = sessions.filter((s) =>
    filter === "All" ? true : s.status === filter
  );

  // ✅ Remove Session Function
  const removeSession = (id: number) => {
    setSessions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Removed" } : item
      )
    );
  };

  // ✅ Submit Password Change
  const handleUpdate = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]"
    >
      <h3 className="text-xl font-semibold mb-6">Security Settings</h3>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow-lg mb-6 w-fit"
          >
            ✅ Password updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ CHANGE PASSWORD */}
      <div className="border border-[#1c2a38] rounded-md p-5 mb-8">
        <h4 className="font-semibold text-lg mb-3">Change Password</h4>

        {/* Current Password */}
        <label className="text-sm text-gray-300">Current Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 pr-10"
            placeholder="Enter current password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />
          <span
            className="absolute top-3 right-3 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* New Password */}
        <label className="text-sm text-gray-300 mt-4 block">
          New Password
        </label>
        <div className="relative mt-1">
          <input
            type={showNewPassword ? "text" : "password"}
            className={`w-full bg-[#1a2c38] border px-3 py-2 rounded-md text-gray-300 pr-10 ${
              passwordsMatch || newPass.length === 0
                ? "border-[#233341]"
                : "border-red-500"
            }`}
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <span
            className="absolute top-3 right-3 cursor-pointer text-gray-400"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Confirm Password */}
        <label className="text-sm text-gray-300 mt-4 block">
          Confirm New Password
        </label>
        <div className="relative mt-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full bg-[#1a2c38] border px-3 py-2 rounded-md text-gray-300 pr-10 ${
              passwordsMatch || confirmPass.length === 0
                ? "border-[#233341]"
                : "border-red-500"
            }`}
            placeholder="Confirm new password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <span
            className="absolute top-3 right-3 cursor-pointer text-gray-400"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {!passwordsMatch && confirmPass.length > 0 && (
          <p className="text-red-500 text-sm mt-2">Passwords do not match.</p>
        )}

        <div className="flex justify-end mt-4">
          <button
            disabled={!passwordsMatch || !currentPass}
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-2 rounded-md font-semibold"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* ✅ SESSIONS TABLE */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <h4 className="font-semibold text-lg">Sessions</h4>
        <p className="text-gray-400 text-sm mt-1 mb-4">
          Track and manage active login sessions.
        </p>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-300">Session Filter:</span>
          <select
            className="bg-[#1a2c38] border border-[#233341] rounded-md px-3 py-1 text-sm text-gray-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Current</option>
            <option>Active</option>
            <option>Removed</option>
          </select>
        </div>

        {/* Table (Desktop) */}
        <div className="hidden md:block overflow-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="text-gray-400 border-b border-[#233341]">
                <th className="py-2 text-left">Browser</th>
                <th className="py-2 text-left">Near</th>
                <th className="py-2 text-left">IP Address</th>
                <th className="py-2 text-left">Last Used</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.id} className="border-b border-[#233341]">
                  <td className="py-3">{session.browser}</td>
                  <td>{session.near}</td>
                  <td>{session.ip}</td>
                  <td>{session.last}</td>
                  <td>
                    {session.status === "Removed" ? (
                      <span className="text-gray-400">Removed</span>
                    ) : session.status === "Current" ? (
                      <span className="text-green-500 font-semibold">
                        Current
                      </span>
                    ) : (
                      <span
                        className="text-red-500 cursor-pointer hover:underline"
                        onClick={() => removeSession(session.id)}
                      >
                        Remove Session
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ MOBILE RESPONSIVE (Stacked cards) */}
        <div className="md:hidden flex flex-col gap-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#1a2c38] border border-[#233341] p-3 rounded-lg"
            >
              <p className="text-sm">
                <span className="text-gray-400">Browser:</span>{" "}
                {session.browser}
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Near:</span> {session.near}
              </p>
              <p className="text-sm">
                <span className="text-gray-400">IP:</span> {session.ip}
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Last:</span> {session.last}
              </p>

              <div className="mt-2">
                {session.status === "Removed" ? (
                  <span className="text-gray-400 text-sm">Removed</span>
                ) : session.status === "Current" ? (
                  <span className="text-green-500 font-semibold text-sm">
                    Current
                  </span>
                ) : (
                  <button
                    className="text-red-500 text-sm underline"
                    onClick={() => removeSession(session.id)}
                  >
                    Remove Session
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityPage;
