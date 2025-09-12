
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




export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState(""); // can be email or username
  const [password, setPassword] = useState("");
  const [, setData] = useState<dataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const router = useRouter();

 

 

  // Simple email validation regex
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = login.includes("@");

      // Validate email if user typed '@'
      if (isEmail && !isValidEmail(login)) {
        toast.error("Please enter a valid email address!");
        setLoading(false);
        return;
      }

      const bodyData = isEmail
        ? { email: login, password }
        : { username: login, password };

      const res = await apiRequest("/auth/login", false, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: { "Content-Type": "application/json" },
      });

      setData(res);

      if (res.success) {
        toast.success("Login successful!");
        if (res.data?.access_token) {
          localStorage.setItem("token", res.data.access_token);
        }
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
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 relative">
      {/* Language Selector Top Right */}
      

      <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Rise Logo"
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
