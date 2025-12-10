
import { apiRequest } from "./ApiHelper";

export const fetchUserProfile = async () => {
  const data = await apiRequest("/auth/test", false, {
    method: "GET",
  });
  console.log("User Profile Data:", data);
  return data;
};


export const getToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token") || "";
  console.log("Retrieved Token:", token);
  return token;
};

// ya aata ham fetch ka dai xi token na saave iinn sessoio storage