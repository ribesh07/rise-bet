// "use client";
// import Link from "next/link";
// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [remember, setRemember] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Add your login logic here
//     alert(`Logging in with ${email}`);
//   };

//   return (
//     <main className="min-h-screen bg-black flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 shadow-lg">
//         <h1 className="text-white text-3xl font-extrabold mb-6 text-center">
//           Login to LuckyWorld
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="********"
//               className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="inline-flex items-center text-sm text-gray-400 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={remember}
//                 onChange={() => setRemember(!remember)}
//                 className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600"
//               />
//               <span className="ml-2 select-none">Remember me</span>
//             </label>

//             <a
//               href="#"
//               className="text-sm text-blue-600 hover:underline cursor-pointer"
//             >
//               Forgot Password?
//             </a>
//           </div>
//           <Link href="/user/home" passHref>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-md"
//             >
//               Login
//             </button>
//           </Link>
//         </form>

//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Don’t have an account?{" "}
//           <Link href="/user/signup" passHref>
//            <button className="text-blue-600 hover:underline">
//               Register now
//             </button>
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }
// "use client";
// import { useState } from "react";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
//       <div className="w-[400px] rounded-md bg-gray-200 shadow-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b bg-gray-800 px-4 py-2 text-white">
//           <h1 className="text-lg font-semibold">Rise</h1>
//           <button className="text-gray-300 hover:text-white">✕</button>
//         </div>

//         {/* Form */}
//         <div className="p-6">
//           {/* Email/Username */}
//           <label className="block text-sm font-medium text-gray-800">
//             Email or Username<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter email or username"
//             className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
//           />

//           {/* Password */}
//           <label className="mt-4 block text-sm font-medium text-gray-800">
//             Password<span className="text-red-500">*</span>
//           </label>
//           <div className="relative mt-1">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter password"
//               className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:outline-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </button>
//           </div>

//           {/* Sign In */}
//           <button className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700">
//             Sign in
//           </button>

//           {/* Divider */}
//           <div className="my-4 flex items-center">
//             <hr className="flex-1 border-gray-400" />
//             <span className="px-2 text-gray-600">OR</span>
//             <hr className="flex-1 border-gray-400" />
//           </div>

//           {/* Forgot Password */}
//           <div className="text-center">
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot Password
//             </a>
//           </div>

//           {/* Register */}
//           <div className="mt-3 text-center text-sm text-gray-600">
//             Don’t have an account?{" "}
//             <a href="#" className="font-medium text-blue-600 hover:underline">
//               Register an Account
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import Link from "next/link";
import { useState } from "react";

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

          {/* Forgot Password */}
          <div className="text-center">
            <a href="#" className="text-sm text-gray-700 hover:underline">
              Forgot Password
            </a>
          </div>

          {/* Register */}
           <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link href="/user/signup" passHref>
           <button className="text-blue-600 hover:underline">
              Register now
            </button>
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
