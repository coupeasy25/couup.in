"use client";

import { useCallback, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";

import useSearchModal from "@/hooks/useSearchModal";
import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [locationValue, setLocationValue] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      // Parse current query
      params.forEach((value, key) => {
        currentQuery = { ...currentQuery, [key]: value };
      });
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    // Filter out empty values
    Object.keys(updatedQuery).forEach((key) => {
      if (updatedQuery[key] === "" || updatedQuery[key] === null || updatedQuery[key] === undefined) {
        delete updatedQuery[key];
      }
    });

    const urlParams = new URLSearchParams(updatedQuery);
    const url = `/?${urlParams.toString()}`;

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    locationValue,
    router,
    guestCount,
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Where do you wanna go?</h2>
        <p className="text-gray-500 font-light">Find the perfect location!</p>
      </div>
      <Input
        value={locationValue}
        onChange={(e) => setLocationValue(e.target.value)}
        placeholder="Search destinations (e.g., Ahmedabad)"
      />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">When do you plan to go?</h2>
          <p className="text-gray-500 font-light">Make sure everyone is free!</p>
        </div>
        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">More information</h2>
          <p className="text-gray-500 font-light">Find your perfect place!</p>
        </div>
        <div className="flex flex-col gap-4">
          <Label>Guests</Label>
          <Input 
            type="number" 
            min="1" 
            value={guestCount} 
            onChange={(e) => setGuestCount(Number(e.target.value))} 
          />
          <Label>Rooms</Label>
          <Input 
            type="number" 
            min="1" 
            value={roomCount} 
            onChange={(e) => setRoomCount(Number(e.target.value))} 
          />
          <Label>Bathrooms</Label>
          <Input 
            type="number" 
            min="1" 
            value={bathroomCount} 
            onChange={(e) => setBathroomCount(Number(e.target.value))} 
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;
