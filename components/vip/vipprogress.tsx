
// "use client";

// import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/vipcard";
// import ProgressCard from "@/components/progresscard";
// import { X } from "lucide-react";

// interface UserVipCardProps {
//   username?: string;
//   avatarUrl?: string;
//   vipProgress?: number;
//   currentLevelName?: string;
//   nextLevelName?: string;
//   currentLevel?: string;
//   nextLevel?: string;
//   onClose?: () => void;
// }

// const VipHero: React.FC<UserVipCardProps> = ({
//   username="John Doe",
//   vipProgress=45,
//   currentLevelName="Bronze",
//   nextLevelName="Silver",
  
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
//         py-6 md:py-8 
//         px-4 
//         vip-header-bg 
//         min-h-[30vh] md:min-h-[35vh] 
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
//           py-5 relative
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

//         <CardContent className="p-4 sm:p-5">
//           <ProgressCard
//             username={username}
//             progressPercentage={progress}
//             currentLevelName={currentLevelName}
//             nextLevelName={nextLevelName}
            
            
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
import { apiRequest } from "@/utils/ApiHelper";

interface UserVipCardProps {
  onClose?: () => void;
}

const VipHero: React.FC<UserVipCardProps> = ({ onClose }) => {

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("Loading...");
  const [vipProgress, setVipProgress] = useState(0);
  const [currentLevelName, setCurrentLevelName] = useState("Bronze");
  const [nextLevelName, setNextLevelName] = useState("Silver");

  
      const [user, setUser] = useState(username || "Loading...");
      const [progress, setProgress] = useState(vipProgress || 0);
      const [currentLevel, setCurrentLevel] = useState(currentLevelName || "Bronze");
      const [nextLevelVal, setNextLevelVal] = useState(nextLevelName || "Silver");
  // -------------------------------------------------------
  // ✅ Fetch VIP DATA From /users/${id}/details
  // -------------------------------------------------------
   useEffect(() => {
      const loadVipData = async () => {
        try {
          const id = localStorage.getItem("userId");
          const token = localStorage.getItem("token");
  
          const res = await apiRequest(`/users/${id}/details`, true, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (res.success) {
            setUser(res.data.username);
            setCurrentLevel(res.data.currentLevelName);
            setNextLevelVal(res.data.nextLevelName);
  
            // Animate progress
            setTimeout(() => {
              setProgress(res.data.progressPercent);
            }, 250);
          }
        } catch (err) {
          console.error("VIP fetch error:", err);
        }
      };
  
      loadVipData();
    }, []);

 

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setProgress(vipProgress), 400);
      return () => clearTimeout(timeout);
    }
  }, [loading, vipProgress]);

  return (
    <section className="text-left py-6 md:py-8 px-4 vip-header-bg min-h-[30vh] md:min-h-[35vh] flex flex-col justify-center">
      <Card className="w-full max-w-[95%] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px] py-5 relative header-bg border-none rounded-2xl shadow-inner">

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
                  username={user}
                  progressPercentage={progress}
                  currentLevelName={currentLevel}
                  nextLevelName={nextLevelVal}
                />
        </CardContent>

      </Card>
    </section>
  );
};

export default VipHero;
