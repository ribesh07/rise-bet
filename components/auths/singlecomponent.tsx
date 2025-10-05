// "use client";

// import { useState } from "react";
// import { SignupForm } from "./SignupForm";
// import { LoginForm } from "./LoginForm"; // create this similar to SignupForm

// export const AuthSwitcher = () => {
//   const [showLogin, setShowLogin] = useState(false);

//   return (
//     <div className="w-full max-w-md mx-auto mt-10">
//       {showLogin ? (
//         <LoginForm onSwitch={() => setShowLogin(false)} />
//       ) : (
//         <SignupForm onSuccess={() => {}} />
//       )}

//       <p className="mt-4 text-center text-gray-400 text-sm">
//         {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//         <button
//           className="text-[#00c2ff] hover:underline"
//           onClick={() => setShowLogin(!showLogin)}
//         >
//           {showLogin ? "Sign up" : "Login now"}
//         </button>
//       </p>
//     </div>
//   );
// };
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

