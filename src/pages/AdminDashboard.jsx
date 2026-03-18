import {
  ArchiveX,
  BookAlert,
  ChartSpline,
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  ClockArrowDown,
  FileCheck,
  FileX,
  OctagonAlert,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

export default function AdminDashboard() {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const lineData = {
    labels,
    datasets: [
      {
        label: "Completed",
        data: [80, 55, 70, 90, 80, 55, 70, 45, 25, 30, 70, 90],
        borderColor: "#30694B",
        backgroundColor: "#30694B",
        pointBackgroundColor: "#30694B",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Pending",
        data: [20, 35, 20, 33, 65, 90, 30, 60, 80, 90, 70, 20],
        borderColor: "#62BD69",
        backgroundColor: "#62BD69",
        pointBackgroundColor: "#62BD69",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: [
      "PMS Overdue",
      "PMS Due Soon",
      "PMS Up-to-Date",
      "Expired Insurance",
      "Active Insurance",
      "Insurance Expiring Soon",
    ],
    datasets: [
      {
        data: [4, 9, 16, 8, 2, 4],
        backgroundColor: [
          "#003A6B",
          "#1B5886",
          "#3776A1",
          "#5293BB",
          "#6EB1D6",
          "#89CFF1",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <main className="px-5 py-4 pb-40 h-full">
      <h1 className="text-lg font-bold ">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Overall view of system data.</p>

      <h1 className="text-SM font-bold mb-1 mt-8 text-green-700">
        VEHICLE REQUESTS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEFT: Stats */}
        <div className="grid grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="card bg-base-100 card-md shadow-sm relative">
            <div className="card-body flex flex-col justify-between border-highlight border-2 rounded-sm">
              <div>
                <p>Today's Request</p>
                <h2 className="card-title">19</h2>
              </div>
              <Clipboard className="h-8 w-12 text-highlight self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-100 card-md shadow-sm relative">
            <div className="card-body flex flex-col justify-between border-highlight border-2 rounded-sm">
              <div>
                <p>Total Monthly Request</p>
                <h2 className="card-title">34</h2>
              </div>
              <ClipboardClock className="h-8 w-12 text-highlight self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm mt-6">
            <div className="card-body flex-row justify-between border-[#30694B] border-2 rounded-sm">
              <div>
                <p>Completed Request</p>
                <h2 className="card-title">7</h2>
              </div>
              <ClipboardCheck className="h-8 w-12 text-[#30694B] self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>

          <div className="card mt-6">
            <div className="card-body flex-row justify-between border-[#30694B] border-2 rounded-sm">
              <div>
                <p>Pending Request</p>
                <h2 className="card-title">14</h2>
              </div>
              <ClipboardClock className="h-8 w-12 text-[#30694B] self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="card bg-base-100 shadow-xl p-6 border-2 border-highlight rounded-sm">
          <h2 className="text-xl font-bold mb-4">Request Chart</h2>
          <Line data={lineData} />
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
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
        </div>
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div>
              <h2 className="card-title">12</h2>
              <p>Monthly Survey Total</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
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
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
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
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
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
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
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
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">16</h2>
                <p>Vehicles PMS Up-to-Date</p>
              </div>
              <Wrench className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">9</h2>
                <p>Vehicles PMS Due Soon</p>
              </div>
              <TriangleAlert className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">4</h2>
                <p>Insurance Expiring Soon</p>
              </div>
              <BookAlert className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">8</h2>
                <p>Expired Insurances</p>
              </div>
              <FileX className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
              <div>
                <h2 className="card-title">2</h2>
                <p>Active Insurances</p>
              </div>
              <FileCheck className="h-8 w-12 mr-2 text-[#1B4079]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 ease-in-out hover:opacity-30 rounded-sm"></div>
          </div>
        </div>
        <div className="flex w-full justify-center bg-base-100 shadow-xl rounded-sm border-2 border-[#1B4079]">
          {/* Doughnut Chart */}
          <div className="card bg-base-100 p-5 w-100">
            <h2 className="text-xl font-bold mb-4 justify-center text-center">
              Compliance Chart
            </h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </main>
  );
}
