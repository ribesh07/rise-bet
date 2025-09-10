
import { apiRequest } from "./ApiHelper";

export const fetchUserProfile = async () => {
  const data = await apiRequest("/auth/test", false, {
    method: "GET",
  });
  console.log("User Profile Data:", data);
  return data;
};
