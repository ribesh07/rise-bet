
// // // // // "use client";
// // // // // import React, { useState } from "react";
// // // // // import toast, { Toaster } from "react-hot-toast";

// // // // // const Account = () => {
// // // // //   const [email] = useState("sauravjha491@gmail.com");
// // // // //   const [phone, setPhone] = useState("");
// // // // //   const [countryCode, setCountryCode] = useState("+1 United States / Canada");

// // // // //   const handleConfirmEmail = () => {
// // // // //     toast.success("Confirmation email sent!");
// // // // //   };

// // // // //   const handleSubmitPhone = () => {
// // // // //     if (!phone || phone.length < 6) {
// // // // //       return toast.error("Please enter a valid phone number!");
// // // // //     }
// // // // //     toast.success("Phone number submitted successfully!");
// // // // //   };

// // // // //   return (
// // // // //     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
// // // // //       <Toaster position="top-right" />
// // // // //       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

// // // // //       {/* ✅ EMAIL SECTION */}
// // // // //       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
// // // // //         <div className="flex justify-between items-center">
// // // // //           <h3 className="text-lg font-semibold">Email</h3>
// // // // //           <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
// // // // //             Verified
// // // // //           </span>
// // // // //         </div>

// // // // //         <label className="text-gray-400 text-sm mt-4 block">Email</label>
// // // // //         <input
// // // // //           value={email}
// // // // //           disabled
// // // // //           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
// // // // //         />

// // // // //         <div className="flex justify-end mt-4">
// // // // //           <button
// // // // //             onClick={handleConfirmEmail}
// // // // //             className="bg-green-600 hover:bg-green-700 px-5 py-2 text-sm rounded-md font-semibold"
// // // // //           >
// // // // //             Confirm Email
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* ✅ PHONE NUMBER SECTION */}
// // // // //       <div className="border border-[#1c2a38] rounded-md p-5">
// // // // //         <h3 className="text-lg font-semibold">Phone Number</h3>
// // // // //         <p className="text-gray-400 text-sm mt-1 mb-4">
// // // // //           We only service locations listed in country codes.
// // // // //         </p>

// // // // //         <label className="text-sm text-gray-300">Country Code *</label>
// // // // //         <select
// // // // //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// // // // //           value={countryCode}
// // // // //           onChange={(e) => setCountryCode(e.target.value)}
// // // // //         >
// // // // //           <option>+91 India</option>
// // // // //           <option>+1 United States / Canada</option>
// // // // //           <option>+44 United Kingdom</option>
// // // // //         </select>

// // // // //         <label className="text-sm text-gray-300 mt-4 block">Phone Number *</label>
// // // // //         <input
// // // // //           value={phone}
// // // // //           onChange={(e) => setPhone(e.target.value)}
// // // // //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// // // // //           placeholder="Enter phone number"
// // // // //         />

// // // // //         <div className="flex justify-end mt-4">
// // // // //           <button
// // // // //             onClick={handleSubmitPhone}
// // // // //             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
// // // // //           >
// // // // //             Submit
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Account;
// // // // "use client";
// // // // import React, { useState, useEffect } from "react";
// // // // import toast, { Toaster } from "react-hot-toast";
// // // // import { apiRequest } from "@/utils/ApiHelper";

// // // // const Account = () => {
// // // //   const [email, setEmail] = useState("");
// // // //   const [phone, setPhone] = useState("");
// // // //   const [countryCode, setCountryCode] = useState("+1");
// // // //   const [isEmailVerified, setIsEmailVerified] = useState(false);
// // // //   const [loading, setLoading] = useState(true);

// // // //   // =============================
// // // //   // 🔥 Fetch user details
// // // //   // =============================
// // // //   useEffect(() => {
// // // //     const fetchDetails = async () => {
// // // //       try {
// // // //         const token = localStorage.getItem("token");
// // // //         const id = localStorage.getItem("userId");

// // // //         const res = await apiRequest(`/users/${id}/details`, true, {
// // // //           method: "GET",
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         });

// // // //         if (res.success && res.data) {
// // // //           setEmail(res.data.email || "");
// // // //           setPhone(res.data.phone || "");
// // // //           setIsEmailVerified(res.data.isEmailVerified);
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("Fetch details error:", err);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchDetails();
// // // //   }, []);

// // // //   // ====================================
// // // //   // 🔥 Confirm Email (fake button here)
// // // //   // ====================================
// // // //   const handleConfirmEmail = () => {
// // // //     toast.success("Confirmation email sent!");
// // // //   };

