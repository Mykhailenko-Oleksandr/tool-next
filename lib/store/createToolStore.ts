import { CreatedFormData } from "@/types/created";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CreatingDraftStore = {
  draft: CreatedFormData;
  setDraft: (creating: CreatedFormData) => void;
  clearDraft: () => void;
};

const initialDraft: CreatedFormData = {
  name: "",
  pricePerDay: "",
  category: "",
  rentalTerms: "",
  description: "",
  specifications: "",
  images: "",
};

export const useCreatingDraftStore = create<CreatingDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (value) =>
        set((state) => ({ draft: { ...state.draft, ...value } })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "creating-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
