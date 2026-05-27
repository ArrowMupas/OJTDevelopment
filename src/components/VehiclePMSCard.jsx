import clsx from "clsx";
import { Van } from "lucide-react";

export default function VehiclePMSCard({
  status,
  children,
  vehicle,
  className = "",
}) {
  return (
    <div
      className={clsx(
        "card relative shadow-sm transition-all hover:ring-2",
        !status && "bg-base-100",

        status === "overdue" &&
          "border-error bg-error/10 hover:ring-error border",

        status === "dueSoon" &&
          "border-error bg-error/5 hover:ring-error border",

        status === "warning" &&
          "border-warning bg-warning/5 hover:ring-warning border",

        status === "ok" && "bg-base-100 hover:ring-success hover:bg-green-50",

        className,
      )}
    >
      <div className="card-body p-4">
        <div className="flex h-30 w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-100 sm:h-42">
          {vehicle?.image_url ? (
            <img
              src={vehicle?.image_url}
              alt={vehicle?.name}
              className="h-full w-full object-fill"
            />
          ) : (
            <Van className="size-12 text-gray-300" />
          )}
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-sm font-bold">{vehicle?.name}</p>
            <div className="badge badge-primary badge-dash badge-sm">
              {vehicle?.plate_number}
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-2 sm:space-y-4">{children}</div>
      </div>
    </div>
  );
}
