
// import React from 'react';

// export default function HeroBanner() {
//   return (
//     <div className="relative w-full h-[220px] sm:h-[280px] bg-gradient-to-r from-[#14233D] to-[#0E192D] flex items-center justify-center overflow-hidden rounded-2xl">
//       <img
//         src="/images/promotion.png"
//         alt="Promotions Banner"
//         className="absolute inset-0 w-full h-full object-cover opacity-20"
//       />
      
//       </div>
    
//   );
// }
"use client";

import Image from "next/image";
import React from "react";

export default function HeroBanner() {
  return (
    <div className="relative ">
      {/* Background Image */}
      <img
         src="/images/promotion.png"
         alt="Risebet Smart"
         className="relative w-full   bg-gradient-to-r from-[#14233D] to-[#0E192D] flex items-center justify-center overflow-hidden rounded-2xl"
         />

      {/* Optional text/content on top of the image */}
      
    </div>
  );
}
