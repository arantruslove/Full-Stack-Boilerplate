import { Navigate } from "react-router";
import { useContext } from "react";

import { AuthContext } from "../context/AuthProvider";

/**
 * Checks if a user is authenticated before rendering the component. If the user is
 * not authenticated then they will be redirected to the login.
 */
function PrivateRoute({ children }) {
  const isLoggedIn = useContext(AuthContext);

  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;
