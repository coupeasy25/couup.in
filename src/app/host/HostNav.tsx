"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { LayoutDashboard, CalendarRange, Home, Ban, LogOut } from "lucide-react";

const HostNav = () => {
  const pathname = usePathname();

  const routes = [
    {
      href: "/host/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/host/dashboard",
    },
    {
      href: "/host/reservations",
      label: "Reservations",
      icon: CalendarRange,
      active: pathname === "/host/reservations",
    },
    {
      href: "/host/properties",
      label: "Properties",
      icon: Home,
      active: pathname === "/host/properties",
    },
    {
      href: "/host/cancellations",
      label: "Cancellations",
      icon: Ban,
      active: pathname === "/host/cancellations",
    },
  ];

  return (
    <div className="flex flex-col h-full py-8 px-4">
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold tracking-tight">Host Portal</h2>
        <p className="text-xs text-neutral-500 mt-1">Manage your properties</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group",
                route.active 
                  ? "bg-black text-white shadow-md" 
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
              )}
            >
              <Icon 
                size={18} 
                className={cn(
                  "transition-colors", 
                  route.active ? "text-white" : "text-neutral-400 group-hover:text-black"
                )} 
              />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 mt-8 border-t border-neutral-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-black transition-all duration-200"
        >
          <LogOut size={18} className="text-neutral-400" />
          Exit Portal
        </Link>
      </div>
    </div>
  );
}

export default HostNav;
