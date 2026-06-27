"use client";

import { ReactNode } from "react";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon?: ReactNode;
  isDanger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon, isDanger }) => {
  return (
    <div 
      onClick={onClick} 
      className={`px-4 py-3 flex items-center gap-3 transition font-semibold ${
        isDanger 
        ? "text-rose-600 hover:bg-rose-50" 
        : "text-neutral-700 hover:bg-[#0f3d30]/5 hover:text-[#0f3d30]"
      }`}
    >
      {icon && <span className="text-current opacity-80">{icon}</span>}
      {label}
    </div>
  );
};

export default MenuItem;
