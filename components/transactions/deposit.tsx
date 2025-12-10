
// 'use client';
// import { X, BarChart3 } from "lucide-react";
// import React, { useState } from "react";

// interface Deposit {
//   id: number;
//   date: string;
//   status: "Pending" | "Completed" | "Failed";
//   amount: string;
//   method: string;
//   transactionId: string;
// }

// const DepositTable: React.FC = () => {
//   const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

//   const deposits: Deposit[] = [
//     {
//       id: 1,
//       date: "2025-10-28",
//       status: "Completed",
//       amount: "$250.00",
//       method: "Bank Transfer",
//       transactionId: "TXN23456789",
//     },
//     {
//       id: 2,
//       date: "2025-10-29",
//       status: "Pending",
//       amount: "$120.00",
//       method: "Crypto (USDT)",
//       transactionId: "TXN34567890",
//     },
//   ];

//   return (
//     <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">
//       {/* ✅ Scrollable Table Wrapper for Mobile */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[650px]">
//           {/* ✅ Table Header */}
//           <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
//             <div>Date</div>
//             <div>Status</div>
//             <div className="text-center">Action</div>
//             <div className="text-right">Amount</div>
//           </div>

//           {/* ✅ Table Rows or Empty State */}
//           {deposits.length === 0 ? (
//             <div className="flex flex-col items-center justify-center text-center py-12">
//               <div className="relative">
//                 <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
//                 <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
//               </div>
//               <p className="text-gray-400 mt-4 font-medium">No Banking Deposits</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-slate-700">
//               {deposits.map((d) => (
//                 <div
//                   key={d.id}
//                   className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
//                 >
//                   <div>{d.date}</div>

//                   <div className="flex justify-start">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-md ${
//                         d.status === "Completed"
//                           ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_8px_#22c55e66]"
//                           : d.status === "Pending"
//                           ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_8px_#facc1566]"
//                           : "bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_8px_#ef444466]"
//                       }`}
//                     >
//                       {d.status}
//                     </span>
//                   </div>

//                   <div className="flex justify-center">
//                     <button
//                       onClick={() => setSelectedDeposit(d)}
//                       className="px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/30 
//                         rounded-full bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-[0_0_10px_#3b82f6aa] 
//                         transition"
//                     >
//                       View
//                     </button>
//                   </div>

//                   <div className="text-right font-semibold text-gray-200">
//                     {d.amount}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ Modal */}
//       {selectedDeposit && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
//           <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
//             <button
//               className="absolute top-3 right-3 text-gray-400 hover:text-white"
//               onClick={() => setSelectedDeposit(null)}
//             >
//               <X size={20} />
//             </button>

//             <h3 className="text-xl font-semibold mb-4 text-white">
//               Deposit Details
//             </h3>

//             <div className="space-y-2 text-sm text-gray-300">
//               <p>
//                 <span className="text-gray-400">Date:</span> {selectedDeposit.date}
//               </p>
//               <p>
//                 <span className="text-gray-400">Status:</span>{" "}
//                 <span
//                   className={`font-semibold ${
//                     selectedDeposit.status === "Completed"
//                       ? "text-green-400"
//                       : selectedDeposit.status === "Pending"
//                       ? "text-yellow-400"
//                       : "text-red-400"
//                   }`}
//                 >
//                   {selectedDeposit.status}
//                 </span>
//               </p>
//               <p>
//                 <span className="text-gray-400">Amount:</span> {selectedDeposit.amount}
//               </p>
//               <p>
//                 <span className="text-gray-400">Method:</span> {selectedDeposit.method}
//               </p>
//               <p>
//                 <span className="text-gray-400">Transaction ID:</span>{" "}
//                 {selectedDeposit.transactionId}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DepositTable;
// 'use client';

// import { X, BarChart3 } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { apiRequest } from "@/utils/ApiHelper"; // make sure the path is correct

// interface Deposit {
//   id: number;
//   date: string;
//   status: "Pending" | "Completed" | "Failed";
//   amount: string;
//   method: string;
//   transactionId: string;
// }

// const DepositTable: React.FC = () => {
//   const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
//   const [deposits, setDeposits] = useState<Deposit[]>([]);
//   const [loading, setLoading] = useState(true);

//   // ⭐ FETCH DEPOSITS FROM API
//   useEffect(() => {
//     const fetchDeposits = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const id = localStorage.getItem("userId");

//         const res = await apiRequest(`/users/${id}/transaction`, true, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log("Deposit API Response:", res);

//         if (res.success && Array.isArray(res.data)) {
//           const formatted: Deposit[] = res.data.map((t: any, index: number) => ({
//             id: index + 1,
//             date: t.date || "N/A",
//             status: t.status,
//             amount: `$${t.amount ?? "0.00"}`,
//             method: t.method || "Unknown",
//             transactionId: t.transactionId || "N/A",
//           }));

//           setDeposits(formatted);
//         }
//       } catch (err) {
//         console.error("Deposit API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeposits();
//   }, []);

//   return (
//     <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">

//       {/* ⭐ Loading State */}
//       {loading && (
//         <div className="w-full py-10 flex items-center justify-center text-gray-400">
//           Loading transactions...
//         </div>
//       )}

//       {!loading && (
//         <>
//           {/* Scrollable Table Wrapper */}
//           <div className="overflow-x-auto">
//             <div className="min-w-[650px]">
//               {/* Header */}
//               <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
//                 <div>Date</div>
//                 <div>Status</div>
//                 <div className="text-center">Action</div>
//                 <div className="text-right">Amount</div>
//               </div>

