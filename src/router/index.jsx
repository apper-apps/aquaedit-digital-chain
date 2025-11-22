import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/organisms/Layout';

// Lazy load all page components
const LandingPage = lazy(() => import('@/components/pages/LandingPage'));
const EditorPage = lazy(() => import('@/components/pages/EditorPage'));
const PresetsPage = lazy(() => import('@/components/pages/PresetsPage'));
const ExportPage = lazy(() => import('@/components/pages/ExportPage'));
const CommunityPage = lazy(() => import('@/components/pages/CommunityPage'));
const GalleryPage = lazy(() => import('@/components/pages/GalleryPage'));
const DashboardPage = lazy(() => import('@/components/pages/DashboardPage'));
const TeamDashboardPage = lazy(() => import('@/components/pages/TeamDashboardPage'));
const TeamWorkspaceCreationPage = lazy(() => import('@/components/pages/TeamWorkspaceCreationPage'));
const TeamManagementPage = lazy(() => import('@/components/pages/TeamManagementPage'));
const UserInvitePage = lazy(() => import('@/components/pages/UserInvitePage'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Wrap components in Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<SuspenseFallback />}>
    <Component />
  </Suspense>
);

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(LandingPage)
  },
  {
    path: "editor",
    element: withSuspense(EditorPage)
  },
  {
    path: "develop",
    element: withSuspense(EditorPage)
  },
  {
    path: "presets",
    element: withSuspense(PresetsPage)
  },
  {
    path: "presets/import",
    element: withSuspense(PresetsPage)
  },
  {
    path: "export",
    element: withSuspense(ExportPage)
  },
  {
    path: "community",
    element: withSuspense(CommunityPage)
  },
  {
    path: "gallery",
    element: withSuspense(GalleryPage)
  },
  {
    path: "dashboard",
    element: withSuspense(DashboardPage)
  },
  {
    path: "teams",
    element: withSuspense(TeamDashboardPage)
  },
  {
    path: "teams/create-workspace",
    element: withSuspense(TeamWorkspaceCreationPage)
  },
  {
    path: "teams/management",
    element: withSuspense(TeamManagementPage)
  },
  {
    path: "teams/invite",
    element: withSuspense(UserInvitePage)
  },
  {
    path: "*",
    element: withSuspense(NotFound)
  }
];

// Router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);