"use client";
// import { useState } from "react";

// export default function SignupPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
//       {/* Card */}
//       <div className="w-[420px] rounded-md bg-gray-200 shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between bg-[#2f2f2f] px-4 py-2">
//           <h1 className="text-lg font-semibold text-white">Rise</h1>
//           <button className="text-gray-400 hover:text-white">✕</button>
//         </div>

//         {/* Body */}
//         <div className="px-8 py-6">
//           {/* Full Name */}
//           <label className="block text-sm font-medium text-gray-800">
//             Full Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             className="mt-1 w-full rounded-sm border border-gray-300 bg-white p-2 focus:border-blue-500 focus:outline-none"
//           />

//           {/* Email */}
//           <label className="mt-4 block text-sm font-medium text-gray-800">
//             Email <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             className="mt-1 w-full rounded-sm border border-gray-300 bg-white p-2 focus:border-blue-500 focus:outline-none"
//           />

//           {/* Password */}
//           <label className="mt-4 block text-sm font-medium text-gray-800">
//             Password<span className="text-red-500">*</span>
//           </label>
//           <div className="relative mt-1">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="w-full rounded-sm border border-gray-300 bg-white p-2 pr-10 focus:border-blue-500 focus:outline-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <label className="mt-4 block text-sm font-medium text-gray-800">
//             Confirm Password<span className="text-red-500">*</span>
//           </label>
//           <div className="relative mt-1">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               className="w-full rounded-sm border border-gray-300 bg-white p-2 pr-10 focus:border-blue-500 focus:outline-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
//             >
//               {showConfirmPassword ? "🙈" : "👁️"}
//             </button>
//           </div>

//           {/* Register */}
//           <button className="mt-6 w-full rounded-sm bg-[#007bff] py-2 font-medium text-white hover:bg-[#0069d9]">
//             Register
//           </button>

//           {/* Divider */}
//           <div className="my-4 flex items-center text-gray-500">
//             <hr className="flex-1 border-gray-400" />
//             <span className="px-2 text-sm">OR</span>
//             <hr className="flex-1 border-gray-400" />
//           </div>

//           {/* Back to Login */}
//           <div className="text-center text-sm text-gray-600">
//             Already have an account?{" "}
//             <a href="#" className="text-gray-700 hover:underline">
//               Sign in
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="w-[420px] rounded-md bg-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#2f2f2f] px-4 py-2">
          <h1 className="text-lg font-semibold text-white">Rise</h1>
          <button className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {/* Email/Username */}
          <label className="block text-sm font-medium text-gray-800">
            Email or Username<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-sm border border-gray-300 bg-white p-2 focus:border-blue-500 focus:outline-none"
          />

          {/* Password */}
          <label className="mt-4 block text-sm font-medium text-gray-800">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-sm border border-gray-300 bg-white p-2 pr-10 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Sign In */}
          <button className="mt-6 w-full rounded-sm bg-[#007bff] py-2 font-medium text-white hover:bg-[#0069d9]">
            Sign in
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center text-gray-500">
            <hr className="flex-1 border-gray-400" />
            <span className="px-2 text-sm">OR</span>
            <hr className="flex-1 border-gray-400" />
          </div>

          {/* Sign in with Google */}
          <button className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Sign in with Google
          </button>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-gray-700 hover:underline">
              Forgot Password
            </a>
          </div>

          {/* Register */}
          <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/user/login" passHref>
            <button className="text-blue-600 hover:underline">
              Login now
            </button>
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}
