
'use client';
import { X, BarChart3 } from "lucide-react";
import React, { useState } from "react";

interface Raffle {
  id: number;
  name: string;
  date: string;
  prize: string;
  ticketsSold: number;
  maxTickets: number;
  location: string;
}

const RaffleTable = () => {
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);

  const raffles: Raffle[] = [
    {
      id: 1,
      name: "Mega Jackpot",
      date: "2025-11-10",
      prize: "$10,000",
      ticketsSold: 120,
      maxTickets: 200,
      location: "Online",
    },
    {
      id: 2,
      name: "Holiday Raffle",
      date: "2025-12-01",
      prize: "$5,000",
      ticketsSold: 50,
      maxTickets: 100,
      location: "Online",
    },
  ];

  return (
    <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
            <div>Raffle Name</div>
            <div>Date</div>
            <div className="text-center">Tickets</div>
            <div className="text-right">Prize</div>
            <div className="text-center">View</div>
          </div>

          {raffles.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="relative">
                <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
                <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
              </div>
              <p className="text-gray-400 mt-4 font-medium">No Raffle Data</p>
            </div>
          ) : (
            // Table Rows
            <div className="divide-y divide-slate-700">
              {raffles.map((raffle) => (
                <div
                  key={raffle.id}
                  className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
                >
                  <div>{raffle.name}</div>
                  <div>{raffle.date}</div>
                  <div className="flex justify-center font-semibold text-gray-200">
                    {raffle.ticketsSold}/{raffle.maxTickets}
                  </div>
                  <div className="text-right font-semibold text-green-400">
                    {raffle.prize}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedRaffle(raffle)}
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
      {selectedRaffle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setSelectedRaffle(null)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Raffle Details
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Raffle Name:</span>{" "}
                {selectedRaffle.name}
              </p>
              <p>
                <span className="text-gray-400">Date:</span>{" "}
                {selectedRaffle.date}
              </p>
              <p>
                <span className="text-gray-400">Tickets Sold:</span>{" "}
                {selectedRaffle.ticketsSold}/{selectedRaffle.maxTickets}
              </p>
              <p>
                <span className="text-gray-400">Prize:</span>{" "}
                {selectedRaffle.prize}
              </p>
              <p>
                <span className="text-gray-400">Location:</span>{" "}
                {selectedRaffle.location}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaffleTable;
