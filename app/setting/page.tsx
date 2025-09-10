// "use client";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { apiRequest } from "@/utils/ApiHelper";

// interface User {
//   username: string;
//   email: string;
//   balance: number;
// }

// export default function SettingsPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [password, setPassword] = useState("");
//   const [deposit, setDeposit] = useState<number | "">("");
//   const [loading, setLoading] = useState(false);

//   // Fetch user data on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return toast.error("You are not logged in!");
//       try {
//         const res = await apiRequest("/auth/me", true, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.success) {
//           setUser(res.data);
//         } else {
//           toast.error(res.message || "Failed to fetch user data!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch user data!");
//       }
//     };
//     fetchUser();
//   }, []);

//   // Update Email
//   const handleEmailChange = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await apiRequest("/auth/update-email", true, {
//         method: "POST",
//         body: JSON.stringify({ email: user.email }),
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (res.success) {
//         toast.success("Email updated successfully!");
//       } else {
//         toast.error(res.message || "Failed to update email!");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update email!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Password
//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !password) return toast.error("Enter a new password!");
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await apiRequest("/auth/update-password", true, {
//         method: "POST",
//         body: JSON.stringify({ password }),
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (res.success) {
//         toast.success("Password updated successfully!");
//         setPassword("");
//       } else {
//         toast.error(res.message || "Failed to update password!");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update password!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Deposit
//   const handleDeposit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !deposit || deposit <= 0) return toast.error("Enter a valid deposit amount!");
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await apiRequest("/user/deposit", true, {
//         method: "POST",
//         body: JSON.stringify({ amount: deposit }),
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (res.success) {
//         toast.success(`$${deposit} deposited successfully!`);
//         setUser({ ...user, balance: res.data.balance }); // Update balance
//         setDeposit("");
//       } else {
//         toast.error(res.message || "Deposit failed!");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Deposit failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return <div className="text-white text-center p-8">Loading...</div>;

//   return (
//     <main className="min-h-screen bg-black text-white flex justify-center py-12 px-4">
//       <div className="max-w-3xl w-full space-y-10">

//         {/* Email */}
//         <div className="bg-gray-900 p-8 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">Change Email</h2>
//           <form onSubmit={handleEmailChange} className="space-y-4">
//             <input
//               type="email"
//               value={user.email}
//               onChange={(e) => setUser({ ...user, email: e.target.value })}
//               required
//               className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-md font-semibold transition disabled:opacity-60"
//             >
//               {loading ? "Updating..." : "Update Email"}
//             </button>
//           </form>
//         </div>

//         {/* Password */}
//         <div className="bg-gray-900 p-8 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">Change Password</h2>
//           <form onSubmit={handlePasswordChange} className="space-y-4">
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="New Password"
//               required
//               className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-md font-semibold transition disabled:opacity-60"
//             >
//               {loading ? "Updating..." : "Update Password"}
//             </button>
//           </form>
//         </div>

//         {/* Deposit */}
//         <div className="bg-gray-900 p-8 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">Deposit</h2>
//           <form onSubmit={handleDeposit} className="space-y-4">
//             <input
//               type="number"
//               value={deposit}
//               onChange={(e) => setDeposit(Number(e.target.value))}
//               placeholder="Amount"
//               required
//               className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-green-600 hover:bg-green-700 w-full py-3 rounded-md font-semibold transition disabled:opacity-60"
//             >
//               {loading ? "Processing..." : "Deposit"}
//             </button>
//           </form>
//         </div>

//         {/* Current Balance */}
//         <div className="bg-gray-800 p-6 rounded-xl text-center">
//           <h2 className="text-gray-400">Current Balance</h2>
//           <p className="text-2xl font-bold text-green-400">${user.balance.toFixed(2)}</p>
//         </div>

//       </div>
//     </main>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/utils/ApiHelper";

interface User {
  username: string;
  email: string;
  balance: number;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("You are not logged in!");
      try {
        const res = await apiRequest("/auth/me", true, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.success && res.data) {
          // Ensure balance is always a number
          setUser({
            username: res.data.username || "",
            email: res.data.email || "",
            balance: Number(res.data.balance) || 0,
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

  // Update Email
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/auth/update-email", true, {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.success) {
        toast.success("Email updated successfully!");
      } else {
        toast.error(res.message || "Failed to update email!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update email!");
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !password) return toast.error("Enter a new password!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/auth/update-password", true, {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.success) {
        toast.success("Password updated successfully!");
        setPassword("");
      } else {
        toast.error(res.message || "Failed to update password!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password!");
    } finally {
      setLoading(false);
    }
  };

  // Deposit
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !deposit || deposit <= 0) return toast.error("Enter a valid deposit amount!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/user/deposit", true, {
        method: "POST",
        body: JSON.stringify({ amount: deposit }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.success && res.data) {
        toast.success(`$${deposit} deposited successfully!`);
        setUser({
          ...user,
          balance: Number(res.data.balance) || user.balance, // Type safe
        });
        setDeposit("");
      } else {
        toast.error(res.message || "Deposit failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Deposit failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-white text-center p-8">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white flex justify-center py-12 px-4">
      <div className="max-w-3xl w-full space-y-10">

        {/* Email */}
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Change Email</h2>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-md font-semibold transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-md font-semibold transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Deposit */}
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Deposit</h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              placeholder="Amount"
              required
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 w-full py-3 rounded-md font-semibold transition disabled:opacity-60"
            >
              {loading ? "Processing..." : "Deposit"}
            </button>
          </form>
        </div>

        {/* Current Balance */}
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h2 className="text-gray-400">Current Balance</h2>
          <p className="text-2xl font-bold text-green-400">
            ${Number(user.balance).toFixed(2)}
          </p>
        </div>

      </div>
    </main>
  );
}
