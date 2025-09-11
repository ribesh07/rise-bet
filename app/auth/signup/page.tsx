
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApiHelper";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

// --- Password strength helpers ---
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
}

function strengthLabel(score: number) {
  switch (score) {
    case 0:
    case 1:
      return { label: "Weak", color: "bg-red-600" };
    case 2:
      return { label: "Fair", color: "bg-yellow-500" };
    case 3:
      return { label: "Good", color: "bg-blue-600" };
    case 4:
      return { label: "Strong", color: "bg-green-600" };
    default:
      return { label: "", color: "" };
  }
}

type dataType = {
  success: boolean;
  message: string;
  data: {
    access_token?: string;
    token_type?: string;
  } | null;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<dataType | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setPasswordScore(getPasswordStrength(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error("You must agree to the Terms & Conditions.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwordScore < 3) {
      toast.error("Please use a stronger password.");
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest("/auth/signup", false, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup Response:", res);
      setData(res);

      if (res.success) {
        toast.success("Signup successful!");
        if (res.data?.access_token) {
          localStorage.setItem("token", res.data.access_token);
        }
        router.push("/home");
      } else {
        toast.error(res.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Something went wrong!");
      setData({ success: false, message: "Something went wrong!", data: null });
    } finally {
      setLoading(false);
    }
  };

  const { label, color } = strengthLabel(passwordScore);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 shadow-lg">
        {/* ✅ Replace text with Logo */}
                <div className="flex justify-center mb-6">
                  <Image
                    src="/logo.png" // <-- place your logo in public/logo.png
                    alt="LuckyWorld Logo"
                    width={120}
                    height={120}
                    className="rounded"
                  />
                </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 pr-10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="mt-2">
                <div className="flex space-x-1">
                  {[0, 1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-sm ${
                        level < passwordScore ? color : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-sm mt-1 ${color.replace("bg-", "text-")}`}>
                  {label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 pr-10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <label className="inline-flex items-center text-sm text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-md disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Register"}
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center text-gray-500">
            <hr className="flex-1 border-gray-600" />
            <span className="px-2 text-sm">OR</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={() => toast("Google signup not yet connected")}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-700 bg-gray-800 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Sign up with Google
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" passHref>
            <button className="text-blue-600 hover:underline">
              Login now
            </button>
          </Link>
        </p>
      </div>
    </main>
  );
}
