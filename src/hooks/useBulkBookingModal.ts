import { create } from "zustand";

interface BulkBookingModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useBulkBookingModal = create<BulkBookingModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBulkBookingModal;
