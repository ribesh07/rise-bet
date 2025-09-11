
// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { apiRequest } from "@/utils/ApiHelper";
// import toast from "react-hot-toast";
// import Image from "next/image"; // ✅ Import Image

// interface dataType {
//   success: boolean;
//   message: string;
//   data: {
//     access_token?: string;
//     token_type?: string;
//   } | null;
// }

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [data, setData] = useState<dataType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [remember, setRemember] = useState(false);

//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await apiRequest("/auth/login", false, {
//         method: "POST",
//         body: JSON.stringify({ email, password }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Login Response:", res);
//       setData(res);

//       if (res.success) {
//         toast.success("Login successful!");
//         if (res.data?.access_token) {
//           localStorage.setItem("token", res.data.access_token);
//         }
//         router.push("/home"); 
//       } else {
//         toast.error("Login failed!");
//       }
//     } catch (error) {
//       toast.error("Login failed!");
//       console.error("Login Error:", error);
//       setData({
//         success: false,
//         message: "Something went wrong!",
//         data: null,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 shadow-lg">
        
//         {/* ✅ Replace text with Logo */}
//         <div className="flex justify-center mb-6">
//           <Image
//             src="/logo.png" // <-- place your logo in public/logo.png
//             alt="LuckyWorld Logo"
//             width={120}
//             height={120}
//             className="rounded"
//           />
//         </div>

//         <form onSubmit={handleLogin} className="space-y-6">

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
        
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-md disabled:opacity-60"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Don’t have an account?{" "}
//           <Link href="/auth/signup" passHref>
//             <button className="text-blue-600 hover:underline">
//               Register now
//             </button>
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApiHelper";
import toast from "react-hot-toast";
import Image from "next/image";

interface dataType {
  success: boolean;
  message: string;
  data: {
    access_token?: string;
    token_type?: string;
  } | null;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setData] = useState<dataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiRequest("/auth/login", false, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      setData(res);

      if (res.success) {
        toast.success("Login successful!");
        if (res.data?.access_token) localStorage.setItem("token", res.data.access_token);
        router.push("/home");
      } else {
        toast.error(res.message || "Login failed!");
      }
    } catch (error) {
      toast.error("Login failed!");
      setData({ success: false, message: "Something went wrong!", data: null });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="LuckyWorld Logo" width={120} height={120} className="rounded" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {/* Show/Hide Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 select-none">Remember me</span>
            </label>

            <a href="#" className="text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-md disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link href="/auth/signup" passHref>
            <button className="text-blue-600 hover:underline">Register now</button>
          </Link>
        </p>
      </div>
    </main>
  );
}
