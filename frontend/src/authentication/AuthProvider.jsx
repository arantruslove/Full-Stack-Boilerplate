import { useState, useEffect, createContext } from "react";

import { refreshAccessToken } from "../services/accountRequests";

// To access context in other components
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refreshToken = async () => {
    const response = await refreshAccessToken();

    if (response.ok) {
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  // Automatically refreshes access token periodically
  // Will stay logged in if the refresh of the access token is successful
  // Will logout if the refresh is unsuccessful
  useEffect(() => {
    refreshToken();

    // Refresh access token every 29 minutes
    setInterval(refreshToken, 29 * 60 * 1000);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
