import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Register from "./views/Register";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
