import {
  ChartSpline,
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  ClockArrowDown,
  Ellipsis,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="px-5 py-4 pb-40 h-full">
      <h1 className="text-lg font-bold ">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Overall view of system data.</p>

      <div className="grid grid-cols-1 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="">
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body h-53 border-[#745fc9] border-b-2 rounded-sm">
                <div>
                  <h2 className="card-title">Graphs/Chart Here</h2>
                  <p>Insert Chart here.</p>
                </div>
                <ChartSpline className="h-8 w-12 mr-2 text-[#745fc9]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-SM font-bold mb-1 mt-8 text-green-700">
        VEHICLE REQUESTS
      </h1>
      <div className="grid grid-cols-2 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="grid grid-cols-2 md:flex-row gap-5">
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
                <div>
                  <h2 className="card-title">4</h2>
                  <p>Completed Request</p>
                </div>
                <ClipboardCheck className="h-8 w-12 mr-2 text-highlight" />
              </div>
            </div>
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
                <div>
                  <h2 className="card-title">19</h2>
                  <p>Pending Request</p>
                </div>
                <ClipboardClock className="h-8 w-12 mr-2 text-highlight" />
              </div>
            </div>
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
                <div>
                  <h2 className="card-title">19</h2>
                  <p>Pending Request</p>
                </div>
                <ClipboardClock className="h-8 w-12 mr-2 text-highlight" />
              </div>
            </div>
            <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">21</h2>
                <p>Today's Request</p>
              </div>
              <Clipboard className="h-8 w-12 mr-2 text-highlight" />
            </div>
          </div>
        </div>
        <div className="">
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body h-53 border-highlight border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">Pendings</h2>
                <p>Probably table type for Vehicle Request</p>
              </div>
              <ClockArrowDown className="h-8 w-12 mr-2 text-highlight" />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-SM font-bold mb-1 text-[#745fc9] mt-10">
        Driver Monitoring
      </h1>
      <div className="grid grid-cols-2 md:flex-row gap-5">
        <div className="grid grid-cols-2 md:flex-row gap-5">
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body h-53 border-[#745fc9] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">Expiring Soon</h2>
              <p>Probably table type for Vehicle Repair/Monitoring</p>
            </div>
            <TriangleAlert className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
        </div>
      </div>

      <h1 className="text-SM font-bold mb-1 mt-10 text-[#E8CF00]">
        Compliance Monitoring
      </h1>
      <div className="grid grid-cols-2 md:flex-row gap-5">
        <div className="grid grid-cols-2 md:flex-row gap-5">
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#d2dc15]" />
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#d2dc15]" />
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#d2dc15]" />
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Completed Request</p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-[#d2dc15]" />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body h-53 border-[#d2dc15] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">Overdue Soon</h2>
              <p>Probably table type for Comliance Monitoring</p>
            </div>
            <OctagonAlert className="h-8 w-12 mr-2 text-[#d2dc15]" />
          </div>
        </div>
      </div>
    </main>
  );
}
