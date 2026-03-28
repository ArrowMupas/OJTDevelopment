import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Mail, Phone, UserXIcon } from "lucide-react";
import ModalLicense from "../../components/ModalLicense";

export default function StaffPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [licenseToView, setLicenseToView] = useState(null);

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true);
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("first_name", { ascending: true });

      if (error) console.error("Error fetching drivers:", error);
      else setDrivers(data);

      setLoading(false);
    }

    fetchDrivers();
  }, []);

  const keyDesignations = [
    "Transport Operations Services Chief",
    "Sr. Auto Mechanic",
    "Data Transport",
    "Maintenance",
    "Driver Mechanic A",
  ];

  const keyPersonnel = drivers.filter((d) =>
    keyDesignations.includes(d.designation),
  );

  const regularDrivers = drivers.filter(
    (d) => !keyDesignations.includes(d.designation),
  );

  const renderDriverCard = (driver) => (
    <div key={driver.id} className="card bg-base-100 shadow rounded">
      <div className="w-full aspect-square bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden mb-2">
        {driver.image_url ? (
          <img
            src={driver.image_url}
            alt={`${driver.first_name} ${driver.last_name}`}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <UserXIcon className="size-12 text-gray-300" />
        )}
      </div>

      <div className="text-center space-y-1 w-full">
        <h2 className="text-sm  truncate">
          {driver.first_name} {driver.last_name}
        </h2>
        <p className="capitalize text-xs">{driver.designation}</p>

        <div className="flex items-center gap-1 justify-center text-xs">
          <Mail className="size-4 text-green-700" />
          <p className="truncate">{driver.email || "No email"}</p>
        </div>

        <div className="flex items-center gap-1 justify-center text-xs">
          <Phone className="size-4 text-green-700" />
          <p>{driver.contact_number || "No number"}</p>
        </div>

        <button
          onClick={() => {
            setLicenseToView(driver.license_url);
            document.getElementById("licenseModal")?.showModal();
          }}
          className="underline text-blue-600 text-xs mt-1"
        >
          View License
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto py-20 min-h-screen">
      <div>
        <h1 className="text-xl  mb-4">Key Personnel</h1>
        {loading ? (
          <p>Loading...</p>
        ) : keyPersonnel.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {keyPersonnel.map(renderDriverCard)}
          </div>
        ) : (
          <p>No key personnel found.</p>
        )}
      </div>

      <div>
        <h1 className="text-xl  mb-4">Other Drivers</h1>
        {loading ? (
          <p>Loading...</p>
        ) : regularDrivers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {regularDrivers.map(renderDriverCard)}
          </div>
        ) : (
          <p>No other drivers found.</p>
        )}
      </div>

      <ModalLicense
        licenseFront={licenseToView}
        licenseBack={null}
        onClose={() => {
          setLicenseToView(null);
          document.getElementById("licenseModal")?.close();
        }}
      />
    </div>
  );
}
