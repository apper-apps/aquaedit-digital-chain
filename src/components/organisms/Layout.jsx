import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import StatusBar from "@/components/molecules/StatusBar";
import { cn } from "@/utils/cn";

const LayoutContent = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  // App-level state and methods that can be passed via outlet context
  const outletContext = {
    location
  };
  
  // Show status bar on editor/develop pages
  const showStatusBar = location.pathname.includes('/editor') || location.pathname.includes('/develop');

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDarkMode ? "dark" : ""
    )}>
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 relative">
        <Outlet context={outletContext} />
        
        {/* Status Bar for specific pages */}
        {showStatusBar && (
          <StatusBar 
            imageInfo={{
              name: "underwater_photo.jpg",
              width: 1920,
              height: 1080,
              size: 2048576,
              format: "JPEG"
            }}
          />
        )}
      </main>
      
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

const Layout = () => {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
};

export default Layout;