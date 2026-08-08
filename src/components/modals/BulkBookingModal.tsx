"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useBulkBookingModal from "@/hooks/useBulkBookingModal";
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BulkBookingModal = () => {
  const bulkBookingModal = useBulkBookingModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      destination: "",
      numberOfGuests: "",
      expectedDate: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/bulk-bookings", data)
      .then(() => {
        toast.success("Request sent! We will contact you soon.");
        reset();
        bulkBookingModal.onClose();
      })
      .catch((error) => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Tell us about your trip</h3>
      <p className="text-neutral-500 font-light mb-2">
        Fill out this form and our team will get back to you with custom packages and exclusive bulk discounts.
      </p>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          disabled={isLoading}
          {...register("name", { required: true })}
          placeholder="Full Name"
        />
      </div>
      
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            {...register("email", { required: true })}
            placeholder="Email Address"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            disabled={isLoading}
            {...register("phone", { required: true })}
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="destination">Preferred Destination</Label>
          <Input
            id="destination"
            disabled={isLoading}
            {...register("destination")}
            placeholder="Destination (Optional)"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="numberOfGuests">Number of Guests</Label>
          <Input
            id="numberOfGuests"
            type="number"
            disabled={isLoading}
            {...register("numberOfGuests")}
            placeholder="e.g. 15"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="expectedDate">Expected Travel Date</Label>
        <Input
          id="expectedDate"
          type="date"
          disabled={isLoading}
          {...register("expectedDate")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes / Requirements</Label>
        <textarea
          id="notes"
          disabled={isLoading}
          {...register("notes")}
          placeholder="Any specific requirements? (e.g. corporate event, wedding, family reunion)"
          className={`
            w-full
            p-3
            min-h-[100px]
            font-light
            bg-white
            border
            rounded-md
            outline-none
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            border-neutral-200
            focus:border-black
          `}
        />
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={bulkBookingModal.isOpen}
      title="Book for Bulk"
      actionLabel="Request Custom Quote"
      onClose={bulkBookingModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default BulkBookingModal;
