
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ImageHeadHome from '@/components/ui/imageheadhome';
import ImageHead from '../ui/imagehead';
import ProgressCard from '../progresscard';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full py-6 relative header-bg">
          <div className="absolute inset-0 bg-[#0f172a]/60 z-0"></div>

          <div
            className={`grid gap-4 w-full max-w-full mx-auto relative z-10 ${
              isMobile ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {/* Progress Card */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-sm frosted-card-bg p-4">
                
                 <div className="text-center lg:text-left space-y-4">
           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
             World's Largest Online<br />Casino and Sportsbook
           </h1>
           <button
            onClick={() => router.push('/auth/signup')}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
          >
               Register
              </button>
              </div>
              
              </div>
            </div>

             {!isMobile && (
              <>
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-sm">
                    <ImageHead
                      title="Casino"
                      count={32339}
                      image="/images/casino.jpg"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-sm">
                    <ImageHead
                      title="Sports (soon...)"
                      count={0}
                      image="/images/sports.jpg"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {isMobile && (
            <div className="grid grid-cols-2 gap-1 mt-3 relative z-10">
              <div className="flex justify-center">
                <div className="w-full max-w-[160px] frosted-card-bg p-1">
                  <ImageHead
                    title="Casino"
                    count={32339}
                    image="/images/casino.jpg"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[160px] frosted-card-bg p-1">
                  <ImageHead
                    title="Sports (soon...)"
                    count={0}
                    image="/images/sports.jpg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
  );
};
