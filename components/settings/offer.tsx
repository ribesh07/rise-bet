// // "use client";
// // import React from "react";

// // const Offers = () => {
// //   return (
// //     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
// //       <h3 className="text-xl font-semibold mb-4">Offers & Rewards</h3>

// //       <div className="border border-[#1c2a38] rounded-md p-5">
// //         <p className="text-gray-400 text-sm">
// //           No active offers at the moment. Check back later!
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Offers;
// "use client";
// import React, { useState } from "react";

// const Offers = () => {
//   const [welcomeCode, setWelcomeCode] = useState("");
//   const [bonusCode, setBonusCode] = useState("");

//   return (
//     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
//       <h3 className="text-xl font-semibold mb-6">Offers</h3>

//       {/* ✅ Welcome Offer */}
//       <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
//         <h4 className="text-lg font-semibold mb-1">Welcome Offer</h4>
//         <p className="text-gray-400 text-sm">
//           To claim your welcome offer, please enter your code within 24 hours of signing up.
//         </p>

//         <label className="text-sm text-gray-300 mt-4 block">Code *</label>
//         <input
//           value={welcomeCode}
//           onChange={(e) => setWelcomeCode(e.target.value)}
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           placeholder="Enter welcome code"
//         />

//         <div className="flex justify-end mt-4">
//           <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold">
//             Submit
//           </button>
//         </div>
//       </div>

//       {/* ✅ Claim Bonus Drop */}
//       <div className="border border-[#1c2a38] rounded-md p-5">
//         <h4 className="text-lg font-semibold mb-1">Claim Bonus Drop</h4>
//         <p className="text-gray-400 text-sm">
//           Find bonus drop codes on our social media’s such as x.com (Twitter) & Telegram.
//         </p>

//         <label className="text-sm text-gray-300 mt-4 block">Code *</label>
//         <input
//           value={bonusCode}
//           onChange={(e) => setBonusCode(e.target.value)}
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           placeholder="Enter bonus code"
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

// export default Offers;
"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Offers = () => {
  const [welcomeCode, setWelcomeCode] = useState("");
  const [bonusCode, setBonusCode] = useState("");

  const handleWelcomeSubmit = () => {
    if (!welcomeCode.trim()) {
      toast.error("Please enter a valid welcome code.");
      return;
    }
    toast.success("Welcome offer submitted successfully!");
    setWelcomeCode("");
  };

  const handleBonusSubmit = () => {
    if (!bonusCode.trim()) {
      toast.error("Please enter a valid bonus code.");
      return;
    }
    toast.success("Bonus drop claimed successfully!");
    setBonusCode("");
  };

  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <Toaster position="top-right" />

      <h3 className="text-xl font-semibold mb-6">Offers</h3>

      {/* ✅ Welcome Offer */}
      <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
        <h4 className="text-lg font-semibold mb-1">Welcome Offer</h4>
        <p className="text-gray-400 text-sm">
          To claim your welcome offer, please enter your code within 24 hours of signing up.
        </p>

        <label className="text-sm text-gray-300 mt-4 block">Code *</label>
        <input
          value={welcomeCode}
          onChange={(e) => setWelcomeCode(e.target.value)}
          className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
          placeholder="Enter welcome code"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleWelcomeSubmit}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
          >
            Submit
          </button>
        </div>
      </div>

      {/* ✅ Claim Bonus Drop */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <h4 className="text-lg font-semibold mb-1">Claim Bonus Drop</h4>
        <p className="text-gray-400 text-sm">
          Find bonus drop codes on social media such as X.com (Twitter) & Telegram.
        </p>

        <label className="text-sm text-gray-300 mt-4 block">Code *</label>
        <input
          value={bonusCode}
          onChange={(e) => setBonusCode(e.target.value)}
          className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
          placeholder="Enter bonus code"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleBonusSubmit}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
