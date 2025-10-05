
"use client";

import { useState } from "react";
import { SignupForm } from "./signupform";
import { LoginForm } from "./loginform";

export const AuthSwitcher = () => {
  const [mode, setMode] = useState<"login" | "signup">("signup"); // default to signup

  const handleSwitch = () => {
    setMode(mode === "signup" ? "login" : "signup");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6">
      {mode === "signup" ? (
        <SignupForm onSwitch={handleSwitch} />
      ) : (
        <LoginForm onSwitch={handleSwitch} />
      )}
    </div>
  );
};

