import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/organisms/Layout";
import EditorPage from "@/components/pages/EditorPage";
import GalleryPage from "@/components/pages/GalleryPage";
import PresetsPage from "@/components/pages/PresetsPage";
import ExportPage from "@/components/pages/ExportPage";
import CommunityPage from "@/components/pages/CommunityPage";
import DashboardPage from "@/components/pages/DashboardPage";
import LandingPage from "@/components/pages/LandingPage";
import TeamDashboardPage from "@/components/pages/TeamDashboardPage";
import TeamWorkspaceCreationPage from "@/components/pages/TeamWorkspaceCreationPage";
import TeamManagementPage from "@/components/pages/TeamManagementPage";
import UserInvitePage from "@/components/pages/UserInvitePage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-darker">
<ThemeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="editor" element={<EditorPage />} />
              <Route path="develop" element={<EditorPage />} />
              <Route path="presets" element={<PresetsPage />} />
              <Route path="presets/import" element={<PresetsPage />} />
              <Route path="export" element={<ExportPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="teams" element={<TeamDashboardPage />} />
              <Route path="teams/create-workspace" element={<TeamWorkspaceCreationPage />} />
              <Route path="teams/management" element={<TeamManagementPage />} />
              <Route path="teams/invite" element={<UserInvitePage />} />
            </Route>
          </Routes>
        </ThemeProvider>
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