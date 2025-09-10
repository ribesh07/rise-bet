// "use client";
// import { useEffect, useState } from "react";

// interface User {
//   username: string;
//   email: string;
//   balance: number;
//   history: { id: number; type: string; amount: number; date: string }[];
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // 🟢 Example mock data - replace with API call
//     const mockUser: User = {
//       username: "LuckyPlayer",
//       email: "player@example.com",
//       balance: 250.75,
//       history: [
//         { id: 1, type: "Deposit", amount: 100, date: "2025-09-01" },
//         { id: 2, type: "Bet", amount: -50, date: "2025-09-02" },
//         { id: 3, type: "Win", amount: 200, date: "2025-09-05" },
//         { id: 4, type: "Withdrawal", amount: -100, date: "2025-09-08" },
//       ],
//     };
//     setUser(mockUser);
//   }, []);

//   if (!user) return <div className="text-white text-center p-8">Loading...</div>;

//   return (
//     <main className="min-h-screen bg-black text-white flex justify-center items-start py-12 px-4">
//       <div className="max-w-3xl w-full bg-gray-900 rounded-2xl shadow-xl p-8">
//         {/* Header */}
//         <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

//         {/* User Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-gray-800 rounded-xl p-6">
//             <h2 className="text-gray-400 text-sm">Username</h2>
//             <p className="text-xl font-semibold">{user.username}</p>
//           </div>
//           <div className="bg-gray-800 rounded-xl p-6">
//             <h2 className="text-gray-400 text-sm">Email</h2>
//             <p className="text-xl font-semibold">{user.email}</p>
//           </div>
//           <div className="bg-gray-800 rounded-xl p-6 md:col-span-2">
//             <h2 className="text-gray-400 text-sm">Balance</h2>
//             <p className="text-2xl font-bold text-green-400">${user.balance.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* History */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
//           <div className="bg-gray-800 rounded-xl overflow-hidden">
//             <table className="w-full text-left">
//               <thead className="bg-gray-700">
//                 <tr>
//                   <th className="px-4 py-3">Date</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {user.history.map((item) => (
//                   <tr key={item.id} className="border-t border-gray-700">
//                     <td className="px-4 py-3">{item.date}</td>
//                     <td className="px-4 py-3">{item.type}</td>
//                     <td
//                       className={`px-4 py-3 font-semibold ${
//                         item.amount >= 0 ? "text-green-400" : "text-red-400"
//                       }`}
//                     >
//                       {item.amount >= 0 ? "+" : ""}
//                       {item.amount}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/utils/ApiHelper";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
}

interface User {
  username: string;
  email: string;
  balance: number;
  history: Transaction[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in!");
        return;
      }

      try {
        const res = await apiRequest("/auth/me", true, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success && res.data) {
          // Ensure balance is a number and history exists
          setUser({
            username: res.data.username || "",
            email: res.data.email || "",
            balance: Number(res.data.balance) || 0,
            history: Array.isArray(res.data.history)
              ? res.data.history.map((item: any) => ({
                  id: item.id,
                  type: item.type,
                  amount: Number(item.amount) || 0,
                  date: item.date,
                }))
              : [],
          });
        } else {
          toast.error(res.message || "Failed to fetch user data!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data!");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="text-white text-center p-8">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white flex justify-center items-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-900 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-gray-400 text-sm">Username</h2>
            <p className="text-xl font-semibold">{user.username}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-gray-400 text-sm">Email</h2>
            <p className="text-xl font-semibold">{user.email}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 md:col-span-2">
            <h2 className="text-gray-400 text-sm">Balance</h2>
            <p className="text-2xl font-bold text-green-400">
              ${Number(user.balance).toFixed(2)}
            </p>
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {user.history.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        item.amount >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.amount >= 0 ? "+" : ""}
                      {item.amount}
                    </td>
                  </tr>
                ))}
                {user.history.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