// // // //   // ====================================
// // // //   // 🔥 Update Phone Number API
// // // //   // ====================================
// // // //   const handleSubmitPhone = async () => {
// // // //     if (!phone || phone.length < 6) {
// // // //       return toast.error("Please enter a valid phone number!");
// // // //     }

// // // //     try {
// // // //       const token = localStorage.getItem("token");

// // // //       const fullNumber = `${countryCode}${phone}`;

// // // //       const res = await apiRequest(`/users/update`, true, {
// // // //         method: "PUT",
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //         body: JSON.stringify({ phone: fullNumber }),
// // // //       });

// // // //       if (res.success) {
// // // //         toast.success("Phone number updated successfully!");
// // // //       } else {
// // // //         toast.error(res.message || "Failed to update phone number.");
// // // //       }
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       toast.error("Something went wrong.");
// // // //     }
// // // //   };

// // // //   if (loading) return <div className="text-white">Loading...</div>;

// // // //   return (
// // // //     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
// // // //       <Toaster position="top-right" />

// // // //       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

// // // //       {/* ===========================
// // // //           EMAIL SECTION
// // // //       ============================ */}
// // // //       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
// // // //         <div className="flex justify-between items-center">
// // // //           <h3 className="text-lg font-semibold">Email</h3>

// // // //           <span
// // // //             className={`px-2 py-1 text-xs rounded-md ${
// // // //               isEmailVerified ? "bg-green-600" : "bg-yellow-500"
// // // //             }`}
// // // //           >
// // // //             {isEmailVerified ? "Verified" : "Not Verified"}
// // // //           </span>
// // // //         </div>

// // // //         <label className="text-gray-400 text-sm mt-4 block">Email</label>
// // // //         <input
// // // //           value={email}
// // // //           disabled
// // // //           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
// // // //         />

// // // //         {!isEmailVerified && (
// // // //           <div className="flex justify-end mt-4">
// // // //             <button
// // // //               onClick={handleConfirmEmail}
// // // //               className="bg-green-600 hover:bg-green-700 px-5 py-2 text-sm rounded-md font-semibold"
// // // //             >
// // // //               Confirm Email
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ===========================
// // // //           PHONE SECTION
// // // //       ============================ */}
// // // //       <div className="border border-[#1c2a38] rounded-md p-5">
// // // //         <h3 className="text-lg font-semibold">Phone Number</h3>
// // // //         <p className="text-gray-400 text-sm mt-1 mb-4">
// // // //           We only service locations listed in country codes.
// // // //         </p>

// // // //         {/* Country Code */}
// // // //         <label className="text-sm text-gray-300">Country Code *</label>
// // // //         <select
// // // //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// // // //           value={countryCode}
// // // //           onChange={(e) => setCountryCode(e.target.value)}
// // // //         >
// // // //           <option value="+91">+91 India</option>
// // // //           <option value="+1">+1 United States / Canada</option>
// // // //           <option value="+44">+44 United Kingdom</option>
// // // //         </select>

// // // //         {/* Phone Number */}
// // // //         <label className="text-sm text-gray-300 mt-4 block">
// // // //           Phone Number *
// // // //         </label>
// // // //         <input
// // // //           value={phone}
// // // //           onChange={(e) => setPhone(e.target.value)}
// // // //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// // // //           placeholder="Enter phone number"
// // // //         />

// // // //         <div className="flex justify-end mt-4">
// // // //           <button
// // // //             onClick={handleSubmitPhone}
// // // //             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
// // // //           >
// // // //             Submit
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Account;
// // // "use client";

// // // import React, { useEffect, useState } from "react";
// // // import toast, { Toaster } from "react-hot-toast";
// // // import { apiRequest } from "@/utils/ApiHelper"; // <-- your helper for API calls

// // // const Account = () => {
// // //   const [email, setEmail] = useState("");
// // //   const [phone, setPhone] = useState("");
// // //   const [countryCode, setCountryCode] = useState("+1 United States / Canada");
// // //   const [isEmailVerified, setIsEmailVerified] = useState(false);

// // //   useEffect(() => {
// // //     const fetchUserDetails = async () => {
// // //       try {
// // //         const id = localStorage.getItem("userId");

// // //         const res = await apiRequest(`/users/${id}/details`, true, {
// // //           method: "GET",
// // //         });

