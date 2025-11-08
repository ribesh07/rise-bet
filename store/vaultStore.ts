import { create } from "zustand";

interface VaultState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

export const useVault = create<VaultState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
