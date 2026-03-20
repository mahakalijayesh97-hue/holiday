import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ITravelPlan } from '@/models/Inquiry';

interface PlanState {
    destination: string;
    days: number;
    plans: ITravelPlan[];
    selectedPlan: ITravelPlan | null;
    inquiryId: string;
    setDestination: (destination: string) => void;
    setDays: (days: number) => void;
    setPlans: (plans: ITravelPlan[]) => void;
    setSelectedPlan: (plan: ITravelPlan | null) => void;
    setInquiryId: (id: string) => void;
    reset: () => void;
}

export const usePlanStore = create<PlanState>()(
    persist(
        (set) => ({
            destination: '',
            days: 3,
            plans: [],
            selectedPlan: null,
            inquiryId: '',
            setDestination: (destination) => set({ destination }),
            setDays: (days) => set({ days }),
            setPlans: (plans) => set({ plans }),
            setSelectedPlan: (plan) => set({ selectedPlan: plan }),
            setInquiryId: (id) => set({ inquiryId: id }),
            reset: () => set({ destination: '', days: 3, plans: [], selectedPlan: null, inquiryId: '' }),
        }),
        {
            name: 'holiday-planner-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