// // //         if (res.success) {
// // //           const data = res.data;

// // //           // Set email, phone, verification status
// // //           setEmail(data?.email || "");
// // //           setPhone(data?.phone || "");
// // //           setIsEmailVerified(data?.email ? true : false);
// // //         }
// // //       } catch (err) {
// // //         console.error("Fetch error:", err);
// // //       }
// // //     };

// // //     fetchUserDetails();
// // //   }, []);

// // //   const handleConfirmEmail = () => {
// // //     toast.success("Confirmation email sent!");
// // //   };

// // //   const handleSubmitPhone = async () => {
// // //     if (!phone || phone.length < 6) {
// // //       return toast.error("Please enter a valid phone number!");
// // //     }

// // //     try {
// // //       const id = localStorage.getItem("userId");

// // //       const res = await apiRequest(`/users/${id}/details`, true, {
// // //         method: "PUT",
// // //         body: JSON.stringify({
// // //           phone: phone,
// // //           countryCode: countryCode.split(" ")[0], // only +91, +1, etc.
// // //         }),
// // //       });

// // //       if (res.success) {
// // //         toast.success("Phone number updated!");
// // //       } else {
// // //         toast.error(res.message || "Failed to update phone");
// // //       }
// // //     } catch (err) {
// // //       toast.error("Something went wrong!");
// // //     }
// // //   };

// // //   return (
// // //     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
// // //       <Toaster position="top-right" />
// // //       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

// // //       {/* EMAIL SECTION */}
// // //       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
// // //         <div className="flex justify-between items-center">
// // //           <h3 className="text-lg font-semibold">Email</h3>

// // //           {isEmailVerified && (
// // //             <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
// // //               Verified
// // //             </span>
// // //           )}
// // //         </div>

// // //         <label className="text-gray-400 text-sm mt-4 block">Email</label>
// // //         <input
// // //           value={email}
// // //           disabled
// // //           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
// // //         />

// // //         {!isEmailVerified && (
// // //           <div className="flex justify-end mt-4">
// // //             <button
// // //               onClick={handleConfirmEmail}
// // //               className="bg-green-600 hover:bg-green-700 px-5 py-2 text-sm rounded-md font-semibold"
// // //             >
// // //               Confirm Email
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* PHONE NUMBER SECTION */}
// // //       <div className="border border-[#1c2a38] rounded-md p-5">
// // //         <h3 className="text-lg font-semibold">Phone Number</h3>
// // //         <p className="text-gray-400 text-sm mt-1 mb-4">
// // //           We only service locations listed in country codes.
// // //         </p>

// // //         <label className="text-sm text-gray-300">Country Code *</label>
// // //         <select
// // //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// // //           value={countryCode}
// // //           onChange={(e) => setCountryCode(e.target.value)}
// // //         >
// // //           <option>+91 India</option>
// // //           <option>+1 United States / Canada</option>
// // //           <option>+44 United Kingdom</option>
// // //         </select>

// // //         <label className="text-sm text-gray-300 mt-4 block">
// // //           Phone Number *
// // //         </label>
// // //         <input
// // //           value={phone}
// // //           onChange={(e) => setPhone(e.target.value)}
// // //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// // //           placeholder="Enter phone number"
// // //         />

// // //         <div className="flex justify-end mt-4">
// // //           <button
// // //             onClick={handleSubmitPhone}
// // //             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
// // //           >
// // //             Submit
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Account;
// // "use client";

// // import React, { useEffect, useState } from "react";
// // import toast, { Toaster } from "react-hot-toast";
// // import {apiRequest} from "@/utils/ApiHelper"; // <-- your helper for API calls

// // const Account = () => {
// //   const [email, setEmail] = useState("");
// //   const [phone, setPhone] = useState("");
// //   const [countryCode, setCountryCode] = useState("+1 United States / Canada");
// //   const [isEmailVerified, setIsEmailVerified] = useState(false);

// //   useEffect(() => {
// //     const fetchUserDetails = async () => {
// //       try {
// //         const id = localStorage.getItem("userId");

// //         const res = await apiRequest(`/users/${id}/details`, true, {
// //           method: "GET",
// //         });

// //         if (res.success) {
// //           const data = res.data;
// //           setEmail(data?.email || "");
// //           setPhone(data?.phone || "");
// //           setIsEmailVerified(data?.email ? true : false);
// //         }
// //       } catch (err) {
// //         console.error("Fetch error:", err);
// //       }
// //     };

