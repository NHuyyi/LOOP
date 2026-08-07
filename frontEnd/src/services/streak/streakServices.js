const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getMyStats = async () => {
  try {
    const res = await fetch(`${API_URL}/streak/my-stats`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching my stats:", error);
    return { success: false, message: "Lỗi kết nối server" };
  }
};

export const getPointsLeaderboard = async (limit = 50) => {
  try {
    const res = await fetch(`${API_URL}/streak/leaderboard/points?limit=${limit}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching points leaderboard:", error);
    return { success: false, message: "Lỗi kết nối server" };
  }
};

export const getFriendStreakLeaderboard = async (limit = 50) => {
  try {
    const res = await fetch(`${API_URL}/streak/leaderboard/friends?limit=${limit}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching friend streak leaderboard:", error);
    return { success: false, message: "Lỗi kết nối server" };
  }
};
