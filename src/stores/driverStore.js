import { create } from "zustand";
import { supabase } from "../supabaseClient";

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

  getDrivers: (filterKey = null) => {
    const { drivers } = get();

    if (filterKey === "service") {
      return drivers.filter((driver) =>
        [
          "Driver Mechanic B",
          "Driver Mechanic A",
          "Sr. Auto Mechanic",
        ].includes(driver.designation),
      );
    }

    return drivers;
  },

  refreshDrivers: async () => {
    await get().fetchDrivers();
  },
}));

export default useDriverStore;
