import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Accounts";
import Sidebar from "./components/Sidebar";
import Transfer from "./pages/Transfer";
import Withdraw from "./pages/Withdraw";

function App() {
  return (
    <div className="d-flex p-3 appContainer">
      <div className="col-5 col-sm-4 col-md-3 col-xl-2 appLeft">
        <Sidebar />
      </div>
      <div className="col-7 col-sm-8 col-md-9 col-xl-10 appRight">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/withdraw" element={<Withdraw />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
