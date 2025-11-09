
// "use client";
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X } from "lucide-react";

// interface ComingSoonModalProps {
//   open: boolean;
//   onClose: () => void;
//   onLogin?: () => void;
//   onRegister?: () => void;
// }

// const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
//   open,
//   onClose,
//   onLogin,
//   onRegister,
// }) => {
//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         >
//           <motion.div
//             onClick={(e) => e.stopPropagation()}
//             initial={{ opacity: 0, y: 80 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 80 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="relative bg-[#0A0F1E]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-[370px] text-center"
//           >
//             {/* Close X button */}
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
//             >
//               <X size={20} />
//             </button>

//             {/* ✅ LOGO */}
//             <img
//               src="/logo.png"
//               alt="Logo"
//               className="w-20 h-auto mx-auto mb-4 opacity-90"
//             />

//             <h1 className="text-white text-2xl font-semibold mb-2">
//               Login Required
//             </h1>

//             <p className="text-gray-400 text-sm mb-6 leading-relaxed">
//               You must sign in to play this game and access full features.
//             </p>

//             {/* Login Button */}
//             <button
//               onClick={onLogin}
//               className="w-full py-2.5 rounded-xl bg-[#4F86FF] hover:bg-[#3C6CE6] text-white font-semibold transition duration-200"
//             >
//               Login
//             </button>

//             {/* Register Button */}
//             <button
//               onClick={onRegister}
//               className="w-full py-2.5 mt-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition duration-200"
//             >
//               Register
//             </button>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ComingSoonModal;
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  open,
  onClose,
}) => {

  const openAuthModal = (type: "login" | "register") => {
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: type }));
    onClose(); // ✅ Close this modal when opening auth modal
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-[#0A0F1E]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-[370px] text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-auto mx-auto mb-4 opacity-90"
            />

            <h1 className="text-white text-2xl font-semibold mb-2">
              Login Required
            </h1>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              You must sign in to play this game and access full features.
            </p>

            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-2.5 rounded-xl bg-[#4F86FF] hover:bg-[#3C6CE6] text-white font-semibold transition duration-200"
            >
              Login
            </button>

            <button
              onClick={() => openAuthModal("register")}
              className="w-full py-2.5 mt-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition duration-200"
            >
              Register
            </button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;
