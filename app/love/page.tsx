"use client";
import React, { useState, useEffect } from 'react';

export default function ChocolateDay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

 

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100">
      {/* Animated chocolate decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              opacity: 0.1
            }}
          >
            🍫
          </div>
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${10 + Math.random() * 20}px`,
              opacity: 0.15
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="inline-block mb-6">
            <div className="text-7xl mb-4 animate-bounce">🍫</div>
          </div>
          <h1 className="font-serif text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
            Happy Chocolate Day
          </h1>
          <p className="text-2xl md:text-3xl text-rose-800 font-light italic">
            To My Sweetest Love smriti lati ❤️
          </p>
        </div>

        {/* Main message */}
        <div
          className={`bg-white/60 backdrop-blur-sm rounded-3xl p-10 md:p-14 shadow-2xl border border-rose-200 mb-12 transition-all duration-1500 delay-300 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-6">💝</div>
            <h2 className="text-4xl font-serif text-rose-900 mb-6 font-bold">
              My Dearest Love,
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
            <p className="text-xl text-center font-light italic text-rose-700">
              "Just like chocolate melts in your mouth, you melt my heart with your smile."
            </p>
            
            <p className="text-lg">
              On this special Chocolate Day, I want you to know that you are sweeter than any chocolate in the world. 
              Your love is the most delightful treat I could ever ask for, and every moment with you is like savoring 
              the finest piece of chocolate – rich, sweet, and absolutely unforgettable.
            </p>
            
            <p className="text-lg">
              You add flavor to my life, warmth to my days, and sweetness to my soul. Just as chocolate brings joy 
              to anyone who tastes it, you bring endless happiness to my heart.
            </p>
            
            <p className="text-xl text-center font-semibold text-rose-800 mt-8">
              Thank you for being my sweetest addiction. ❤️
            </p>
          </div>
        </div>

        {/* Quotes section */}
       

        {/* Love lines section */}
        <div
          className={`bg-gradient-to-r from-rose-900 to-pink-800 rounded-3xl p-10 md:p-14 shadow-2xl text-white mb-12 transition-all duration-1500 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-4xl font-serif text-center mb-10 font-bold">
            Sweet Nothings for You
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "You're the chocolate to my valentine 🍫",
              "Every day with you is sweeter than the last 💕",
              "You melt my heart like chocolate in the sun ☀️",
              "Life with you is a box of endless delights 🎁",
              "You're my favorite flavor in this world 🌹",
              "Together, we're the perfect recipe for love 👫"
            ].map((line, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <p className="text-lg text-center font-light">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final message */}
        <div
          className={`text-center transition-all duration-1500 delay-1000 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-rose-300 inline-block">
            <p className="text-3xl font-serif text-rose-900 mb-4 font-bold">
              Forever Yours,
            </p>
            <div className="text-5xl">
              💖🍫💖
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        .font-light {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>
    </div>
  );
}