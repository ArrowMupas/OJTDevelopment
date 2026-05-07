import { create } from "zustand";
import { supabase } from "../supabaseClient";

const DESIGNATION_FILTERS = {
  service_drivers: [
    "Driver Mechanic B",
    "Driver Mechanic A",
    "Sr. Auto Mechanic",
  ],
};

const useDriverStore = create((set, get) => ({
  drivers: [],
  loading: false,
  error: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("last_name", { ascending: true });

      if (error) throw error;

      set({ drivers: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  refreshDrivers: async () => {
    await get().fetchDrivers();
  },

  getDrivers: (filterKey = null) => {
    const drivers = get().drivers;

    if (!filterKey) return drivers;

    const designationMap = DESIGNATION_FILTERS[filterKey];

    if (!designationMap) return drivers;

    return drivers.filter((d) => designationMap.includes(d.designation));
  },

  DESIGNATION_FILTERS,
}));

export default useDriverStore;
