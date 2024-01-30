import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/components/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
