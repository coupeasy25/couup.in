"use client";

import { Clock, ShieldAlert, Ban, CheckCircle2, CigaretteOff, Dog, PartyPopper } from "lucide-react";

interface ListingPoliciesProps {
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  cancellationRules?: { days: number; deduction: number }[];
  cancellationDays?: number;
  cancellationDeduction?: number;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  partyAllowed?: boolean;
}

const ListingPolicies: React.FC<ListingPoliciesProps> = ({
  checkInTime = "Not specified",
  checkOutTime = "Not specified",
  cancellationPolicy = "Not specified",
  cancellationRules = [],
  cancellationDays = 0,
  cancellationDeduction = 0,
  smokingAllowed = false,
  petsAllowed = false,
  partyAllowed = false,
}) => {
  return (
    <div className="flex flex-col gap-6 py-4">
      <h2 className="text-2xl font-semibold">House Rules & Policies</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">

        {/* Timing */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Clock size={20} />
            Timing
          </div>
          <div className="flex flex-col gap-1 text-neutral-600 font-light text-base">
            <div>Check-in: {checkInTime}</div>
            <div>Check-out: {checkOutTime}</div>
          </div>
        </div>

        {/* Cancellation */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <ShieldAlert size={20} />
            Cancellation
          </div>
          <div className="text-neutral-600 font-light text-base leading-relaxed">
            {cancellationPolicy}

            {((cancellationRules?.length > 0) || (cancellationDays !== undefined && cancellationDays > 0)) && (
              <div className="mt-5 flex flex-col gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                {cancellationRules?.length > 0 ? (
                  cancellationRules.map((rule: any, idx: number) => (
                    <div key={idx} className={`flex justify-between items-center text-sm ${idx !== cancellationRules.length - 1 ? 'pb-3 border-b border-neutral-200' : ''}`}>
                      <span className="text-neutral-600">Cancel {rule.days} days before</span>
                      <span className="font-semibold text-neutral-900">{rule.deduction}% Penalty</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-600">Cancel {cancellationDays} days before</span>
                    <span className="font-semibold text-neutral-900">{cancellationDeduction || 0}% Penalty</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rules */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Ban size={20} />
            House Rules
          </div>
          <div className="flex flex-col gap-2 text-neutral-600 font-light text-base">
            <div className="flex items-center gap-2">
              {smokingAllowed ? <CheckCircle2 size={16} className="text-green-500" /> : <CigaretteOff size={16} className="text-red-500" />}
              {smokingAllowed ? "Smoking allowed" : "No smoking"}
            </div>
            <div className="flex items-center gap-2">
              {petsAllowed ? <CheckCircle2 size={16} className="text-green-500" /> : <Dog size={16} className="text-red-500" />}
              {petsAllowed ? "Pets allowed" : "No pets"}
            </div>
            <div className="flex items-center gap-2">
              {partyAllowed ? <CheckCircle2 size={16} className="text-green-500" /> : <PartyPopper size={16} className="text-red-500" />}
              {partyAllowed ? "Parties allowed" : "No parties"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingPolicies;
