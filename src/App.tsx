import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import CreateForm from "./components/CreateForm";
import ViewAllForm from "./components/ViewAllForm";
import PreviewForm from "./components/PreviewForm";

function App() {
  return (
    <>
      <div style={{ padding: "24px 40px" }}>
        <BrowserRouter>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/myforms" element={<ViewAllForm />} />
            <Route path="/preview/:id" element={<PreviewForm />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
