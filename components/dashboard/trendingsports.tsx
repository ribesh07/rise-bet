// 'use client';
// import React from 'react';

// interface Sport {
//   id: number;
//   name: string;
//   image: string;
//   color: string;
// }

// interface Props {
//   sports: Sport[];
// }

// export const TrendingSports: React.FC<Props> = ({ sports }) => {
//   return (
//     <section>
//       <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🏆 Trending Sports</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
//         {sports.map(sport => (
//           <div key={sport.id} className={`bg-gradient-to-br ${sport.color} rounded-xl p-3 sm:p-4 text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer text-center`}>
//             <div className="text-3xl sm:text-4xl mb-1 animate-bounce">{sport.image}</div>
//             <div className="text-white font-medium text-sm sm:text-base">{sport.name}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };
'use client';
import React from 'react';

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

export const TrendingSports: React.FC = () => {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🏆 Trending Sports</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {trendingSports.map(sport => (
          <div key={sport.id} className={`bg-gradient-to-br ${sport.color} rounded-xl p-3 sm:p-4 text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer text-center`}>
            <div className="text-3xl sm:text-4xl mb-1 animate-bounce">{sport.image}</div>
            <div className="text-white font-medium text-sm sm:text-base">{sport.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
