
// "use client";
// import React, { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { apiRequest } from "@/utils/ApiHelper"; // ⬅️ make sure this path is correct

// const Offers = () => {
//   const [welcomeCode, setWelcomeCode] = useState("");
//   const [bonusCode, setBonusCode] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔥 Common Function to Redeem Code
//   const redeemPromo = async (code: string) => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Authentication error. Please login again.");
//         return;
//       }

//       const res = await apiRequest(
//         `/users/redeem-promo`,
//         true,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ code }),
//         }
//       );

//       console.log("Redeem Response:", res);

//       if (res.success) {
//         toast.success(res.message || "Promo redeemed successfully!");
//       } else {
//         toast.error(res.message || "Invalid promo code.");
//       }

//     } catch (err: any) {
//       console.error("Redeem Error:", err);
//       toast.error(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🎁 Welcome Offer Submit
//   const handleWelcomeSubmit = () => {
//     if (!welcomeCode.trim()) {
//       toast.error("Please enter a valid welcome code.");
//       return;
//     }
//     redeemPromo(welcomeCode);
//     setWelcomeCode("");
//   };

//   // 🎁 Bonus Drop Submit
//   const handleBonusSubmit = () => {
//     if (!bonusCode.trim()) {
//       toast.error("Please enter a valid bonus code.");
//       return;
//     }
//     redeemPromo(bonusCode);
//     setBonusCode("");
//   };

//   return (
//     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
//       <Toaster position="top-right" />

//       <h3 className="text-xl font-semibold mb-6">Offers</h3>

//       {/* Welcome Offer */}
//       <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
//         <h4 className="text-lg font-semibold mb-1">Welcome Offer</h4>
//         <p className="text-gray-400 text-sm">
//           To claim your welcome offer, enter your code within 24 hours of signing up.
//         </p>

//         <label className="text-sm text-gray-300 mt-4 block">Code *</label>
//         <input
//           value={welcomeCode}
//           onChange={(e) => setWelcomeCode(e.target.value)}
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           placeholder="Enter welcome code"
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleWelcomeSubmit}
//             disabled={loading}
//             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold disabled:opacity-50"
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>

//       {/* Bonus Drop */}
//       <div className="border border-[#1c2a38] rounded-md p-5">
//         <h4 className="text-lg font-semibold mb-1">Claim Bonus Drop</h4>
//         <p className="text-gray-400 text-sm">
//           Find bonus drop codes on X.com (Twitter) & Telegram.
//         </p>

//         <label className="text-sm text-gray-300 mt-4 block">Code *</label>
//         <input
//           value={bonusCode}
//           onChange={(e) => setBonusCode(e.target.value)}
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           placeholder="Enter bonus code"
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleBonusSubmit}
//             disabled={loading}
//             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold disabled:opacity-50"
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Offers;
"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "@/utils/ApiHelper";

const Offers = () => {
  const [welcomeCode, setWelcomeCode] = useState("");
  const [bonusCode, setBonusCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // 🔥 Fetch user details to get createdAt
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");

        if (!token || !id) return;

        const res = await apiRequest(`/users/${id}/details`, true, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Dashboard Details Response:", res);

        if (res.success && res.data) {
          setCreatedAt(res.data.createdAt);
        }
      } catch (err) {
        console.error("Dashboard API Error:", err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDashboardDetails();
  }, []);

  // 🔥 Helper: Check if createdAt > 24 hours
  const isMoreThan24Hours = () => {
    if (!createdAt) return true;

    const createdDate = new Date(createdAt).getTime();
    const now = Date.now();

    const diffHours = (now - createdDate) / (1000 * 60 * 60);

    return diffHours > 24; // returns true if more than 24 hours old
  };

  // 🔥 Redeem Promo API
  const redeemPromo = async (code: string) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please login again.");
        return;
      }

      const res = await apiRequest(`/users/redeem-promo`, true, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      console.log("Redeem Response:", res);

      if (res.success) {
        toast.success(res.message || "Promo redeemed successfully!");
      } else {
        toast.error(res.message || "Invalid promo code.");
      }

    } catch (err: any) {
      console.error("Redeem Error:", err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 🎁 Welcome Offer Submit
  const handleWelcomeSubmit = () => {
    if (!welcomeCode.trim()) {
      toast.error("Please enter a valid welcome code.");
      return;
    }

    // 🔥 Check if account age > 24 hours
    if (isMoreThan24Hours()) {
      toast.error("Your account is older than 24 hours. Welcome offer expired.");
      return;
    }

    redeemPromo(welcomeCode);
    setWelcomeCode("");
  };

  // 🎁 Bonus Drop Submit (No time restriction)
  const handleBonusSubmit = () => {
    if (!bonusCode.trim()) {
      toast.error("Please enter a valid bonus code.");
      return;
    }

    redeemPromo(bonusCode);
    setBonusCode("");
  };

  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <Toaster position="top-right" />

      <h3 className="text-xl font-semibold mb-6">Offers</h3>

      {/* Welcome Offer */}
      <div className="border border-[#1c2a38] rounded-md p-5 mb-6">
        <h4 className="text-lg font-semibold mb-1">Welcome Offer</h4>

        <p className="text-gray-400 text-sm">
          Enter your welcome code within 24 hours of signing up.
        </p>

        {createdAt && (
          <p className="text-xs mt-1 text-gray-500">
            Account created: {new Date(createdAt).toLocaleString()}
          </p>
        )}

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
            disabled={loading || loadingDetails}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Bonus Drop */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <h4 className="text-lg font-semibold mb-1">Claim Bonus Drop</h4>
        <p className="text-gray-400 text-sm">
          Find bonus drop codes on X.com (Twitter) & Telegram.
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
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
