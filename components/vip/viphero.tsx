
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
    <section
      className="
        text-left 
        py-10 md:py-14 
        px-4 
        vip-header-bg 
        min-h-[40vh] md:min-h-[45vh] 
        flex flex-col justify-center
      "
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        The unrivalled VIP experience
      </h1>

      <p className="text-left text-gray-300 mb-6 max-w-xl">
        Unlock exclusive benefits and receive instantly withdrawable bonuses
        without any strings attached.
      </p>

      <div className="w-fit">
        <button
          onClick={handleRegisterClick}
          className="
            bg-blue-600 hover:bg-blue-700 
            text-white 
            px-6 py-3 
            rounded-lg 
            font-semibold 
            transition
          "
        >
          Sign up
        </button>
      </div>
    </section>
  );
};

export default VipHero;
