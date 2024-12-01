import { create } from "zustand";

type SwipeDirection = "left" | "right" | null;

interface GestureState {
  isSmiling: boolean;
  swipeDirection: SwipeDirection;
  setSmiling: (isSmiling: boolean) => void;
  setSwipeDirection: (direction: SwipeDirection) => void;
}

const useGestureStore = create<GestureState>((set) => ({
  isSmiling: false,
  swipeDirection: null,
  setSmiling: (isSmiling) => set({ isSmiling }),
  setSwipeDirection: (direction) => set({ swipeDirection: direction }),
}));

export default useGestureStore;
