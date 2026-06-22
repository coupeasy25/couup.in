"use client";

import { useState } from "react";
import { Users, Building, CalendarCheck, Home } from "lucide-react";
import AdminDataModal from "./AdminDataModal";

interface DashboardCardsProps {
  stats: {
    userCount: number;
    listingCount: number;
    reservationCount: number;
    hostCount: number;
    users: any[];
    listings: any[];
    reservations: any[];
    hosts: any[];
  }
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  const [modalType, setModalType] = useState<"users" | "listings" | "reservations" | "hosts" | null>(null);

  const getModalTitle = () => {
    switch (modalType) {
      case "users": return "All Registered Users";
      case "listings": return "All Property Listings";
      case "reservations": return "All Booking Reservations";
      case "hosts": return "All Property Hosts";
      default: return "";
    }
  };

  const getModalData = () => {
    switch (modalType) {
      case "users": return stats.users;
      case "listings": return stats.listings;
      case "reservations": return stats.reservations;
      case "hosts": return stats.hosts;
      default: return [];
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Users */}
        <div 
          onClick={() => setModalType("users")}
          className="bg-gradient-to-br from-[#0f3d30] to-[#1a5c4a] p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition duration-300">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-white/80 font-medium text-lg mb-1">Total Users</div>
            <div className="text-4xl font-bold text-white">{stats.userCount}</div>
          </div>
        </div>

        {/* Total Listings */}
        <div 
          onClick={() => setModalType("listings")}
          className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition duration-300">
            <Building size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-white/80 font-medium text-lg mb-1">Total Listings</div>
            <div className="text-4xl font-bold text-white">{stats.listingCount}</div>
          </div>
        </div>

        {/* Total Reservations */}
        <div 
          onClick={() => setModalType("reservations")}
          className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition duration-300">
            <CalendarCheck size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-white/80 font-medium text-lg mb-1">Total Reservations</div>
            <div className="text-4xl font-bold text-white">{stats.reservationCount}</div>
          </div>
        </div>

        {/* Total Hosts */}
        <div 
          onClick={() => setModalType("hosts")}
          className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition duration-300">
            <Home size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-white/80 font-medium text-lg mb-1">Total Hosts</div>
            <div className="text-4xl font-bold text-white">{stats.hostCount}</div>
          </div>
        </div>
      </div>

      <AdminDataModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)} 
        title={getModalTitle()} 
        data={getModalData()} 
        type={modalType || "users"} 
      />
    </>
  );
};

export default DashboardCards;
