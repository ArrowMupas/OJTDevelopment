import {
  ArchiveX,
  BookAlert,
  ChartSpline,
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  ClockArrowDown,
  Ellipsis,
  FileCheck,
  FileX,
  OctagonAlert,
  TriangleAlert,
  Wrench,
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
        <div className="card bg-base-100 card-md">
          <div className="grid grid-cols-2 md:flex-row gap-5">
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-highlight border-2 rounded-sm">
                <div>
                  <h2 className="card-title">19</h2>
                  <p>Today's Request</p>
                </div>
                <Clipboard className="h-8 w-12 mr-2 text-highlight" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
            </div>
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-highlight border-2 rounded-sm">
                <div>
                  <h2 className="card-title">4</h2>
                  <p>Pending Request</p>
                </div>
                <ClipboardClock className="h-8 w-12 mr-2 text-highlight" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
            </div>
            {/* <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
                <div>
                  <h2 className="card-title">19</h2>
                  <p>Pending Request</p>
                </div>
                <ClipboardClock className="h-8 w-12 mr-2 text-highlight" />
              </div>
            </div> */}
          </div>
          <div className="card bg-base-100 card-md shadow-sm mt-5">
            <div className="card-body flex-row justify-between border-highlight border-2 rounded-sm">
              <div>
                <h2 className="card-title">7</h2>
                <p>Completed Request </p>
              </div>
              <ClipboardCheck className="h-8 w-12 mr-2 text-highlight" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
        </div>

        <div className="">
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body h-53 border-highlight border-b-2 rounded-sm">
              <div>
                <h2 className="card-title">Chart/Graph Here</h2>
                <p>Insert Chart here for Vehicle Request</p>
              </div>
              <ClockArrowDown className="h-8 w-12 mr-2 text-highlight" />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-SM font-bold mb-1 text-[#745fc9] mt-10">
        DRIVER MONITORING
      </h1>
      <div className="grid grid-cols-2 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div>
              <h2 className="card-title">4.4</h2>
              <p>Average Driver Rating</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
        </div>
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div>
              <h2 className="card-title">12</h2>
              <p>Monthly Survey Total</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
        </div>
        {/* <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body h-53 border-[#745fc9] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">Expiring Soon</h2>
              <p>Probably table type for Vehicle Repair/Monitoring</p>
            </div>
            <TriangleAlert className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
        </div> */}
      </div>
      <h1 className="text-SM font-bold text-[#745fc9] mt-4 mb-1">
        Top 3 Driver by Ratings
      </h1>
      <div className="grid grid-cols-3 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div>
              <h2 className="card-title">Rating: 4.9</h2>
              <p>Jayzen P. Galvez</p>
            </div>
            <img
              className="h-12 w-auto cursor-pointer"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899679.png"
              alt="first"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
        </div>
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div>
              <h2 className="card-title">Rating: 4.1</h2>
              <p>Joswe L. Tubio</p>
            </div>
            <img
              className="h-12 w-auto cursor-pointer"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899684.png"
              alt="first"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
        </div>
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div>
              <h2 className="card-title">Rating: 3.9</h2>
              <p>Dester O. Golloso</p>
            </div>
            <img
              className="h-12 w-auto cursor-pointer"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899691.png"
              alt="first"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
        </div>
      </div>

      <h1 className="text-SM font-bold mb-1 mt-10 text-[#1B4079]">
        COMPLIANCE MONITORING
      </h1>
      <div className="grid grid-cols-2 md:flex-row gap-5">
        <div className="grid grid-cols-2 md:flex-row gap-5">
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Vehicles PMS Overdue</p>
              </div>
              <ArchiveX className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div>
            <div className="card bg-base-100 card-md shadow-sm">
              <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
                <div>
                  <h2 className="card-title">16</h2>
                  <p>Vehicle PMS Up-to-Date</p>
                </div>
                <Wrench className="h-8 w-12 mr-2 text-[#1B4079]" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
            </div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">9</h2>
                <p>Vehicles PMS Due Soon</p>
              </div>
              <TriangleAlert className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Insurance Expiring Soon</p>
              </div>
              <BookAlert className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">8</h2>
                <p>Expired Insurances</p>
              </div>
              <FileX className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">2</h2>
                <p>Active Insurances</p>
              </div>
              <FileCheck className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body h-53 border-[#1B4079] border-b-4 rounded-xl">
            <div>
              <h2 className="card-title">Overdue Soon</h2>
              <p>Pie Chart here.</p>
            </div>
            <OctagonAlert className="h-8 w-12 mr-2 text-[#1B4079]" />
          </div>
        </div>
      </div>
    </main>
  );
}
