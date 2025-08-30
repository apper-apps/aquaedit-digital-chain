import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import StatusBar from "@/components/molecules/StatusBar";
import { cn } from "@/utils/cn";

const Layout = () => {
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
        <Outlet />
      </main>
      {!showStatusBar && <Footer />}
      {showStatusBar && <StatusBar />}
    </div>
  );
};

export default Layout;