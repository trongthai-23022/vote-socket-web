import { create } from 'zustand';

//tạo store = zustand
interface UserState {
  name: string;
  setName: (name: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  name: '',
  setName: (name) => set({ name })
}));

export default useUserStore;