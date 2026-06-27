"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface AdminDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  type: "users" | "listings" | "reservations" | "hosts";
}

const AdminDataModal: React.FC<AdminDataModalProps> = ({ isOpen, onClose, title, data, type }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-white text-neutral-900">
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-neutral-500 mt-1">Total Records: {data.length}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition text-neutral-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body / Table */}
          <div className="p-6 overflow-y-auto flex-1 bg-neutral-50/50">
            {data.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 font-medium">No records found.</div>
            ) : (
              <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-100 text-neutral-600 font-medium border-b border-neutral-200">
                    <tr>
                      {type === "users" || type === "hosts" ? (
                        <>
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Joined At</th>
                        </>
                      ) : type === "listings" ? (
                        <>
                          <th className="p-4">Listing</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                        </>
                      ) : (
                        <>
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">User ID</th>
                          <th className="p-4">Dates</th>
                          <th className="p-4">Total Price</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr 
                        key={item._id || index} 
                        className={`border-b border-neutral-100 transition last:border-0 ${type === 'users' || type === 'hosts' ? 'hover:bg-neutral-50 cursor-pointer' : 'hover:bg-neutral-50'}`}
                        onClick={() => {
                          if (type === 'users' || type === 'hosts') {
                            window.location.href = `/users/${item._id}`;
                          }
                        }}
                      >
                        {type === "users" || type === "hosts" ? (
                          <>
                            <td className="p-4 flex items-center gap-3">
                              <Image 
                                src={item.image || "/placeholder.jpg"} 
                                alt="Avatar" 
                                width={32} 
                                height={32} 
                                className="rounded-full bg-neutral-200"
                              />
                              <span className="font-semibold text-blue-600 hover:underline">{item.name}</span>
                            </td>
                            <td className="p-4 text-neutral-600">{item.email}</td>
                            <td className="p-4 text-neutral-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                          </>
                        ) : type === "listings" ? (
                          <>
                            <td className="p-4 flex items-center gap-3">
                              {item.imageSrc ? (
                                <Image 
                                  src={item.imageSrc} 
                                  alt="Listing" 
                                  width={40} 
                                  height={40} 
                                  className="rounded-md object-cover bg-neutral-200 h-10 w-10"
                                />
                              ) : null}
                              <span className="font-semibold max-w-[200px] truncate" title={item.title}>{item.title}</span>
                            </td>
                            <td className="p-4 text-neutral-600">{item.locationValue}</td>
                            <td className="p-4 text-neutral-600 capitalize">{item.category}</td>
                            <td className="p-4 font-semibold text-[#F97316]">₹{item.price} / night</td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 text-neutral-600 font-mono text-xs">{item._id}</td>
                            <td className="p-4 text-blue-600 hover:underline cursor-pointer font-mono text-xs truncate max-w-[150px]" onClick={() => window.location.href = `/users/${item.userId}`}>
                              {item.userId}
                            </td>
                            <td className="p-4 text-neutral-600 whitespace-nowrap">
                              {item.startDate ? new Date(item.startDate).toLocaleDateString() : ''} - {item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}
                            </td>
                            <td className="p-4 font-semibold text-[#F97316]">₹{item.totalPrice}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDataModal;
