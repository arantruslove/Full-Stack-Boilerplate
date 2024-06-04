import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/components/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import LoginContainer from "./pages/Auth/containers/LoginContainer";
import SignUpContainer from "./pages/Auth/containers/SignUpContainer";
import Playground from "./pages/Playground/Playground";
import VerifyEmail from "./pages/Auth/components/VerifyEmail";
import VerifyEmailSuccess from "./pages/Auth/components/VerifyEmailSuccess";

function App() {
  return (
    <Routes>
      <Route path="" element={<LandingPage />} />
      <Route path="/login" element={<LoginContainer />} />
      <Route path="/sign-up" element={<SignUpContainer />} />
      <Route path="/verify-email/success" element={<VerifyEmailSuccess />} />
      <Route path="/verify-email/*" element={<VerifyEmail />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
