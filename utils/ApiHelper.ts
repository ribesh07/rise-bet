// import { API_BASE_URL } from "./Config";

// export const apiRequest = async (
//   url : any,
//   tokenReq: boolean = true,
//   options: RequestInit = {}
// ) => {
//   url = API_BASE_URL+url;
//   console.log("API Request URL:", url);
//   const token = localStorage.getItem("token");
  
//   const headers = {
//     ...(tokenReq && token ? { Authorization: `Bearer ${token}` } : {}),
//     ...(options.method !== "GET" ? { "Content-Type": "application/json" } : {}),
//     ...options.headers,
//   };

//   let response;
//   try {
//     response = await fetch(url, { ...options, headers });
//   } catch (err) {
//     console.error("Network error:", err);
//     return {
//       success: false,
//       message: "Network error or server unreachable.",
//     };
//   }

//   let data;
//   try {
//     data = await response.json();
//   } catch (e) {
//     console.error("Invalid JSON from server:", e);
//     return {
//       success: false,
//       message: "Server sent invalid JSON.",
//     };
//   }

//   if (data.success || response.ok) {
//     return data;
//   } else {
//     console.warn("API error response:", data);
//     return data;
//   }
// };
import { API_BASE_URL } from "./Config";

export const apiRequest = async (
  url: string,
  tokenReq: boolean = true,
  options: RequestInit = {}
) => {
  const fullUrl = API_BASE_URL + url;
  console.log("API Request URL:", fullUrl);

  // ✅ Always check latest token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(tokenReq && token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  let response: Response;
  try {
    response = await fetch(fullUrl, { ...options, headers });
  } catch (err) {
    console.error("❌ Network error:", err);
    return {
      success: false,
      message: "Network error or server unreachable.",
      data: null,
    };
  }

  let data: any = null;
  try {
    // ✅ Handle empty responses (204, etc.)
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error("❌ Invalid JSON from server:", e);
    return {
      success: false,
      message: "Server sent invalid JSON.",
      data: null,
    };
  }

  // ✅ Normalize response
  if (response.ok && (data.success === undefined || data.success === true)) {
    return {
      success: true,
      message: data.message || "Request successful",
      data: data.data || data,
    };
  } else {
    console.warn("⚠️ API error response:", data);
    return {
      success: false,
      message: data.message || "Request failed",
      data: data.data || null,
    };
  }
};
