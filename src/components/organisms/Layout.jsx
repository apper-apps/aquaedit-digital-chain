import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import StatusBar from "@/components/molecules/StatusBar";
import { cn } from "@/utils/cn";

const Layout = () => {
  const location = useLocation();
  
  // App-level state and methods that can be passed via outlet context
  const outletContext = {
    location
  };
  
  return (
    <ThemeProvider>
      <LayoutContent outletContext={outletContext} />
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
    </ThemeProvider>
  );
};

const LayoutContent = ({ outletContext }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  
// Show status bar on editor/develop pages
  const showStatusBar = ['/editor', '/develop'].includes(location.pathname);
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      isDarkMode ? "bg-slate-darker" : "bg-gray-50"
    )}>
      <Header />
      <main className={cn(
        "flex-1",
        showStatusBar ? "pb-8" : ""
      )}>
        <Outlet context={outletContext} />
      </main>
      {!showStatusBar && <Footer />}
      {showStatusBar && <StatusBar />}
    </div>
  );
};

export default Layout;