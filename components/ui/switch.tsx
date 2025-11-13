// "use client";
// import React from "react";

// interface SwitchProps {
//   checked: boolean;
//   onCheckedChange: (checked: boolean) => void;
//   className?: string;
// }

// export const Switch: React.FC<SwitchProps> = ({
//   checked,
//   onCheckedChange,
//   className = "",
// }) => {
//   return (
//     <button
//       onClick={() => onCheckedChange(!checked)}
//       className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
//         checked ? "bg-[#4a9fff]" : "bg-gray-600"
//       } ${className}`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//           checked ? "translate-x-5" : "translate-x-1"
//         }`}
//       />
//     </button>
//   );
// };
"use client";
import React from "react";
import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  className = "",
}) => {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-[#00C74D] shadow-[0_0_8px_#00C74D]" : "bg-[#2A3A4D]"
      } ${className}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};
