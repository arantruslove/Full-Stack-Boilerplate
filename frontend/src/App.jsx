import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage/components/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import LoginContainer from "./pages/Auth/containers/LoginContainer";
import SignUpContainer from "./pages/Auth/containers/SignUpContainer";
import Playground from "./pages/Playground/Playground";
import VerifyEmail from "./pages/Auth/components/VerifyEmail";
import VerifyEmailSuccess from "./pages/Auth/components/VerifyEmailSuccess";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider value={true}>
      <Routes>
        {/* Private Routes */}
        <Route
          path="/playground"
          element={
            <PrivateRoute>
              <Playground />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="" element={<LandingPage />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/sign-up" element={<SignUpContainer />} />
        <Route path="/verify-email/success" element={<VerifyEmailSuccess />} />
        <Route path="/verify-email/*" element={<VerifyEmail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
