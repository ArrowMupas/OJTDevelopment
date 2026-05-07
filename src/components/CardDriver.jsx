import {
  Mail,
  Phone,
  IdCard,
  Pencil,
  Trash2,
  UserXIcon,
  Wrench,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";

export default function CardDriver({
  driver,
  onView,
  onEdit,
  onDelete,
  highlight = false,
}) {
  const isExpired =
    driver.license_expiration &&
    new Date(driver.license_expiration) < new Date();

  return (
    <div
      className={clsx(
        "card relative shadow",
        highlight
          ? "rounded-xl border-green-600 bg-green-900 text-white"
          : "bg-base-100 rounded-md",
        isExpired && "border border-red-500",
      )}
    >
      {isExpired && (
        <div className="badge badge-error badge-soft badge-sm absolute top-1 right-1 gap-1">
          <AlertTriangle className="size-3" />
          License Expired
        </div>
      )}

      <figure className="px-3 pt-3">
        {driver.image_url ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-100 to-green-200">
            <img
              src={driver.image_url}
              alt={`${driver.first_name} ${driver.last_name}`}
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-emerald-100 to-green-200">
            <UserXIcon className="size-12 text-gray-300" />
          </div>
        )}
      </figure>

      <div className="card-body p-4 pt-2">
        <div>
          <h2
            className={clsx(
              "card-title truncate text-sm font-bold capitalize",
              highlight && "text-white",
            )}
          >
            {driver.last_name}{" "}
            {driver.middle_initial && <span>{driver.middle_initial}.</span>}
            {driver.first_name}
          </h2>
          <p
            className={clsx("text-sm capitalize", highlight && "text-gray-200")}
          >
            {driver.designation}
          </p>
        </div>

        <div
          className={clsx(
            "flex items-center gap-2",
            highlight ? "text-gray-200" : "",
          )}
        >
          <Mail
            className={clsx(
              "size-4",
              highlight ? "text-gray-200" : "text-green-700",
            )}
          />
          <p className="truncate text-xs">{driver.email}</p>
        </div>

        <div
          className={clsx(
            "flex items-center gap-2",
            highlight ? "text-gray-200" : "",
          )}
        >
          <Phone
            className={clsx(
              "size-4",
              highlight ? "text-gray-200" : "text-green-700",
            )}
          />
          <p className="text-xs">{driver.contact_number || "no number yet."}</p>
        </div>

        {driver.is_mechanic && (
          <div
            className={clsx(
              "flex items-center gap-2",
              highlight ? "text-yellow-200" : "text-orange-600",
            )}
          >
            <Wrench className="size-4" />

            <p className="text-xs font-medium">Mechanic</p>
          </div>
        )}

        {driver.license_expiration && (
          <div
            className={clsx(
              "flex items-center gap-2",
              isExpired
                ? "text-red-500"
                : highlight
                  ? "text-gray-200"
                  : "text-gray-600",
            )}
          >
            <CalendarClock
              className={clsx(
                "size-4",
                isExpired
                  ? "text-red-500"
                  : highlight
                    ? "text-gray-200"
                    : "text-green-700",
              )}
            />

            <p className="text-xs font-medium">
              License Exp:{" "}
              {new Date(driver.license_expiration).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-1 px-2 pb-2">
        <button
          onClick={() => onView(driver)}
          className={clsx(
            "btn btn-square btn-outline btn-sm",
            highlight ? "text-yellow-300" : "text-warning",
          )}
        >
          <IdCard className="h-4 w-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(driver);
          }}
          className={clsx(
            "btn btn-square btn-outline btn-sm",
            highlight ? "text-blue-300" : "text-blue-500",
          )}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(driver);
          }}
          className="btn btn-square btn-outline btn-sm text-error"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
