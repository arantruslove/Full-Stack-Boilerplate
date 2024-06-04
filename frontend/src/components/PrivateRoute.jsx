import { Navigate } from "react-router";

/**
 * Checks if a user is authenticated before rendering the component. If the user is
 * not authenticated then they will be navigated back to the login.
 */
function PrivateRoute({ children }) {
  const isLoggedIn = false;

  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;
