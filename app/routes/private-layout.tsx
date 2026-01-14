// src/layouts/dashboard-layout.tsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
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

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Logbook", href: "/logbook", icon: BookOpen },
  { name: "Mitra", href: "/mitra", icon: Users },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

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
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`shrink-0 bg-white border-r border-gray-300 transition-all duration-300
          ${sidebarMinimized ? "w-20" : "w-64"}
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo & Minimize Button */}
          <div className="flex items-center justify-center h-16 ">
            {!sidebarMinimized && (
              <h1 className="text-2xl font-bold text-primary">SIKMA</h1>
            )}
          </div>
          <button
            onClick={() => setSidebarMinimized(!sidebarMinimized)}
            className="p-1.5 rounded-md hover:bg-gray-700 transition-colors cursor-pointer z-100 top-5 absolute right-0 bg-secondary translate-x-2.5"
          >
            {sidebarMinimized ? (
              <ChevronRight className="h-5 w-5 text-white" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-white" />
            )}
          </button>
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold transition-colors
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    ${sidebarMinimized ? "justify-center" : ""}
                  `}
                  title={sidebarMinimized ? item.name : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarMinimized && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-end border-b border-gray-300 bg-white px-4 shadow-sm">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button onClick={() => setSidebarOpen(true)} variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-x-4 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarFallback className="bg-gray-900 text-white">
                      {getInitials(user?.nama)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 " align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.nama}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-500 data-highlighted:text-red-500 "
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-64 flex-col bg-white shadow-lg">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-300">
              <h1 className="text-2xl font-bold text-gray-900">SIKMA</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold transition-colors
                      ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
