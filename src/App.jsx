import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/organisms/Layout";
import CommunityPage from "@/components/pages/CommunityPage";
import TeamManagementPage from "@/components/pages/TeamManagementPage";
import LandingPage from "@/components/pages/LandingPage";
import ExportPage from "@/components/pages/ExportPage";
import DashboardPage from "@/components/pages/DashboardPage";
import TeamWorkspaceCreationPage from "@/components/pages/TeamWorkspaceCreationPage";
import PresetsPage from "@/components/pages/PresetsPage";
import TeamDashboardPage from "@/components/pages/TeamDashboardPage";
import UserInvitePage from "@/components/pages/UserInvitePage";
import GalleryPage from "@/components/pages/GalleryPage";
import EditorPage from "@/components/pages/EditorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "editor",
        element: <EditorPage />
      },
      {
        path: "gallery",
        element: <GalleryPage />
      },
      {
        path: "presets",
        element: <PresetsPage />
      },
      {
        path: "export",
        element: <ExportPage />
      },
      {
        path: "community",
        element: <CommunityPage />
      },
      {
        path: "team",
        children: [
          {
            path: "management",
            element: <TeamManagementPage />
          },
          {
            path: "dashboard",
            element: <TeamDashboardPage />
          },
          {
            path: "workspace/create",
            element: <TeamWorkspaceCreationPage />
          }
        ]
      },
      {
        path: "invite",
        element: <UserInvitePage />
      }
    ]
  }
]);

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;