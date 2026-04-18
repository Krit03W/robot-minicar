import { BrowserRouter, Routes, Route } from "react-router-dom";
import CarControl from "./pages/CarControl";
import DicePage from "./pages/Dice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CarControl />} />
        <Route path="/dice" element={<DicePage />} />
      </Routes>
    </BrowserRouter>
  );
}
