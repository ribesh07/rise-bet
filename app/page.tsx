
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { TrendingUp } from 'lucide-react';
import ImageHeadHome from '@/components/ui/imageheadhome';

const trendingGames = [
  { id: 1, name: "Crash", players: 482, provider: "Pragmatic Play", image: "/images/crash.jpg" },
  { id: 2, name: "Plinko", players: 438, provider: "Pragmatic Play", image: "/images/plinko.jpg" },
  { id: 3, name: "Roulette", players: 307, provider: "Zeus Play", image: "/images/roulette.jpg" },
  { id: 4, name: "Mines", players: 422, provider: "Pragmatic Play", image: "/images/mines.jpg" },
  { id: 5, name: "Hi-Lo", players: 257, provider: "Hacksaw Gaming", image: "/images/hi_lo.jpg" },
  { id: 6, name: "Dice", players: 317, provider: "Pragmatic Play", image: "/images/dice.jpg" },
  { id: 7, name: "Baccarat", players: 129, provider: "Massive Studios", image: "/images/baccarat.jpg" },
  { id: 8, name: "Poker", players: 175, provider: "Pragmatic Play", image: "/images/poker.jpg" }
];

const trendingSports = [
  { id: 1, name: "Soccer", image: "⚽", color: "from-blue-500 to-blue-600" },
  { id: 2, name: "Tennis", image: "🎾", color: "from-orange-500 to-red-500" },
  { id: 3, name: "Baseball", image: "⚾", color: "from-orange-400 to-yellow-500" },
  { id: 4, name: "American Football", image: "🏈", color: "from-red-600 to-red-700" },
  { id: 5, name: "Basketball", image: "🏀", color: "from-red-500 to-pink-500" },
  { id: 6, name: "Golf", image: "⛳", color: "from-green-400 to-green-500" },
  { id: 7, name: "Cricket", image: "🏏", color: "from-green-500 to-green-600" },
  { id: 8, name: "Horse Racing", image: "🏇", color: "from-blue-400 to-cyan-500" }
];

const recentBets = [
  { game: "Crash", user: "Hidden", time: "3:36 PM", amount: "$1,000.10", multiplier: "1.01x", payout: "$1,010.10", win: true },
  { game: "Turkish VIP Blackjack 5", user: "Hidden", time: "3:36 PM", amount: "$210,940.81", multiplier: "2.06x", payout: "$433,600.56", win: true },
  { game: "Salon Privé Blackjack J", user: "Hidden", time: "3:36 PM", amount: "$3,999.60", multiplier: "2.00x", payout: "$7,999.20", win: true },
  { game: "Angel vs Sinner Etern...", user: "Hidden", time: "3:36 PM", amount: "$50.00", multiplier: "80.00x", payout: "$4,000.00", win: true },
  { game: "Sugar Rush 1000", user: "Hidden", time: "3:36 PM", amount: "$3,000.00", multiplier: "0.09x", payout: "-$2,736.60", win: false }
];

const promotions = [
  { type: "Promotion", title: "Frankie's St Leger Raffle", description: "Share in $40,000", image: "🎟️" },
  { type: "Announcement", title: "Chicken", description: "New Stake Original!", image: "🐔" },
  { type: "Promotion", title: "EuroBasket", description: "Overtime Insurance", image: "🏀" }
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#101620db] flex flex-col">
      {/* Header */}
      <header className="bg-[#0f172a] backdrop-blur-sm border-b border-slate-700 z-50 fixed top-0 left-0 right-0 h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="relative w-36 h-10">
            <Image src="/logo.png" alt="Logo" fill style={{ objectFit: "contain" }} priority />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl px-6 py-2 rounded-lg text-white font-medium transition-all duration-300"
            >
              Register
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Page Layout */}
      <div className="flex flex-1 relative pt-16">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 h-[calc(100%-4rem)] z-20">
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-8 transition-all duration-500 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'
          }`}
        >
          {/* Hero Section */}
          <div className="header-bg w-full relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[2400px] mx-auto">
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

            {/* ✅ Casino & Sports Cards (Sticky) */}
            <div className="md:col-span-2 grid grid-cols-2 gap-3 sm:gap-6  top-20 z-10">
              <ImageHeadHome title="Casino" count={32339} image="/images/risebet_casino.png" />
              <ImageHeadHome title="Sports (soon...)" count={0} image="/images/risebet_sports.png" />
            </div>
            </div>
          </div>

          {/* Trending Games */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} /> Trending Games
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {trendingGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-800 rounded-xl p-3 sm:p-4 hover:bg-slate-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
                >
                  <img src={game.image} alt={game.name} className="rounded-md mb-2" />
                  <div className="text-white font-medium text-xs sm:text-sm mb-1 truncate">{game.name}</div>
                  <div className="text-slate-400 text-[10px] sm:text-xs mb-1">{game.provider}</div>
                  <div className="flex items-center justify-center text-xs sm:text-sm text-green-400">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                    {game.players} playing
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Sports */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🏆 Trending Sports</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {trendingSports.map((sport) => (
                <div
                  key={sport.id}
                  className={`bg-gradient-to-br ${sport.color} rounded-xl p-3 sm:p-4 text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer text-center`}
                >
                  <div className="text-3xl sm:text-4xl mb-1 animate-bounce">{sport.image}</div>
                  <div className="text-white font-medium text-sm sm:text-base">{sport.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Promotions */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🎁 Promotions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {promotions.map((promo, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-xl p-4 sm:p-6 hover:bg-slate-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl mb-3 animate-bounce">{promo.image}</div>
                  <div className="text-xs text-blue-400 mb-1">{promo.type}</div>
                  <div className="text-white font-bold mb-2">{promo.title}</div>
                  <div className="text-slate-400 text-sm mb-3">{promo.description}</div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300">
                    Read More
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Bets */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🎲 Recent Bets</h2>
            <div className="overflow-hidden relative bg-slate-800 rounded-xl p-2 sm:p-4">
              <div className="flex animate-marquee whitespace-nowrap">
                {recentBets.map((bet, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-4 sm:px-6 py-2 text-white border-r border-slate-700 last:border-r-0"
                  >
                    <span className="font-bold">{bet.game}</span> {bet.amount} →{' '}
                    <span className={bet.win ? 'text-green-400' : 'text-red-400'}>{bet.payout}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
