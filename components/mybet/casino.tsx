
"use client";
import { BarChart3, Link, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/utils/ApiHelper";

type CasinoBet = {
  id: number;
  game: string;
  date: string;
  amount: number;
  payout: number;
  status: string;
  value?: string;
};

const ITEMS_PER_PAGE = 10;

const Casino = () => {
  const [bets, setBets] = useState<CasinoBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBet, setSelectedBet] = useState<CasinoBet | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchBets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await apiRequest("/users/bets", true, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.success) {
          const formattedBets: CasinoBet[] = res.data.map((bet: any) => ({
            id: bet.id,
            game: bet.game,
            date: bet.createdAt
              ? new Date(bet.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString(),
            amount: bet.payload.amount,
           
            status: bet.status || "PENDING",
            payout:
              bet.payout ,
              
          }));

          // Sort bets by most recent first
          formattedBets.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setBets(formattedBets);
        } else {
          setBets([]);
        }
      } catch (err) {
        console.error("Bets API Error:", err);
        setBets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  // Pagination logic
  const startIndex = page * ITEMS_PER_PAGE;
  const paginatedBets = bets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNext = () => {
    if (startIndex + ITEMS_PER_PAGE < bets.length) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  if (loading) {
    return <p className="text-gray-400 text-center py-10">Loading bets...</p>;
  }

  return (
    <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Table Header */}
          <div className="grid grid-cols-[1.3fr_1.2fr_1.2fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
            <div>Game</div>
            <div>Bet ID</div>
            <div>Date</div>
            <div className="text-center">Amount</div>
            <div className="text-center">Payout</div>
            <div className="text-right">Status</div>
          </div>

          {/* Empty State */}
          {bets.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="relative">
                <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
                <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
              </div>
              <p className="text-gray-400 mt-4 font-medium">No Casino Bets</p>
              <Link
                href="/home"
                className="text-[#3BA55D] font-semibold mt-2 hover:underline"
              >
                Start Playing Now!
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {paginatedBets.map((bet) => (
                <div
                  key={bet.id}
                  className="grid grid-cols-[1.3fr_1.2fr_1.2fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
                >
                  <div>{bet.game}</div>
                  <div>{bet.id}</div>
                  <div>{bet.date}</div>
                  <div className="text-center">${bet.amount}</div>
                  <div className="text-center">
  <span
    className={`font-semibold ${
      bet.status === "LOST"
        ? "text-red-500"
        : bet.status === "PENDING"
        ? "text-yellow-400"
        : "text-green-400"
    }`}
  >
    {bet.status === "LOST" ? "-" : `$${bet.payout}`}
  </span>
</div>

                  <div className="text-right">
                    <span className="text-gray-400"></span>{" "}
                    <span
                      className={`font-semibold ${
                        bet.status === "LOST"
                          ? "text-red-500"
                          : bet.status === "PENDING"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {bet.status}
                    </span>
                  </div>
       

                  </div>
                
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Buttons */}
      {bets.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className={`px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + ITEMS_PER_PAGE >= bets.length}
            className={`px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Bet Details */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setSelectedBet(null)}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-white">
              Bet Details
            </h3>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Game:</span> {selectedBet.game}
              </p>
              <p>
                <span className="text-gray-400">Bet ID:</span> {selectedBet.id}
              </p>
              <p>
                <span className="text-gray-400">Date:</span> {selectedBet.date}
              </p>
              <p>
                <span className="text-gray-400">Bet Amount:</span> $
                {selectedBet.amount}
              </p>
              <p>
  <span className="text-gray-400">Payout:</span>{" "}
  <span
    className={`font-semibold ${
      selectedBet.status === "LOST"
        ? "text-red-500"
        : selectedBet.status === "PENDING"
        ? "text-yellow-400"
        : "text-green-400"
    }`}
  >
    {selectedBet.status === "LOST" ? "-" : `$${selectedBet.payout}`}
  </span>
</p>

              <p>
                <span className="text-gray-400">Status:</span>{" "}
    
  <span
    className={`font-semibold ${
      selectedBet.status === "LOST"
        ? "text-red-500"
        : selectedBet.status === "PENDING"
        ? "text-yellow-400"
        : "text-green-400"
    }`}
  >
    {selectedBet.status}
  </span>
</p>

              
              {selectedBet.value && (
                <p>
                  <span className="text-gray-400">Bet Value:</span>{" "}
                  {selectedBet.value}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Casino;
