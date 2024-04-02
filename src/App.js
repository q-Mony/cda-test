import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import NotFound from './pages/notfound/index.js';
import Home from './pages/home'
import Organization from "./pages/org/index.js";
import Networks from "./pages/networks/index.js";
import Main from "./pages/main/index.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/main" element={<Main />} />
        <Route path="/networks" element={<Networks />} />
        <Route path="/organization" element={<Organization />} />
      </Routes>
    </Router>
  );
}

export default App;



