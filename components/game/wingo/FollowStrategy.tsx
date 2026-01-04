"use client";

export default function FollowStrategy() {
  return (
    <div className="bg-white p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-lg font-semibold mb-2 flex items-center gap-2">
        Betting Strategy
        <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs text-gray-400">?</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <button className="px-4 py-1.5 rounded-full bg-green-100 text-green-600 text-sm font-semibold">
          History
        </button>
      </div>
      <div className="w-32 h-32 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-6xl opacity-30">📊</span>
      </div>
      <div className="text-gray-500 text-sm">Please select a strategy</div>
    </div>
  );
}
