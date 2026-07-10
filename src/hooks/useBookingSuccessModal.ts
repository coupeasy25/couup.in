import { create } from 'zustand';

interface BookingDetails {
  id?: string;
  listingTitle: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  guests: any[];
  roomsCount?: number;
}

interface BookingSuccessModalStore {
  isOpen: boolean;
  bookingDetails: BookingDetails | null;
  onOpen: (details: BookingDetails) => void;
  onClose: () => void;
}

const useBookingSuccessModal = create<BookingSuccessModalStore>((set) => ({
  isOpen: false,
  bookingDetails: null,
  onOpen: (details) => set({ isOpen: true, bookingDetails: details }),
  onClose: () => set({ isOpen: false, bookingDetails: null })
}));

export default useBookingSuccessModal;