// //     fetchUserDetails();
// //   }, []);

// //   const handleConfirmEmail = () => {
// //     toast.success("Confirmation email sent!");
// //   };

// //   const handleSubmitPhone = async () => {
// //     if (!phone || phone.length < 6) {
// //       return toast.error("Please enter a valid phone number!");
// //     }

// //     try {
// //       const id = localStorage.getItem("userId");

// //       const res = await apiRequest(`/api/v1/users/update`, true, {
// //         method: "PUT",
// //         body: JSON.stringify({
// //           phone: phone,
// //           countryCode: countryCode.split(" ")[0],
// //         }),
// //       });

// //       if (res.success) {
// //         toast.success("Phone number updated!");
// //       } else {
// //         toast.error(res.message || "Failed to update phone");
// //       }
// //     } catch (err) {
// //       toast.error("Something went wrong!");
// //     }
// //   };

// //   return (
// //     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
// //       <Toaster position="top-right" />
// //       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

// //       {/* EMAIL SECTION */}
// //       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
// //         <div className="flex justify-between items-center">
// //           <h3 className="text-lg font-semibold">Email</h3>

// //           {isEmailVerified && (
// //             <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
// //               Verified
// //             </span>
// //           )}
// //         </div>

// //         <label className="text-gray-400 text-sm mt-4 block">Email</label>
// //         <input
// //           value={email}
// //           disabled
// //           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
// //         />

// //         <div className="flex justify-end mt-4">
// //           <button
// //             onClick={handleConfirmEmail}
// //             disabled={isEmailVerified}
// //             className={`px-5 py-2 text-sm rounded-md font-semibold transition
// //               ${
// //                 isEmailVerified
// //                   ? "bg-green-700 cursor-not-allowed opacity-50" // dull green (Stake-style)
// //                   : "bg-green-600 hover:bg-green-700"
// //               }
// //             `}
// //           >
// //             Confirm Email
// //           </button>
// //         </div>
// //       </div>

// //       {/* PHONE NUMBER SECTION */}
// //       <div className="border border-[#1c2a38] rounded-md p-5">
// //         <h3 className="text-lg font-semibold">Phone Number</h3>
// //         <p className="text-gray-400 text-sm mt-1 mb-4">
// //           We only service locations listed in country codes.
// //         </p>

// //         <label className="text-sm text-gray-300">Country Code *</label>
// //         <select
// //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// //           value={countryCode}
// //           onChange={(e) => setCountryCode(e.target.value)}
// //         >
// //           <option>+91 India</option>
// //           <option>+1 United States / Canada</option>
// //           <option>+44 United Kingdom</option>
// //         </select>

// //         <label className="text-sm text-gray-300 mt-4 block">
// //           Phone Number *
// //         </label>
// //         <input
// //           value={phone}
// //           onChange={(e) => setPhone(e.target.value)}
// //           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
// //           placeholder="Enter phone number"
// //         />

// //         <div className="flex justify-end mt-4">
// //           <button
// //             onClick={handleSubmitPhone}
// //             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
// //           >
// //             Submit
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Account;
// "use client";

// import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import {apiRequest} from "@/utils/ApiHelper";

// const Account = () => {
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [countryCode, setCountryCode] = useState("+1 United States / Canada");
//   const [isEmailVerified, setIsEmailVerified] = useState(false);

//   // ---------------------------
//   // Fetch user details on mount
//   // ---------------------------
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const id = localStorage.getItem("userId");
//         const token = localStorage.getItem("token");

//         const res = await apiRequest(`/users/${id}/details`, true, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.success) {
//           const data = res.data;

//           setEmail(data?.email || "");
//           setPhone(data?.phone || "");
//           setIsEmailVerified(data?.email ? true : false);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   // ---------------------------
//   // Confirm Email
//   // ---------------------------
//   const handleConfirmEmail = () => {
//     toast.success("Confirmation email sent!");
//   };

//   // ---------------------------
//   // Update Phone Number
//   // ---------------------------
//   const handleSubmitPhone = async () => {
//     if (!phone || phone.length < 6) {
//       return toast.error("Please enter a valid phone number!");
//     }

//     try {
//       const token = localStorage.getItem("token");

//       const apiBody = {
//         phone: `${countryCode.split(" ")[0]}${phone}`,
//       };

//       const res = await apiRequest(`/users/update`, true, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(apiBody),
//       });

