import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SignInFormData } from "../types/User";
import { signInApi } from "../api/auth";
import { ACCESS_TOKEN_REFRESH, API_URL } from "../constants";

interface AuthContext {
  signIn: (data: SignInFormData) => Promise<void>;
  signOut: () => Promise<void>;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContext>({
  accessToken: null,
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<number | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshAccessToken();
      } catch (error) {}
    };

    initAuth();
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const requestInit: RequestInit = init || {};

      if (accessToken) {
        requestInit.headers = {
          ...requestInit.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }

      requestInit.credentials = "include";

      try {
        const response = await originalFetch(input, requestInit);

        if (response.status == 401) {
          try {
            const refreshResponse = await originalFetch(
              `${API_URL}/auth/refresh`,
              {
                method: "POST",
                credentials: "include",
              }
            );

            if (!refreshResponse.ok) {
              signOut();
              throw new Error("Session expired");
            }

            const { access_token } = await refreshResponse.json();
            setAccessToken(accessToken);

            return originalFetch(input, {
              ...requestInit,
              headers: {
                ...requestInit.headers,
                Authorization: `Bearer ${access_token}`,
              },
            });
          } catch (refreshError) {
            signOut();
            throw refreshError;
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [accessToken]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [refreshTimer]);

  const refreshAccessToken = useCallback(async () => {
    console.log("refreshAccessToken");
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw Error("Failed to refresh token");
      }

      const data = await response.json();
      setAccessToken(data.access_token);

      const refreshTime = ACCESS_TOKEN_REFRESH;
      const timer = setTimeout(refreshAccessToken, refreshTime);
      setRefreshTimer(timer);
    } catch (error) {
      console.log(error);
      await signOut();
    }
  }, []);

  const signIn = async (data: SignInFormData) => {
    try {
      console.log("AuthContext - signIn");
      const response = await signInApi(data);

      // if (!response.ok) {
      //   throw new Error("Login failed");
      // }

      setAccessToken(response.access_token);
      const refreshTime = ACCESS_TOKEN_REFRESH;
      const timer = setTimeout(refreshAccessToken, refreshTime);
      setRefreshTimer(timer);

      // DO some another stuff like load user info
      navigate("/app/vocabulary");
    } catch (error) {
      console.error(error);
      throw new Error("Invalid credentials");
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      setAccessToken(null);
      navigate("/signin");
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
