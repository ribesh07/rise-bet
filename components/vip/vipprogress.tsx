
// "use client";

// import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/vipcard";
// import ProgressCard from "@/components/progresscard";
// import { X } from "lucide-react";

// interface UserVipCardProps {
//   username?: string;
//   avatarUrl?: string;
//   vipProgress?: number;
//   currentLevel?: string;
//   nextLevel?: string;
//   onClose?: () => void;
// }

// const VipHero: React.FC<UserVipCardProps> = ({
//   username = "shark491",
//   vipProgress = 45,
//   currentLevel = "None",
//   nextLevel = "Bronze",
//   onClose,
// }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const timeout = setTimeout(() => setProgress(vipProgress), 400);
//     return () => clearTimeout(timeout);
//   }, [vipProgress]);

//   return (
//     <section
//       className="
//         text-left 
//         py-10 md:py-14 
//         px-4 
//         vip-header-bg 
//         min-h-[40vh] md:min-h-[45vh] 
//         flex flex-col justify-center
//       "
//     >
//       <Card
//         className="
//           w-full
//           max-w-[95%]
//           sm:max-w-[500px]
//           md:max-w-[550px]
//           lg:max-w-[600px]
//           py-6 relative
//           header-bg border-none
//           rounded-2xl shadow-inner
//         "
//       >
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
//           >
//             <X size={18} />
//           </button>
//         )}

//         <CardContent className="p-4 sm:p-6">
//           <ProgressCard
//             username={username}
//             progressPercentage={progress}
//             levelName={nextLevel}
//           />
//         </CardContent>
//       </Card>
//     </section>
//   );
// };

// export default VipHero;
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/vipcard";
import ProgressCard from "@/components/progresscard";
import { X } from "lucide-react";

interface UserVipCardProps {
  username?: string;
  avatarUrl?: string;
  vipProgress?: number;
  currentLevel?: string;
  nextLevel?: string;
  onClose?: () => void;
}

const VipHero: React.FC<UserVipCardProps> = ({
  username = "shark491",
  vipProgress = 45,
  currentLevel = "None",
  nextLevel = "Bronze",
  onClose,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(vipProgress), 400);
    return () => clearTimeout(timeout);
  }, [vipProgress]);

  return (
    <section
      className="
        text-left 
        py-6 md:py-8 
        px-4 
        vip-header-bg 
        min-h-[30vh] md:min-h-[35vh] 
        flex flex-col justify-center
      "
    >
      <Card
        className="
          w-full
          max-w-[95%]
          sm:max-w-[500px]
          md:max-w-[550px]
          lg:max-w-[600px]
          py-5 relative
          header-bg border-none
          rounded-2xl shadow-inner
        "
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        )}

        <CardContent className="p-4 sm:p-5">
          <ProgressCard
            username={username}
            progressPercentage={progress}
            levelName={nextLevel}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default VipHero;