//       if (res.success) {
//         toast.success("Phone number updated successfully!");
//       } else {
//         toast.error(res.message || "Failed to update phone");
//       }
//     } catch (err) {
//       toast.error("Something went wrong while updating phone");
//     }
//   };

//   return (
//     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
//       <Toaster position="top-right" />
//       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

//       {/* EMAIL SECTION */}
//       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Email</h3>

//           {email && (
//             <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
//               Verified
//             </span>
//           )}
//         </div>

//         <label className="text-gray-400 text-sm mt-4 block">Email</label>
//         <input
//           value={email}
//           disabled
//           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleConfirmEmail}
//             disabled={isEmailVerified}
//             className={`px-5 py-2 text-sm rounded-md font-semibold transition
//               ${
//                 isEmailVerified
//                   ? "bg-green-700 cursor-not-allowed opacity-50" // dull green (Stake style)
//                   : "bg-green-600 hover:bg-green-700"
//               }
//             `}
//           >
//             Confirm Email
//           </button>
//         </div>
//       </div>

//       {/* PHONE SECTION */}
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
//           <option>+91 India</option>
//           <option>+1 United States / Canada</option>
//           <option>+44 United Kingdom</option>
//         </select>

//         <label className="text-sm text-gray-300 mt-4 block">
//           Phone Number *
//         </label>
//         <input
//           value={phone.replace(countryCode.split(" ")[0], "")}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1"
//           placeholder="Enter phone number"
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleSubmitPhone}
//             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-semibold"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Account;
// "use client";

// import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import {apiRequest} from "@/utils/ApiHelper";

// const Account = () => {
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [countryCode, setCountryCode] = useState("+1 United States / Canada");
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false);

//   // Fetch user details
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const id = localStorage.getItem("userId");
//         const token = localStorage.getItem("token");

//         const res = await apiRequest(`/users/${id}/details`, true, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.success) {
//           const data = res.data;

//           setEmail(data?.email || "");
//           setPhone(data?.phone || "");
//           setIsEmailVerified(!!data?.email);
//           setIsPhoneVerified(!!data?.phone);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   // Confirm email (fake action)
//   const handleConfirmEmail = () => {
//     toast.success("Confirmation email sent!");
//   };

//   // Update phone
//   const handleSubmitPhone = async () => {
//     if (!phone || phone.length < 6) {
//       return toast.error("Please enter a valid phone number!");
//     }

//     try {
//       const token = localStorage.getItem("token");

//       const finalPhone = `${countryCode.split(" ")[0]}${phone}`;

//       const res = await apiRequest(`/users/update`, true, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ phone: finalPhone }),
//       });

//       if (res.success) {
//         toast.success("Phone number updated successfully!");
//         setIsPhoneVerified(true); // lock phone like Stake
//       } else {
//         toast.error(res.message || "Failed to update phone");
//       }
//     } catch (err) {
//       toast.error("Something went wrong while updating phone");
//     }
//   };

//   return (
//     <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
//       <Toaster position="top-right" />
//       <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

//       {/* ================= EMAIL ================= */}
//       <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Email</h3>

//           {email && (
//             <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
//               Verified
//             </span>
//           )}
//         </div>

//         <label className="text-gray-400 text-sm mt-4 block">Email</label>
//         <input
//           value={email}
//           disabled
//           className="w-full bg-[#1a2c38] px-3 py-2 rounded-md text-gray-300 border border-[#233341] mt-1"
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleConfirmEmail}
//             disabled={isEmailVerified}
//             className={`px-5 py-2 text-sm rounded-md font-semibold 
//               ${
//                 isEmailVerified
//                   ? "bg-green-700 cursor-not-allowed opacity-50"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//           >
//             Confirm Email
//           </button>
//         </div>
//       </div>

//       {/* ================= PHONE ================= */}
//       <div className="border border-[#1c2a38] rounded-md p-5">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Phone Number</h3>

          
//         </div>

//         <p className="text-gray-400 text-sm mt-1 mb-4">
//           We only service locations listed in country codes.
//         </p>

//         <label className="text-sm text-gray-300">Country Code *</label>
//         <select
//           disabled={isPhoneVerified}
//           className={`w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1 
//             ${isPhoneVerified && "opacity-50 cursor-not-allowed"}`}
//           value={countryCode}
//           onChange={(e) => setCountryCode(e.target.value)}
//         >
//           <option>+91 India</option>
//           <option>+1 United States / Canada</option>
//           <option>+44 United Kingdom</option>
//         </select>

