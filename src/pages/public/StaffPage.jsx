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

  const chief = drivers.filter(
    (d) => d.designation === "Transport Operations Services Chief",
  );

  const dataTransport = drivers.filter(
    (d) => d.designation === "Data Transport",
  );

  const maintenance = drivers.filter((d) => d.designation === "Maintenance");

  const mechanics = drivers.filter(
    (d) =>
      d.designation === "Sr. Auto Mechanic" ||
      d.designation === "Driver Mechanic A",
  );

  const regularDrivers = drivers.filter(
    (d) =>
      ![
        "Transport Operations Services Chief",
        "Data Transport",
        "Maintenance",
        "Sr. Auto Mechanic",
        "Driver Mechanic A",
      ].includes(d.designation),
  );

  const renderDriverCard = (driver, size = "normal") => {
    const sizeClass =
      size === "large"
        ? "max-w-[220px] text-sm"
        : size === "medium"
          ? "max-w-[200px] text-sm"
          : "max-w-[160px] text-xs";

    return (
      <div
        key={driver.id}
        className={`group card rounded-xl border border-emerald-100 bg-white/80 p-3 shadow-md backdrop-blur transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:shadow-xl ${sizeClass}`}
      >
        <div className="mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-200 to-green-300">
          {driver.image_url ? (
            <img
              src={driver.image_url}
              alt={`${driver.first_name} ${driver.last_name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserXIcon className="size-12 text-gray-300" />
          )}
        </div>

        <div className="text-center">
          {/* NAME & TITLE */}
          <div className="mb-2">
            <h2 className="truncate font-semibold text-emerald-800 transition group-hover:text-emerald-700">
              {driver.first_name} {driver.last_name}
            </h2>
            <p className="text-[11px] tracking-wide text-emerald-600 uppercase">
              {driver.designation}
            </p>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-1 text-[11px] text-gray-600">
            <div className="flex items-center justify-center gap-1">
              <Mail className="size-3 text-emerald-500" />
              <p className="max-w-[140px] leading-tight break-all">
                {driver.email || "No email"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1">
              <Phone className="size-3 text-emerald-500" />
              <p className="leading-tight">
                {driver.contact_number || "No number"}
              </p>
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={() => {
              setLicenseToView(driver.license_url);
              document.getElementById("licenseModal")?.showModal();
            }}
            className="mt-2 inline-block rounded-full bg-emerald-600 px-2 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
          >
            View License
          </button>
        </div>
      </div>
    );
  };

  const Connector = () => (
    <div className="flex justify-center">
      <div className="h-10 w-px bg-emerald-300" />
    </div>
  );

  return (
    // FULL SCREEN BACKGROUND FIX
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-emerald-50">
      {/* CONTENT WRAPPER (centered, does NOT control background) */}
      <div className="mx-auto max-w-6xl space-y-6 p-8 py-14">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-emerald-700">
                Key Personnels
              </h1>
              <p className="mt-2 text-gray-600">
                Here are the key personnel of Transportation Operation Service
                Unit (TOSU)
              </p>
            </div>
            {/* CHIEF */}
            <div className="flex flex-col items-center">
              {chief.map((d) => renderDriverCard(d, "large"))}
            </div>

            <Connector />

            {/* DATA TRANSPORT */}
            <div className="flex flex-col items-center">
              {dataTransport.map((d) => renderDriverCard(d, "medium"))}
            </div>

            <Connector />

            {/* MAINTENANCE */}
            <div className="flex flex-col items-center">
              {maintenance.map((d) => renderDriverCard(d, "medium"))}
            </div>

            <Connector />

            {/* MECHANICS */}
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-6">
                {mechanics.map((d) => renderDriverCard(d, "medium"))}
              </div>
            </div>

            <Connector />

            {/* DRIVERS */}
            <div className="text-center">
              <h1 className="mb-4 text-lg font-semibold text-emerald-700">
                Drivers
              </h1>
              <div className="flex flex-wrap justify-center gap-4">
                {regularDrivers.map((d) => renderDriverCard(d, "small"))}
              </div>
            </div>
          </>
        )}

        <ModalLicense
          licenseFront={licenseToView}
          licenseBack={null}
          onClose={() => {
            setLicenseToView(null);
            document.getElementById("licenseModal")?.close();
          }}
        />
      </div>
    </div>
  );
}
