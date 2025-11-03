'use client';
import { X, BarChart3 } from "lucide-react";
import React, { useState } from "react";

interface Race {
  id: number;
  name: string;
  date: string;
  position: number;
  prize: string;
  location: string;
  participants: number;
}

const RaceTable = () => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const races: Race[] = [
    {
      id: 1,
      name: "Autumn Derby",
      date: "2025-10-28",
      position: 1,
      prize: "$5,000",
      location: "New York Track",
      participants: 12,
    },
    {
      id: 2,
      name: "Winter Sprint",
      date: "2025-11-05",
      position: 3,
      prize: "$1,200",
      location: "London Track",
      participants: 10,
    },
  ];

  return (
    <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">
      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
            <div>Race Name</div>
            <div>Date</div>
            <div className="text-center">Position</div>
            <div className="text-right">Prize</div>
            <div className="text-center">View</div>
          </div>

          {/* Empty State */}
          {races.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="relative">
                <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
                <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
              </div>
              <p className="text-gray-400 mt-4 font-medium">No Race Data</p>
            </div>
          ) : (
            // Table Rows
            <div className="divide-y divide-slate-700">
              {races.map((race) => (
                <div
                  key={race.id}
                  className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
                >
                  <div>{race.name}</div>
                  <div>{race.date}</div>
                  <div className="flex justify-center font-semibold text-gray-200">
                    {race.position}
                  </div>
                  <div className="text-right font-semibold text-green-400">
                    {race.prize}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedRace(race)}
                      className="px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/30 
                        rounded-full bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-[0_0_10px_#3b82f6aa] 
                        transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedRace && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setSelectedRace(null)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-white">Race Details</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Race Name:</span> {selectedRace.name}
              </p>
              <p>
                <span className="text-gray-400">Date:</span> {selectedRace.date}
              </p>
              <p>
                <span className="text-gray-400">Position:</span> {selectedRace.position}
              </p>
              <p>
                <span className="text-gray-400">Prize:</span> {selectedRace.prize}
              </p>
              <p>
                <span className="text-gray-400">Location:</span> {selectedRace.location}
              </p>
              <p>
                <span className="text-gray-400">Participants:</span> {selectedRace.participants}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceTable;
