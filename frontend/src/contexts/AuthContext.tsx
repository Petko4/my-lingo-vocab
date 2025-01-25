import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../constants";

const PUBLIC_ROUTES = ["/signin", "/signup", "/reset-password"];

const isPublicRoute = (path: string) => {
  return PUBLIC_ROUTES.some((route) => route === path);
};

interface AuthContextProps {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const currentPath = window.location.pathname;

      console.log("Current Path:", currentPath); // Debug: aktuální cesta
      if (isPublicRoute(currentPath)) {
        console.log("Public route detected. Skipping token refresh."); // Debug: veřejná routa
        setIsLoading(false);
        return;
      }

      try {
        console.log("Protected route detected. Attempting token refresh."); // Debug: chráněná routa
        await refreshAccessToken();
      } catch (error) {
        console.error("Error during token refresh:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      console.log("Refreshing access token..."); // Debug
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Refresh token request failed. Redirecting to /signin."); // Debug
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      console.log("Access token refreshed:", data.access_token); // Debug
    } catch (error) {
      console.error("Error refreshing token:", error);
      setAccessToken(null);
      navigate("/signin");
    }
  }, [navigate]);

  // Initial auth check
  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       await refreshAccessToken();
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   initializeAuth();
  // }, [refreshAccessToken]);

  useEffect(() => {
    let refreshInterval: number | null = null;

    const startTokenRefresh = () => {
      refreshInterval = setInterval(() => {
        refreshAccessToken();
      }, 15 * 60 * 1000); // Obnova každých 15 minut
    };

    if (accessToken) {
      startTokenRefresh();
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [accessToken, refreshAccessToken]);

  const signIn = async (username: string, password: string) => {
    try {
      // Vytvoření FormData
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      // Odeslání pomocí fetch
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        body: formData,
        credentials: "include", // Pro práci s HttpOnly cookies
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      setAccessToken(data.access_token); // Uložení access tokenu do paměti
      navigate("app/vocabulary"); // Přesměrování po úspěšném přihlášení
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setAccessToken(null);
      navigate("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