//               {/* Rows or Empty State */}
//               {deposits.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center text-center py-12">
//                   <div className="relative">
//                     <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
//                     <span className="absolute top-[22%] left-[34%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
//                   </div>
//                   <p className="text-gray-400 mt-4 font-medium">No Banking Deposits</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-slate-700">
//                   {deposits.map((d) => (
//                     <div
//                       key={d.id}
//                       className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
//                     >
//                       <div>{d.date}</div>

//                       <div className="flex justify-start">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-md ${
//                             d.status === "Completed"
//                               ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_8px_#22c55e66]"
//                               : d.status === "Pending"
//                               ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_8px_#facc1566]"
//                               : "bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_8px_#ef444466]"
//                           }`}
//                         >
//                           {d.status}
//                         </span>
//                       </div>

//                       <div className="flex justify-center">
//                         <button
//                           onClick={() => setSelectedDeposit(d)}
//                           className="px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/30 
//                             rounded-full bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-[0_0_10px_#3b82f6aa] 
//                             transition"
//                         >
//                           View
//                         </button>
//                       </div>

//                       <div className="text-right font-semibold text-gray-200">
//                         {d.amount}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Modal */}
//           {selectedDeposit && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
//               <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
//                 <button
//                   className="absolute top-3 right-3 text-gray-400 hover:text-white"
//                   onClick={() => setSelectedDeposit(null)}
//                 >
//                   <X size={20} />
//                 </button>

//                 <h3 className="text-xl font-semibold mb-4 text-white">
//                   Deposit Details
//                 </h3>

//                 <div className="space-y-2 text-sm text-gray-300">
//                   <p>
//                     <span className="text-gray-400">Date:</span>{" "}
//                     {selectedDeposit.date}
//                   </p>
//                   <p>
//                     <span className="text-gray-400">Status:</span>{" "}
//                     <span
//                       className={`font-semibold ${
//                         selectedDeposit.status === "Completed"
//                           ? "text-green-400"
//                           : selectedDeposit.status === "Pending"
//                           ? "text-yellow-400"
//                           : "text-red-400"
//                       }`}
//                     >
//                       {selectedDeposit.status}
//                     </span>
//                   </p>
//                   <p>
//                     <span className="text-gray-400">Amount:</span>{" "}
//                     {selectedDeposit.amount}
//                   </p>
//                   <p>
//                     <span className="text-gray-400">Method:</span>{" "}
//                     {selectedDeposit.method}
//                   </p>
//                   <p>
//                     <span className="text-gray-400">Transaction ID:</span>{" "}
//                     {selectedDeposit.transactionId}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default DepositTable;
'use client';

import { X, BarChart3 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/ApiHelper";

interface Deposit {
  id: number;
  date: string;
  status: "Pending" | "Completed" | "Failed";
  amount: string;
  method: string;
  transactionId: string;
}

const DepositTable: React.FC = () => {
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");

        const res = await apiRequest(`/users/${id}/transaction`, true, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", res);

        if (res.success && Array.isArray(res.data)) {
          const formatted: Deposit[] = res.data
            .filter((t: any) => t.type === "DEPOSIT") // ⭐ only deposits
            .map((t: any) => ({
              id: t.id,
              date: new Date(t.createdAt).toLocaleDateString(),
              status:
                t.status === "SUCCESS"
                  ? "Completed"
                  : t.status === "PENDING"
                  ? "Pending"
                  : "Failed",
              amount: `$${parseFloat(t.amount).toFixed(2)}`,
              method: t.description || "Unknown", // you can change this
              transactionId: t.id.toString(),
            }));

          setDeposits(formatted);
        }
      } catch (err) {
        console.error("Deposit Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  return (
    <div className="relative bg-[#0f1d2b] text-gray-300 rounded-lg p-6 shadow-md border border-slate-700">

      {loading && (
        <div className="w-full py-10 flex items-center justify-center text-gray-400">
          Loading transactions...
        </div>
      )}

      {!loading && (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-sm font-semibold text-gray-400 border-b border-slate-700 pb-3 mb-4">
                <div>Date</div>
                <div>Status</div>
                <div className="text-center">Action</div>
                <div className="text-right">Amount</div>
              </div>

              {deposits.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-500 opacity-30" />
                  <p className="text-gray-400 mt-4 font-medium">No Banking Deposits</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {deposits.map((d) => (
                    <div
                      key={d.id}
                      className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center py-3 text-sm hover:bg-[#1e293b] transition-colors rounded-lg px-2"
                    >
                      <div>{d.date}</div>

                      <div className="flex justify-start">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-md ${
                            d.status === "Completed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : d.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => setSelectedDeposit(d)}
                          className="px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/30 
                                    rounded-full bg-blue-500/10 hover:bg-blue-500/20"
                        >
                          View
                        </button>
                      </div>

                      <div className="text-right font-semibold text-gray-200">
                        {d.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MODAL */}
          {selectedDeposit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-[#1e293b] p-6 rounded-xl w-[90%] max-w-md shadow-lg border border-slate-700 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  onClick={() => setSelectedDeposit(null)}
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-semibold mb-4 text-white">Deposit Details</h3>

                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="text-gray-400">Date:</span> {selectedDeposit.date}</p>
                  <p><span className="text-gray-400">Status:</span> {selectedDeposit.status}</p>
                  <p><span className="text-gray-400">Amount:</span> {selectedDeposit.amount}</p>
                  <p><span className="text-gray-400">Method:</span> {selectedDeposit.method}</p>
                  <p><span className="text-gray-400">Transaction ID:</span> {selectedDeposit.transactionId}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DepositTable;
