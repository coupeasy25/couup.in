"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { X, CheckCircle, XCircle } from "lucide-react";

interface AdminListingsClientProps {
  initialListings: any[];
}

export default function AdminListingsClient({ initialListings }: AdminListingsClientProps) {
  const [listings, setListings] = useState(initialListings);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (listingId: string, status: string) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/admin/listings/${listingId}`, { status });
      toast.success(`Listing ${status.toLowerCase()} successfully`);
      setListings(current => 
        current.map(listing => 
          listing._id === listingId ? { ...listing, status } : listing
        )
      );
      if (selectedListing && selectedListing._id === listingId) {
        setSelectedListing({ ...selectedListing, status });
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Listings Management</h1>
        <div className="text-neutral-500">{listings.length} total listings</div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">ID</th>
              <th className="p-4 font-semibold text-neutral-600">Title</th>
              <th className="p-4 font-semibold text-neutral-600">Host</th>
              <th className="p-4 font-semibold text-neutral-600">Location</th>
              <th className="p-4 font-semibold text-neutral-600">Price</th>
              <th className="p-4 font-semibold text-neutral-600">Status</th>
              <th className="p-4 font-semibold text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4 text-sm text-neutral-500 font-mono">{listing._id.substring(0, 8)}...</td>
                <td className="p-4 font-medium">{listing.title}</td>
                <td className="p-4">{listing.user?.name || "Unknown"}</td>
                <td className="p-4">{listing.locationValue || listing.fullAddress}</td>
                <td className="p-4 font-semibold">₹{listing.price}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(listing.status || 'PENDING')}`}>
                    {listing.status || 'PENDING'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedListing(listing)}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">
                  No listings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Listing Details */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 bg-neutral-50">
              <div>
                <h2 className="text-xl font-bold">{selectedListing.title}</h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Host: {selectedListing.user?.name} ({selectedListing.user?.email})
                </p>
              </div>
              <button 
                onClick={() => setSelectedListing(null)}
                className="p-2 hover:bg-neutral-200 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-2">Description</h3>
                  <p className="text-neutral-600 text-sm">{selectedListing.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Property Type</h3>
                    <p className="text-neutral-600 text-sm">{selectedListing.propertyType}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Price</h3>
                    <p className="text-neutral-600 text-sm">₹{selectedListing.price} / night</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Location</h3>
                    <p className="text-neutral-600 text-sm">{selectedListing.fullAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Coordinates</h3>
                    <p className="text-neutral-600 text-sm">Lat: {selectedListing.coordinates?.lat}, Lng: {selectedListing.coordinates?.lng}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-800 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.amenities?.map((amenity: string) => (
                      <span key={amenity} className="px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Check-in</h3>
                    <p className="text-neutral-600 text-sm">{selectedListing.checkInTime || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Check-out</h3>
                    <p className="text-neutral-600 text-sm">{selectedListing.checkOutTime || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-2">Rules & Activities</h3>
                    <div className="flex flex-col gap-1 text-sm text-neutral-600">
                      <div><span className="font-medium">Smoking:</span> {selectedListing.smokingAllowed ? 'Allowed' : 'Not allowed'}</div>
                      <div><span className="font-medium">Pets:</span> {selectedListing.petsAllowed ? 'Allowed' : 'Not allowed'}</div>
                      <div><span className="font-medium">Parties:</span> {selectedListing.partyAllowed ? 'Allowed' : 'Not allowed'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-2">Additional Pricing</h3>
                    <div className="flex flex-col gap-1 text-sm text-neutral-600">
                      <div><span className="font-medium">Weekend Price:</span> {selectedListing.weekendPrice ? `₹${selectedListing.weekendPrice}` : 'N/A'}</div>
                      <div><span className="font-medium">Festival Price:</span> {selectedListing.festivalPrice ? `₹${selectedListing.festivalPrice}` : 'N/A'}</div>
                      <div><span className="font-medium">Welcome Offer:</span> {selectedListing.hasWelcomeOffer ? 'Active' : 'No'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Host Private Contact Details */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    Host Private Contact Details
                  </h3>
                  <div className="grid grid-cols-1 gap-2 text-sm text-amber-800">
                    <div><span className="font-medium">Name:</span> {selectedListing.hostContactDetails?.name || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {selectedListing.hostContactDetails?.email || 'N/A'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedListing.hostContactDetails?.phone || 'N/A'}</div>
                    {selectedListing.hostContactDetails?.alternatePhone && (
                      <div><span className="font-medium">Alt Phone:</span> {selectedListing.hostContactDetails?.alternatePhone}</div>
                    )}
                    {selectedListing.hostContactDetails?.companyName && (
                      <div><span className="font-medium">Company:</span> {selectedListing.hostContactDetails?.companyName}</div>
                    )}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    Cancellation Policy
                  </h3>
                  <p className="text-sm text-red-800 mb-3">{selectedListing.cancellationPolicy || 'Flexible'}</p>
                  
                  {selectedListing.cancellationRules?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-semibold text-red-900 uppercase">Tiers</div>
                      {selectedListing.cancellationRules.map((rule: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm text-red-800 bg-red-100/50 p-2 rounded border border-red-100">
                          <span>{rule.days} days before check-in</span>
                          <span className="font-semibold">{rule.deduction}% Penalty</span>
                        </div>
                      ))}
                    </div>
                  ) : (selectedListing.cancellationDays !== undefined && selectedListing.cancellationDays > 0) ? (
                    <div className="flex justify-between items-center text-sm text-red-800 bg-red-100/50 p-2 rounded border border-red-100">
                      <span>{selectedListing.cancellationDays} days before check-in</span>
                      <span className="font-semibold">{selectedListing.cancellationDeduction || 0}% Penalty</span>
                    </div>
                  ) : (
                    <div className="text-sm text-red-800 bg-red-100/50 p-2 rounded border border-red-100 italic">
                      No specific penalty tiers set.
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    Hourly Bookings
                  </h3>
                  <div className="text-sm text-blue-800 mb-3">
                    <span className="font-medium">Status: </span>
                    {selectedListing.allowsHourlyBooking ? (
                      <span className="text-green-700 font-semibold">Enabled</span>
                    ) : (
                      <span className="text-neutral-500 font-semibold">Disabled</span>
                    )}
                  </div>
                  
                  {selectedListing.allowsHourlyBooking && selectedListing.hourlyRates && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm text-blue-800 bg-blue-100/50 p-2 rounded border border-blue-100">
                        <span>2-Hour Slot</span>
                        <span className="font-semibold">₹{selectedListing.hourlyRates.twoHours || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-blue-800 bg-blue-100/50 p-2 rounded border border-blue-100">
                        <span>3-Hour Slot</span>
                        <span className="font-semibold">₹{selectedListing.hourlyRates.threeHours || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-blue-800 bg-blue-100/50 p-2 rounded border border-blue-100">
                        <span>4-Hour Slot</span>
                        <span className="font-semibold">₹{selectedListing.hourlyRates.fourHours || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-800 mb-2">Images ({selectedListing.imageSrc?.length})</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedListing.imageSrc?.slice(0, 6).map((src: string, index: number) => (
                      <img key={index} src={src} alt="Property" className="w-full h-24 object-cover rounded-lg border border-neutral-200" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-800 mb-2">Rooms ({selectedListing.rooms?.length || 0})</h3>
                  <div className="flex flex-col gap-3">
                    {selectedListing.rooms?.map((room: any, index: number) => (
                      <div key={index} className="p-3 border border-neutral-200 rounded-lg">
                        <div className="font-medium text-sm">{room.type}</div>
                        <div className="text-xs text-neutral-500 flex justify-between mt-1">
                          <span>₹{room.price}/night</span>
                          <span>{room.capacity} Guests</span>
                          <span>Qty: {room.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-600">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedListing.status || 'PENDING')}`}>
                  {selectedListing.status || 'PENDING'}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus(selectedListing._id, 'REJECTED')}
                  disabled={isLoading || selectedListing.status === 'REJECTED'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedListing._id, 'APPROVED')}
                  disabled={isLoading || selectedListing.status === 'APPROVED'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition shadow-md"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
