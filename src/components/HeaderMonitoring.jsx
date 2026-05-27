import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  FilterIcon,
  History,
  Gauge,
  BatteryCharging,
  LoaderPinwheel,
  ClipboardClock,
  ClipboardX,
} from "lucide-react";
import clsx from "clsx";

export default function HeaderMonitoring({
  title,
  description,
  search,
  setSearch,
  debouncedSearch,
  activeTab,
  dueSoon,
  warning,
  overdue,
}) {
  const navigate = useNavigate();

  const tabClass = (tab) =>
    `tab flex gap-2 ${activeTab === tab ? "tab-active" : ""}`;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-5">
          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold">
              {title}
            </h1>
            <div className="line-clamp-1 text-sm text-gray-500 sm:line-clamp-none">
              {description}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="btn btn-info gap-2 text-white"
        >
          <History className="size-4" />
          <span className="hidden sm:inline">View History</span>
        </button>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center justify-end gap-2">
          <div className="flex w-full flex-row items-start gap-2 sm:flex-col">
            <label className="input input-neutral">
              <Search className="h-4 w-6" />
              <input
                type="search"
                placeholder="Search by plate number..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  debouncedSearch(value);
                }}
              />
            </label>

            <div className="join rounded-lg bg-gray-100 p-1">
              <NavLink
                to="/pms"
                className={({ isActive }) =>
                  clsx(
                    "btn btn-sm join-item",
                    isActive ? "btn-primary text-white" : "btn-outline",
                  )
                }
              >
                PMS
              </NavLink>

              <NavLink
                to="/battery"
                className={({ isActive }) =>
                  clsx(
                    "btn btn-sm join-item",
                    isActive ? "btn-primary text-white" : "btn-outline",
                  )
                }
              >
                Battery
              </NavLink>

              <NavLink
                to="/tires"
                className={({ isActive }) =>
                  clsx(
                    "btn btn-sm join-item",
                    isActive ? "btn-primary text-white" : "btn-outline",
                  )
                }
              >
                Tires
              </NavLink>
            </div>
          </div>
        </div>

        <div className="mb-4 overflow-auto sm:mb-0">
          <div className="grid min-w-150 grid-cols-3 gap-2">
            <div className="stat bg-base-100 rounded-md shadow">
              <div className="stat-figure">
                <ClipboardClock className="text-warning size-8" />
              </div>
              <div className="stat-title">Due In 2 months</div>
              <div className="stat-value text-warning">{warning}</div>
            </div>
            <div className="stat bg-base-100 rounded-md shadow">
              <div className="stat-figure">
                <ClipboardClock className="text-error size-8" />
              </div>
              <div className="stat-title">Due in 1 month</div>
              <div className="stat-value text-error">{dueSoon}</div>
            </div>
            <div className="stat rounded-md border-red-200 bg-red-100 shadow">
              <div className="stat-figure">
                <ClipboardX className="text-error size-8" />
              </div>
              <div className="stat-title">Overdue</div>
              <div className="stat-value text-error">{overdue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
