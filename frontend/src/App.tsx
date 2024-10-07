import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="bg-black text-primary-foreground w-full h-full flex flex-col items-center">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
      />
      <Router>
        <NavBar />
        <main className="w-full h-full flex flex-col items-center mt-8 px-48">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock/:ticker" element={<Stock />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
