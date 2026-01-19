// src/layouts/dashboard-layout.tsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Menu,
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useAuth } from "~/provider/auth-context";
import undip from "../assets/undip.png";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navGroups = {
  GENERAL: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Logbook", href: "/logbook", icon: BookOpen },
    { name: "Mitra", href: "/mitra", icon: Users },
  ],
  ADMIN: [{ name: "Users", href: "/users", icon: User }],
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Untuk Mobile
  const [sidebarMinimized, setSidebarMinimized] = useState(false); // Untuk Desktop
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Global Auth Guard: Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Menutup sidebar otomatis saat pindah rute di mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] font-sans overflow-hidden">
      {/* --- OVERLAY UNTUK MOBILE --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarMinimized ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6">
            <div
              className={`flex items-center gap-2 ${sidebarMinimized ? "lg:hidden" : "flex"}`}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">
                  <img src={undip} alt="" />
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#1A1D1F] truncate">
                Logbook
              </h1>
            </div>

            {/* Tombol Close (Mobile) atau Minimize (Desktop) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="hidden lg:flex p-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {sidebarMinimized ? (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 space-y-8 mt-4">
            <div>
              <p
                className={`px-3 text-[11px] font-bold text-gray-400 tracking-wider mb-4 uppercase ${sidebarMinimized ? "lg:hidden" : "block"}`}
              >
                General
              </p>
              <div className="space-y-1">
                {navGroups.GENERAL.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                        ${isActive ? "bg-[#F4F4F4] text-primary" : "text-[#6F767E] hover:bg-gray-50 hover:text-gray-900"}
                        ${sidebarMinimized ? "lg:justify-center" : "justify-start"}
                      `}
                      title={sidebarMinimized ? item.name : ""}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-[#6F767E]"}`}
                      />
                      <span
                        className={`${sidebarMinimized ? "lg:hidden" : "block"}`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  );
                })}

                {/* Admin Menu */}
                {user?.roles?.includes("Admin") && (
                  <>
                    <p
                      className={`px-3 text-[11px] font-bold text-gray-400 tracking-wider mb-2 mt-6 uppercase ${sidebarMinimized ? "lg:hidden" : "block"}`}
                    >
                      Admin
                    </p>
                    {navGroups.ADMIN.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                                ${isActive ? "bg-[#F4F4F4] text-primary" : "text-[#6F767E] hover:bg-gray-50 hover:text-gray-900"}
                                ${sidebarMinimized ? "lg:justify-center" : "justify-start"}
                            `}
                          title={sidebarMinimized ? item.name : ""}
                        >
                          <Icon
                            className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-[#6F767E]"}`}
                          />
                          <span
                            className={`${sidebarMinimized ? "lg:hidden" : "block"}`}
                          >
                            {item.name}
                          </span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between bg-white border-b border-gray-200 px-4 md:px-8">
          {/* Hamburger Menu Mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 lg:hidden ml-4">
            <h1 className="text-lg font-bold text-[#1A1D1F]">SIKMA</h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-x-6 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 focus:outline-none group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 leading-none">
                      {user?.nama || "User"}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 capitalize">
                      {user?.roles?.[0] || "Guest"}
                    </p>
                  </div>
                  <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-transparent group-hover:border-primary/20 transition-all">
                    <AvatarFallback className="bg-gray-900 text-white text-xs font-bold">
                      {getInitials(user?.nama)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold">{user?.nama}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-gray-500" /> Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-500 cursor-pointer focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
