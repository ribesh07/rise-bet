
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApiHelper";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
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

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitch?: () => void;
}

export const SignupForm = ({ onSuccess, onSwitch }: SignupFormProps) => {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPhone, setShowPhone] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordScore, setPasswordScore] = useState(0);
  useEffect(() => {
    setPasswordScore(getPasswordStrength(password));
  }, [password]);

  const { label, color } = strengthLabel(passwordScore);
  const isValidEmail = /\S+@\S+\.\S+/.test(email);
  const isPhoneValid = phone ? isPossiblePhoneNumber(phone) : true;

  const isFormValid =
    username &&
    isValidEmail &&
    dob &&
    password === confirmPassword &&
    passwordScore >= 3 &&
    (showPhone ? isPhoneValid : true);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!acceptedTerms) {
      toast.error("You must accept the terms and conditions.");
      return;
    }
    setLoading(true);

    try {
      const res = await apiRequest("/auth/signup", false, {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
          password,
          dob,
          phone,
          referral,
        }),
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup result:", res);

      if (res.success) {
        toast.success("Signup successful!");
        if (res.data?.access_token) localStorage.setItem("token", res.data.access_token);

        // ✅ ALWAYS route to home
        router.push("/home");

        // Optional callback after redirect
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || "Signup failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0f172a] rounded-2xl p-8 shadow-lg relative">
      <div className="flex flex-col items-center mb-6">
        <div className="flex space-x-2 mb-4">
          <div className={`w-40 h-2 rounded-full ${step >= 1 ? "bg-green-500" : "bg-gray-700"}`} />
          <div className={`w-40 h-2 rounded-full ${step >= 2 ? "bg-green-500" : "bg-gray-700"}`} />
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleContinue} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-lg bg-[#0f0f0f] border px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 ${
              isValidEmail ? "border-gray-700 text-white focus:ring-[#00c2ff]" : "border-red-500 text-red-400"
            }`}
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 pr-10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {password && (
            <div>
              <div className="flex space-x-1">
                {[0, 1, 2, 3].map((level) => (
                  <div key={level} className={`h-1 flex-1 rounded ${level < passwordScore ? color : "bg-gray-700"}`} />
                ))}
              </div>
              <p className={`text-xs mt-1 ${color.replace("bg-", "text-")}`}>{label}</p>
            </div>
          )}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-lg bg-[#0f0f0f] border px-4 py-3 pr-10 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                password === confirmPassword
                  ? "border-gray-700 text-white focus:ring-[#00c2ff]"
                  : "border-red-500 text-red-400"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
            required
          />

          <div>
            <label className="flex items-center text-sm text-gray-400">
              <input type="checkbox" checked={showPhone} onChange={() => setShowPhone(!showPhone)} className="mr-2" />
              Add Phone Number
            </label>
            {showPhone && (
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={(value) => setPhone(value || "")}
                className={`phone-input w-full mt-2 ${phone && !isPhoneValid ? "border-red-500" : ""}`}
              />
            )}
            {phone && !isPhoneValid && <p className="text-xs text-red-500 mt-1">Invalid phone number</p>}
          </div>

          <div>
            <label className="flex items-center text-sm text-gray-400">
              <input type="checkbox" checked={showReferral} onChange={() => setShowReferral(!showReferral)} className="mr-2" />
              Add Referral Code
            </label>
            {showReferral && (
              <input
                type="text"
                placeholder="Referral Code"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="mt-2 w-full rounded-lg bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#00c2ff] hover:bg-[#00aadd] text-black font-bold py-3 rounded-lg transition disabled:opacity-60"
          >
            Continue
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-white text-lg font-semibold">Terms & Conditions</h2>
          <div className="h-48 overflow-y-auto p-3 border border-gray-700 rounded-lg text-gray-300 text-sm bg-[#0f0f0f]">
            <p>By registering, you agree to our platform’s Terms of Service and Privacy Policy.</p>
            <p className="mt-2">Please review these carefully before proceeding.</p>
          </div>
          <label className="flex items-center text-gray-300">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mr-2"
            />
            I agree to the Terms and Conditions
          </label>
          <button
            onClick={handleRegister}
            disabled={!acceptedTerms || loading}
            className="w-full bg-[#00c2ff] hover:bg-[#00aadd] text-black font-bold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      )}

      {onSwitch && (
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-[#00c2ff] hover:underline">
            Login now
          </button>
        </p>
      )}
    </div>
  );
};
