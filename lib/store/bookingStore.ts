import { BookingFormData } from "@/types/booked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookingDraftStore = {
  draft: BookingFormData;
  setDraft: (booking: BookingFormData) => void;
  clearDraft: () => void;
};

const initialDraft: BookingFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  startDate: "",
  endDate: "",
  deliveryCity: "",
  deliveryBranch: "",
};

export const useBookingDraftStore = create<BookingDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (value) =>
        set((state) => ({ draft: { ...state.draft, ...value } })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "booking-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
