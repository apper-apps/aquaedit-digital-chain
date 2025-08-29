import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import EditorPage from "@/components/pages/EditorPage";
import GalleryPage from "@/components/pages/GalleryPage";
import PresetsPage from "@/components/pages/PresetsPage";
import DashboardPage from "@/components/pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-darker">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="presets" element={<PresetsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;