"use client";
import React from "react";

const VipHero = () => {
  // ✅ Register function
  const handleRegisterClick = () => {
    window.dispatchEvent(
      new CustomEvent("openAuthModal", { detail: "register" })
    );
  };

  return (
    <section className="text-left py-20 px-4 vip-header-bg">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        The unrivalled VIP experience
      </h1>
      <p className="text-left text-gray-300 mb-8 max-w-xl">
        Unlock exclusive benefits and receive instantly withdrawable bonuses
        without any strings attached.
      </p>
      <button
        onClick={handleRegisterClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        Sign up
      </button>
    </section>
  );
};

export default VipHero;
