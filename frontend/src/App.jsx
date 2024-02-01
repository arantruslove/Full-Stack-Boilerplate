import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/components/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import LoginContainer from "./pages/Auth/containers/LoginContainer";
import SignUpContainer from "./pages/Auth/containers/SignUpContainer";
import Playground from "./pages/Playground/Playground";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/sign-up" element={<SignUpContainer />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
