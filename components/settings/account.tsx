
// "use client";
// import React, { useState } from "react";

// const Account = () => {
//   const [email] = useState("sauravjha491@gmail.com");
//   const [phone, setPhone] = useState("");
//   const [countryCode, setCountryCode] = useState("+1 United States / Canada");

//   return (
//     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
//       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

//       {/* ✅ EMAIL SECTION */}
//       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Email</h3>
//           <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
//             Verified
//           </span>
//         </div>

//         <label className="text-gray-400 text-sm mt-4 block">Email</label>
//         <input
//           value={email}
//           disabled
//           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
//         />

//         <div className="flex justify-end mt-4">
//           <button className="bg-green-600 hover:bg-green-700 px-5 py-2 text-sm rounded-md font-semibold">
//             Confirm Email
//           </button>
//         </div>
//       </div>

//       {/* ✅ PHONE NUMBER SECTION */}
//       <div className="border border-[#1c2a38] rounded-md p-5">
//         <h3 className="text-lg font-semibold">Phone Number</h3>
//         <p className="text-gray-400 text-sm mt-1 mb-4">
//           We only service locations listed in country codes.
//         </p>

//         <label className="text-sm text-gray-300">Country Code *</label>
//         <select
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           value={countryCode}
//           onChange={(e) => setCountryCode(e.target.value)}
//         >
//             <option>+91 India</option>
//           <option>+1 United States / Canada</option>
          
//           <option>+44 United Kingdom</option>
//         </select>

//         <label className="text-sm text-gray-300 mt-4 block">Phone Number *</label>
//         <input
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           placeholder="Enter phone number"
//         />

//         <div className="flex justify-end mt-4">
//           <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold">
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Account;
"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Account = () => {
  const [email] = useState("sauravjha491@gmail.com");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1 United States / Canada");

  const handleConfirmEmail = () => {
    toast.success("Confirmation email sent!");
  };

  const handleSubmitPhone = () => {
    if (!phone || phone.length < 6) {
      return toast.error("Please enter a valid phone number!");
    }
    toast.success("Phone number submitted successfully!");
  };

  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <Toaster position="top-right" />
      <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

      {/* ✅ EMAIL SECTION */}
      <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Email</h3>
          <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
            Verified
          </span>
        </div>

        <label className="text-gray-400 text-sm mt-4 block">Email</label>
        <input
          value={email}
          disabled
          className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleConfirmEmail}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 text-sm rounded-md font-semibold"
          >
            Confirm Email
          </button>
        </div>
      </div>

      {/* ✅ PHONE NUMBER SECTION */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <h3 className="text-lg font-semibold">Phone Number</h3>
        <p className="text-gray-400 text-sm mt-1 mb-4">
          We only service locations listed in country codes.
        </p>

        <label className="text-sm text-gray-300">Country Code *</label>
        <select
          className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option>+91 India</option>
          <option>+1 United States / Canada</option>
          <option>+44 United Kingdom</option>
        </select>

        <label className="text-sm text-gray-300 mt-4 block">Phone Number *</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
          placeholder="Enter phone number"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitPhone}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
