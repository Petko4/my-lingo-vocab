import { useAuth } from "../contexts/AuthContext";

export const useSecureFetch = () => {
  const { accessToken, signOut } = useAuth();

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string>),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    try {
      const response = await fetch(input, { ...init, headers });

      if (response.status === 401) {
        // Sign out if token is invalid
        await signOut();
        throw new Error("Unauthorized");
      }

      return response;
    } catch (error) {
      console.error("Secure fetch failed:", error);
      throw error;
    }
  };
};
