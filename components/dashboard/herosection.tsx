// 'use client';

// import React from 'react';
// import ImageHead from '../ui/imagehead';
// import { Star, Gamepad } from 'lucide-react';

// export const HeroSection: React.FC = () => {
//   const [isMobile, setIsMobile] = React.useState(false);

//   React.useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleRegisterClick = () => {
//     window.dispatchEvent(
//       new CustomEvent('openAuthModal', { detail: 'register' })
//     );
//   };

//   return (
//     <div className="relative w-full py-8 header-bg overflow-hidden">
//       {/* Dark overlay */}
//       <div className="pointer-events-none absolute inset-0 bg-[#0f172a]/60 z-0" />

//       {/* ===== MAIN GRID ===== */}
//       <div
//         className="
//     relative z-10 mx-auto w-full max-w-7xl
//     grid gap-6 px-3
//     grid-cols-1
//     md:grid-cols-2
//     lg:grid-cols-3
//   "
// >
//         {/* ===== HERO TEXT CARD ===== */}
//         <div className="flex justify-center lg:justify-start">
//           <div className="w-full max-w-sm frosted-card-bg p-6">
//             <div className="text-center md:text-left space-y-4 md:space-y-5">
//   <h1
//     className="
//       text-[24px]
//       sm:text-[32px]
//       md:text-[40px]
//       lg:text-[48px]
//       font-semibold
//       text-white
//       leading-[1.15]
//       md:leading-[1.1]
//       tracking-tight
//     "
//   >
//     World’s Largest Online
//     <br className="hidden sm:block" />
//     Casino and Sportsbook
//   </h1>

//   <button
//     onClick={handleRegisterClick}
//     className="
//       inline-flex items-center justify-center
//       bg-[#1a9cff] hover:bg-[#1486e6]
//       px-6 py-3
//       md:px-7 md:py-3.5
//       rounded-md
//       text-white
//       font-semibold
//       text-sm md:text-base
//       shadow-[0_4px_12px_rgba(26,156,255,0.35)]
//       hover:shadow-[0_6px_18px_rgba(26,156,255,0.45)]
//       transition-all duration-200
//       active:scale-[0.98]
//     "
//   >
//     Register
//   </button>
// </div>

//           </div>
//         </div>

//         {/* ===== DESKTOP CARDS ===== */}
//         {!isMobile && (
//           <>
//             <div className="flex justify-center">
//               <div className="w-full max-w-[380px]">
//                 <ImageHead
//                   icon={<Star size={20} className="mr-1" />}
//                   title="Casino"
//                   count={42775}
//                   image="/images/casino1.jpg"
//                   color="blue"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-center">
//               <div className="w-full max-w-[380px]">
//                 <ImageHead
//                   icon={<Gamepad size={20} className="mr-1" />}
//                   title="Sports"
//                   count={11231}
//                   image="/images/sports1.jpg"
//                   color="red"
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* ===== MOBILE (1:1 STAKE) ===== */}
//       {isMobile && (
//         <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 px-2">
//           <ImageHead
//             icon={<Star size={20} className="mr-1" />}
//             title="Casino"
//             count={42775}
//             image="/images/casino1.jpg"
//             color="blue"
//           />
//           <ImageHead
//             icon={<Gamepad size={20} className="mr-1" />}
//             title="Sports"
//             count={11231}
//             image="/images/sports1.jpg"
//             color="red"
//           />
//         </div>
//       )}
//     </div>
//   );
// };
'use client';

import React from 'react';
import ImageHead from '../ui/imagehead';
import { Star, Gamepad } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const handleRegisterClick = () => {
    window.dispatchEvent(
      new CustomEvent('openAuthModal', { detail: 'register' })
    );
  };

  return (
    <div className="relative w-full py-8 header-bg overflow-hidden">
      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#0f172a]/60 z-0" />

      {/* ================= MAIN GRID ================= */}
      <div
        className="
          relative z-10 mx-auto w-full max-w-7xl
          grid gap-6 px-3
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
        "
      >
        {/* ================= HERO TEXT ================= */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-sm frosted-card-bg p-6">
            <div className="text-center md:text-left space-y-4 md:space-y-5">
              <h1
                className="
                  text-[24px]
                  sm:text-[32px]
                  md:text-[40px]
                  lg:text-[48px]
                  font-semibold
                  text-white
                  leading-[1.15]
                  md:leading-[1.1]
                  tracking-tight
                "
              >
                World’s Largest Online
                <br className="hidden sm:block" />
                Casino and Sportsbook
              </h1>

              <button
                onClick={handleRegisterClick}
                className="
                  inline-flex items-center justify-center
                  bg-[#1a9cff] hover:bg-[#1486e6]
                  px-6 py-3
                  md:px-7 md:py-3.5
                  rounded-md
                  text-white
                  font-semibold
                  text-sm md:text-base
                  shadow-[0_4px_12px_rgba(26,156,255,0.35)]
                  hover:shadow-[0_6px_18px_rgba(26,156,255,0.45)]
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP / TABLET CARDS ================= */}
        <div className="hidden md:flex justify-center">
          <div className="w-full max-w-none">
            <ImageHead
              icon={<Star size={20} className="mr-1" />}
              title="Casino"
              count={42775}
              image="/images/casino1.jpg"
              color="blue"
            />
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="w-full max-w-none">
            <ImageHead
              icon={<Gamepad size={20} className="mr-1" />}
              title="Sports"
              count={11231}
              image="/images/sports1.jpg"
              color="red"
            />
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 px-2 md:hidden">
        <ImageHead
         
          title="Casino"
          count={42775}
          image="/images/casino1.jpg"
          color="blue"
        />
        <ImageHead
         
          title="Sports"
          count={11231}
          image="/images/sports1.jpg"
          color="red"
        />
      </div>
    </div>
  );
};
