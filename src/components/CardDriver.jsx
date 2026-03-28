import { Mail, Phone, IdCard, Pencil, Trash2, UserXIcon } from "lucide-react";

export default function CardDriver({
  driver,
  onView,
  onEdit,
  onDelete,
  highlight = false,
}) {
  return (
    <div
      className={`card shadow  ${
        highlight
          ? "bg-green-900 border-green-600 text-white rounded-xl"
          : "bg-base-100 rounded-md"
      }`}
    >
      <figure className="px-4 pt-5">
        {driver.image_url ? (
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-linear-to-r from-emerald-100 to-green-200">
            <img
              src={driver.image_url}
              alt={`${driver.first_name} ${driver.last_name}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="w-full aspect-square bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden">
            <UserXIcon className="size-12 text-gray-300" />
          </div>
        )}
      </figure>

      <div className="card-body p-4 pt-2">
        <div>
          <h2
            className={`card-title text-sm font-bold truncate ${highlight ? "text-white" : ""}`}
          >
            {driver.first_name} {driver.last_name}
          </h2>
          <p
            className={`capitalize text-sm ${highlight ? "text-gray-200" : ""}`}
          >
            {driver.designation}
          </p>
        </div>

        <div
          className={`flex gap-2 items-center ${highlight ? "text-gray-200" : ""}`}
        >
          <Mail
            className={`size-4 ${highlight ? "text-gray-200" : "text-green-700"}`}
          />
          <p className="text-xs truncate">{driver.email}</p>
        </div>

        <div
          className={`flex gap-2 items-center ${highlight ? "text-gray-200" : ""}`}
        >
          <Phone
            className={`size-4 ${highlight ? "text-gray-200" : "text-green-700"}`}
          />
          <p className="text-xs">{driver.contact_number || "no number yet."}</p>
        </div>
      </div>

      <div className="flex justify-end gap-1 px-2 pb-2">
        <button
          onClick={() => onView(driver)}
          className={`btn btn-ghost btn-square btn-sm ${highlight ? "text-yellow-300" : "text-yellow-500"}`}
        >
          <IdCard className="h-4 w-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(driver);
          }}
          className={`btn btn-ghost btn-square btn-sm ${highlight ? "text-blue-300" : "text-blue-500"}`}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(driver);
          }}
          className={`btn btn-ghost btn-square btn-sm ${highlight ? "text-red-400" : "text-error"}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
