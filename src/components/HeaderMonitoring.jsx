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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              {title}
            </h1>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="btn btn-accent text-white gap-2"
        >
          <History size={18} /> View History
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between ">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 mb-2">
            <label className="input input-neutral w-full">
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

            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn bg-green-600 text-white"
              >
                <FilterIcon className="h-4 w-6" /> Filter
              </div>

              <ul className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm">
                <li>
                  <a>Ascending</a>
                </li>
                <li>
                  <a>Descending</a>
                </li>
              </ul>
            </div>
          </div>

          <div role="tablist" className="tabs tabs-border">
            <NavLink to="/vehiclemonitoring" className={tabClass("pms")}>
              <Gauge className="size-4" />
              PMS
            </NavLink>

            <NavLink to="/battery" className={tabClass("battery")}>
              <BatteryCharging className="size-4" />
              Battery
            </NavLink>

            <NavLink to="/tires" className={tabClass("tires")}>
              <LoaderPinwheel className="size-4" />
              Tires
            </NavLink>
          </div>
        </div>

        <div className=" overflow-auto">
          <div className="grid grid-cols-3 gap-2 min-w-150">
            <div className="stat bg-base-100 shadow rounded-md">
              <div className="stat-figure">
                <ClipboardClock className="size-8 text-yellow-500 " />
              </div>
              <div className="stat-title">Due In 2 months</div>
              <div className="stat-value text-yellow-500 ">{warning}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-md">
              <div className="stat-figure">
                <ClipboardClock className="size-8 text-error" />
              </div>
              <div className="stat-title">Due in 1 month</div>
              <div className="stat-value text-error">{dueSoon}</div>
            </div>
            <div className="stat bg-red-100 shadow rounded-md border-red-200 ">
              <div className="stat-figure">
                <ClipboardX className="size-8 text-red-600" />
              </div>
              <div className="stat-title">Overdue</div>
              <div className="stat-value text-red-600 ">{overdue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