//         <label className="text-sm text-gray-300 mt-4 block">Phone Number *</label>
//         <input
//           value={
//             isPhoneVerified
//               ? phone // full number
//               : phone.replace(countryCode.split(" ")[0], "")
//           }
//           disabled={isPhoneVerified}
//           onChange={(e) => setPhone(e.target.value)}
//           className={`w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1 
//             ${isPhoneVerified && "opacity-50 cursor-not-allowed"}`}
//           placeholder="Enter phone number"
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleSubmitPhone}
//             disabled={isPhoneVerified}
//             className={`px-6 py-2 rounded-md font-semibold 
//               ${
//                 isPhoneVerified
//                   ? "bg-green-700 cursor-not-allowed opacity-50"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//           >
//             {isPhoneVerified ? "Verified" : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Account;
"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "@/utils/ApiHelper";

const Account = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // store raw digits only
  const [countryCode, setCountryCode] = useState("+1 United States / Canada");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const res = await apiRequest(`/users/${id}/details`, true, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.success) {
          const data = res.data;

          setEmail(data?.email || "");

          // Extract raw number (remove leading +code)
          const rawPhone = data?.phone?.replace(/^\+\d+/, "") || "";
          setPhone(rawPhone);

          setIsEmailVerified(!!data?.email);
          setIsPhoneVerified(!!data?.phone);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUserDetails();
  }, []);

  // Confirm email (fake)
  const handleConfirmEmail = () => {
    toast.success("Confirmation email sent!");
  };

  // Submit phone update
  const handleSubmitPhone = async () => {
    if (!phone || phone.length < 6) {
      return toast.error("Please enter a valid phone number!");
    }

    try {
      const token = localStorage.getItem("token");

      const prefix = countryCode.split(" ")[0]; // e.g. "+1"
      const finalPhone = `${prefix}${phone}`; // add ONLY once

      const res = await apiRequest(`/users/update`, true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: finalPhone }),
      });

      if (res.success) {
        toast.success("Phone number updated successfully!");
        setIsPhoneVerified(true);
      } else {
        toast.error(res.message || "Failed to update phone");
      }
    } catch (err) {
      toast.error("Something went wrong while updating phone");
    }
  };

  return (
    <div className="bg-[#101b22dd] rounded-lg p-6 border border-[#1c2a38]">
      <Toaster position="top-right" />
      <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

      {/* ================= EMAIL ================= */}
      <div className="border border-[#1a2c38] rounded-md p-5 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Email</h3>

          {email && (
            <span className="bg-green-600 px-2 py-1 text-xs rounded-md">
              Verified
            </span>
          )}
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
            disabled={isEmailVerified}
            className={`px-5 py-2 text-sm rounded-md font-semibold 
              ${
                isEmailVerified
                  ? "bg-green-700 cursor-not-allowed opacity-50"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            Confirm Email
          </button>
        </div>
      </div>

      {/* ================= PHONE ================= */}
      <div className="border border-[#1c2a38] rounded-md p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Phone Number</h3>
        </div>

        <p className="text-gray-400 text-sm mt-1 mb-4">
          We only service locations listed in country codes.
        </p>

        {/* Country code */}
        <label className="text-sm text-gray-300">Country Code *</label>
        <select
          disabled={isPhoneVerified}
          className={`w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1 
            ${isPhoneVerified && "opacity-50 cursor-not-allowed"}`}
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option>+91 India</option>
          <option>+1 United States / Canada</option>
          <option>+44 United Kingdom</option>
        </select>

        {/* Phone Input */}
        <label className="text-sm text-gray-300 mt-4 block">Phone Number *</label>
        <input
          value={phone} // always raw (no +1)
          disabled={isPhoneVerified}
          onChange={(e) => setPhone(e.target.value)}
          className={`w-full bg-[#1a2c38] border border-[#233341] px-3 py-2 rounded-md text-gray-300 mt-1 
            ${isPhoneVerified && "opacity-50 cursor-not-allowed"}`}
          placeholder="Enter phone number"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitPhone}
            disabled={isPhoneVerified}
            className={`px-6 py-2 rounded-md font-semibold 
              ${
                isPhoneVerified
                  ? "bg-green-700 cursor-not-allowed opacity-50"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {isPhoneVerified ? "Verified" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
