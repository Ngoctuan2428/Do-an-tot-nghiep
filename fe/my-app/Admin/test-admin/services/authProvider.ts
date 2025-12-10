import { AuthProvider } from "react-admin";

// URL của API
const API_URL = "http://localhost:8000/api";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    try {
      const response = await fetch(request);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log("ĐÂY LÀ DATA MÀ API TRẢ VỀ:", data);

      if (!data.data || !data.data.accessToken) {
        throw new Error("Login failed: API did not return an access token.");
      }

      localStorage.setItem("token", data.data.accessToken);
      return Promise.resolve();
    } catch (error) {
      console.error("Login failed:", error);
      return Promise.reject(new Error("Invalid email or password")); // Báo lỗi cho React Admin
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => Promise.resolve("admin"),
};
