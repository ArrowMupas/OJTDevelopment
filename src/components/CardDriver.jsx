import { Mail, Phone, IdCard, Pencil, Trash2, UserXIcon } from "lucide-react";
import clsx from "clsx";

export default function CardDriver({
  driver,
  onView,
  onEdit,
  onDelete,
  highlight = false,
}) {
  return (
    <div
      className={clsx(
        "card shadow",
        highlight
          ? "rounded-xl border-green-600 bg-green-900 text-white"
          : "bg-base-100 rounded-md",
      )}
    >
      <figure className="px-4 pt-5">
        {driver.image_url ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-100 to-green-200">
            <img
              src={driver.image_url}
              alt={`${driver.first_name} ${driver.last_name}`}
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
            {driver.first_name}
            {driver.middle_initial && (
              <span>{driver.middle_initial}.</span>
            )}{" "}
            {driver.last_name}
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
      </div>

      <div className="flex justify-end gap-1 px-2 pb-2">
        <button
          onClick={() => onView(driver)}
          className={clsx(
            "btn btn-ghost btn-square btn-sm",
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
            "btn btn-ghost btn-square btn-sm",
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
          className="btn btn-ghost btn-square btn-sm text-error"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
