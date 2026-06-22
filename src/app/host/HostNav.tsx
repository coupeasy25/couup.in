"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const HostNav = () => {
  const pathname = usePathname();

  const routes = [
    {
      href: "/host/dashboard",
      label: "Dashboard",
      active: pathname === "/host/dashboard",
    },
    {
      href: "/host/reservations",
      label: "Reservations",
      active: pathname === "/host/reservations",
    },
    {
      href: "/host/properties",
      label: "Properties",
      active: pathname === "/host/properties",
    },
  ];

  return (
    <nav className="flex items-center space-x-6 border-b border-neutral-200 pb-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-semibold transition-colors hover:text-black",
            route.active ? "text-black border-b-2 border-black pb-4 -mb-[17px]" : "text-neutral-500"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export default HostNav;
