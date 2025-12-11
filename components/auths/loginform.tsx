
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiRequest } from "@/utils/ApiHelper";
// import toast from "react-hot-toast";

// interface LoginFormProps {
//   onSuccess?: () => void;
//   onSwitch?: () => void; // Prop for switching to signup
// }

// export const LoginForm = ({ onSuccess, onSwitch }: LoginFormProps) => {
//   const [login, setLogin] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await apiRequest("/auth/login", false, {
//         method: "POST",
//         body: JSON.stringify({ email: login, password }),
//         headers: { "Content-Type": "application/json" },
//       });

//       console.log("Login response:", res);

//       if (res.success) {
//         localStorage.setItem("token", res.data?.access_token || "");
//         toast.success("Login successful!");

//         // ✅ ALWAYS redirect to /home
//         router.push("/home");

//         // optional callback
//         if (onSuccess) onSuccess();
//       } else {
//         toast.error(res.message || "Invalid credentials!");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Login failed, please try again!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleLogin} className="space-y-4">
//       {/* Email/Username */}
//       <input
//         type="text"
//         placeholder="Email or Username"
//         value={login}
//         onChange={(e) => setLogin(e.target.value)}
//         required
//         className="w-full px-4 py-3 rounded-md border border-[#333] bg-[#1a1c2d] text-white font-semibold placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />

//       {/* Password */}
//       <div className="relative">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full px-4 py-3 pr-12 rounded-md border border-[#333] bg-[#1a1c2d] text-white font-semibold placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
//         >
//           {showPassword ? "👁️" : "🙈"}
//         </button>
//       </div>

//       {/* Forgot Password */}
//       <div className="text-left">
//         <a href="#" className="text-white font-semibold hover:underline">
//           Forgot Password?
//         </a>
//       </div>

//       {/* Sign In */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold transition disabled:opacity-50"
//       >
//         {loading ? "Logging in..." : "Sign In"}
//       </button>

//       {/* Divider */}
//       <div className="flex items-center my-4">
//         <hr className="flex-1 border-gray-600" />
//         <span className="px-2 text-gray-400 text-sm">OR</span>
//         <hr className="flex-1 border-gray-600" />
//       </div>

//       {/* Alternative Sign-in buttons */}
//       <div className="space-y-3">
//         <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#2b2f42] rounded-md text-white font-semibold hover:bg-[#3a3f5c] transition">
//           <span>🗝️</span> Sign In with Passkey
//         </button>
//         <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#2b2f42] rounded-md text-white font-semibold hover:bg-[#3a3f5c] transition">
//           <img src="/icons/google.svg" className="w-5 h-5" alt="Google" />
//           Sign In with Google
//         </button>
//         <button className="w-full py-3 bg-[#2b2f42] rounded-md text-white font-semibold hover:bg-[#3a3f5c] transition">
//           Sign In another way
//         </button>
//       </div>

//       {/* Switch to Signup */}
//       {onSwitch && (
//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Don't have an account?{" "}
//           <button onClick={onSwitch} className="text-[#00c2ff] hover:underline">
//             Sign up
//           </button>
//         </p>
//       )}
//     </form>
//   );
// };
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApiHelper";
import toast from "react-hot-toast";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitch?: () => void; // Switch to signup
}

export const LoginForm = ({ onSuccess, onSwitch }: LoginFormProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
  const res = await apiRequest("/auth/login", false, {
    method: "POST",
    body: JSON.stringify({ email: login, password }),
    headers: { "Content-Type": "application/json" },
  });

  console.log("Login response:", res);

  if (res.success) {
    const token = res.data.access_token || "";
    console.log("Extracted token:", token);

    if (!token) {
      toast.error("Login succeeded but token missing. Contact support.");
      return;
    }

    // Save token properly
    localStorage.setItem("token", token);
    //vsdk saavev hai token kaarke
    // If userId is missing because data is empty, avoid setting empty ID
    if (res.data.rest?.data?.id) {
      localStorage.setItem("userId", res.data.rest?.data.id);
    }

    toast.success("Login successful!");

    router.push("/home");
    if (onSuccess) onSuccess();
  } else {
    toast.error(res.message || "Invalid credentials!");
  }
} catch (err) {
  console.error(err);
  toast.error("Login failed, please try again!");
} finally {
  setLoading(false);
}
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Email/Username */}
      <input
        type="text"
        placeholder="Email or Username"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-md border border-[#333] bg-[#1a1c2d] text-white font-semibold placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 pr-12 rounded-md border border-[#333] bg-[#1a1c2d] text-white font-semibold placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          {showPassword ? "👁️" : "🙈"}
        </button>
      </div>

      {/* Forgot Password */}
      <div className="text-left">
        <a href="#" className="text-white font-semibold hover:underline">
          Forgot Password?
        </a>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Sign In"}
      </button>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-1 border-gray-600" />
        <span className="px-2 text-gray-400 text-sm">OR</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      {/* Alternative Login */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#2b2f42] rounded-md text-white font-semibold hover:bg-[#3a3f5c] transition">
          <span>🗝️</span> Sign In with Passkey
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#2b2f42] rounded-md text-white font-semibold hover:bg-[#3a3f5c] transition">
          <img src="/icons/google.svg" className="w-5 h-5" alt="Google" />
          Sign In with Google
        </button>
        <button className="w-full py-3 bg-[#2b2f42] rounded-md text-white font-semibold hover:bg-[#3a3f5c] transition">
          Sign In another way
        </button>
      </div>

      {/* Switch to Signup */}
      {onSwitch && (
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-[#00c2ff] hover:underline">
            Sign up
          </button>
        </p>
      )}
    </form>
  );
};
