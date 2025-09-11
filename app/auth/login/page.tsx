
// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { apiRequest } from "@/utils/ApiHelper";
// import toast from "react-hot-toast";
// import Image from "next/image";

// interface dataType {
//   success: boolean;
//   message: string;
//   data: {
//     access_token?: string;
//     token_type?: string;
//   } | null;
// }

// // List of languages
// const languages = [
//   { code: "en", label: "English" },
//   { code: "es", label: "Español" },
//   { code: "fr", label: "Français" },
//   { code: "de", label: "Deutsch" },
//   { code: "pt", label: "Português" },
//   { code: "ru", label: "Русский" },
//   { code: "zh", label: "中文" },
//   { code: "ja", label: "日本語" },
//   { code: "ko", label: "한국어" },
//   { code: "ar", label: "العربية" },
//   { code: "hi", label: "हिन्दी" },
// ];

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [, setData] = useState<dataType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [remember, setRemember] = useState(false);

//   const router = useRouter();

//   // Language selector
//   const [langDropdown, setLangDropdown] = useState(false);
//   const [selectedLang, setSelectedLang] = useState("en");
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Load language from localStorage if exists
//     const storedLang = localStorage.getItem("language");
//     if (storedLang) setSelectedLang(storedLang);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setLangDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await apiRequest("/auth/login", false, {
//         method: "POST",
//         body: JSON.stringify({ email, password }),
//         headers: { "Content-Type": "application/json" },
//       });
//       setData(res);

//       if (res.success) {
//         toast.success("Login successful!");
//         if (res.data?.access_token)
//           localStorage.setItem("token", res.data.access_token);
//         router.push("/home");
//       } else {
//         toast.error(res.message || "Login failed!");
//       }
//     } catch (error) {
//       toast.error("Login failed!");
//       setData({ success: false, message: "Something went wrong!", data: null });
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectLanguage = (code: string) => {
//     setSelectedLang(code);
//     localStorage.setItem("language", code);
//     setLangDropdown(false);
//     toast.success(`Language set to ${languages.find(l => l.code === code)?.label}`);
//   };

//   return (
//     <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 relative">
//       {/* Language Selector Top Right */}
//       <div className="absolute top-4 right-4" ref={dropdownRef}>
//         <button
//           onClick={() => setLangDropdown(!langDropdown)}
//           className="bg-[#1a1a1a] text-white px-3 py-2 rounded-md border border-gray-700 hover:bg-[#333] transition"
//         >
//           {languages.find((l) => l.code === selectedLang)?.label}
//         </button>
//         {langDropdown && (
//           <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
//             {languages.map((lang) => (
//               <button
//                 key={lang.code}
//                 onClick={() => selectLanguage(lang.code)}
//                 className={`w-full text-left px-4 py-2 text-white hover:bg-[#333] ${
//                   selectedLang === lang.code ? "bg-[#00c2ff] text-black font-semibold" : ""
//                 }`}
//               >
//                 {lang.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl p-8 shadow-lg">
//         <div className="flex justify-center mb-6">
//           <Image
//             src="/logo.png"
//             alt="LuckyWorld Logo"
//             width={120}
//             height={120}
//             className="rounded"
//           />
//         </div>

//         <form onSubmit={handleLogin} className="space-y-6">
//           {/* Email */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full rounded-md bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="********"
//               className="w-full rounded-md bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 pr-14 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-9 text-gray-400 hover:text-gray-200 text-sm"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           {/* Remember & Forgot */}
//           <div className="flex items-center justify-between">
//             <label className="inline-flex items-center text-sm text-gray-400 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={remember}
//                 onChange={() => setRemember(!remember)}
//                 className="rounded border-gray-600 bg-[#0f0f0f] text-[#00c2ff] focus:ring-[#00c2ff]"
//               />
//               <span className="ml-2 select-none">Remember me</span>
//             </label>

//             <a href="#" className="text-sm text-[#00c2ff] hover:underline cursor-pointer">
//               Forgot Password?
//             </a>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#00c2ff] hover:bg-[#00aadd] transition text-black font-semibold py-3 rounded-md disabled:opacity-60"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Don’t have an account?{" "}
//           <Link href="/auth/signup" passHref>
//             <span className="text-[#00c2ff] hover:underline">Register now</span>
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
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

// List of languages
const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState(""); // can be email or username
  const [password, setPassword] = useState("");
  const [, setData] = useState<dataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const router = useRouter();

  // Language selector
  const [langDropdown, setLangDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load language from localStorage if exists
    const storedLang = localStorage.getItem("language");
    if (storedLang) setSelectedLang(storedLang);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiRequest("/auth/login", false, {
        method: "POST",
        body: JSON.stringify({ login, password }),
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

  const selectLanguage = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem("language", code);
    setLangDropdown(false);
    toast.success(`Language set to ${languages.find(l => l.code === code)?.label}`);
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 relative">
      {/* Language Selector Top Right */}
      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setLangDropdown(!langDropdown)}
          className="bg-[#1a1a1a] text-white px-3 py-2 rounded-md border border-gray-700 hover:bg-[#333] transition"
        >
          {languages.find((l) => l.code === selectedLang)?.label}
        </button>
        {langDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-white hover:bg-[#333] ${
                  selectedLang === lang.code ? "bg-[#00c2ff] text-black font-semibold" : ""
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="LuckyWorld Logo"
            width={120}
            height={120}
            className="rounded"
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Login (email or username) */}
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              id="login"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Email or Username"
              className="w-full rounded-md bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
            />
          </div>

          {/* Password */}
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
              className="w-full rounded-md bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 pr-14 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="rounded border-gray-600 bg-[#0f0f0f] text-[#00c2ff] focus:ring-[#00c2ff]"
              />
              <span className="ml-2 select-none">Remember me</span>
            </label>

            <a href="#" className="text-sm text-[#00c2ff] hover:underline cursor-pointer">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00c2ff] hover:bg-[#00aadd] transition text-black font-semibold py-3 rounded-md disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link href="/auth/signup" passHref>
            <span className="text-[#00c2ff] hover:underline">Register now</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
