import {
  ArchiveX,
  BookAlert,
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  FileCheck,
  FileX,
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
        <div className="grid grid-cols-2 gap-5">
          <div className="card bg-base-100 card-md shadow-sm relative">
            <div className="card-body flex flex-col justify-between border-highlight border-2 rounded-sm h-full">
              <div>
                <p className="stat-title">Today's Request</p>
                <h2 className="stat-value text-highlight">19</h2>
              </div>
              <Clipboard className="h-8 w-12 text-highlight self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>

          <div className="card bg-base-100 card-md shadow-sm relative">
            <div className="card-body flex flex-col justify-between border-highlight border-2 rounded-sm h-full">
              <div>
                <p className="stat-title">Total Monthly Request</p>
                <h2 className="stat-value text-highlight">34</h2>
              </div>
              <ClipboardClock className="h-8 w-12 text-highlight self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>

          <div className="card bg-base-100 card-md shadow-sm relative">
            <div className="card-body flex flex-col justify-between border-[#30694B] border-2 rounded-sm h-full">
              <div>
                <p className="stat-title">Completed Request</p>
                <h2 className="stat-value text-[#30694B]">7</h2>
              </div>
              <ClipboardCheck className="h-8 w-12 text-[#30694B] self-end" />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
          </div>

          <div className="card bg-base-100 card-md shadow-sm relative">
            <div className="card-body flex flex-col justify-between border-[#30694B] border-2 rounded-sm h-full">
              <div>
                <p className="stat-title">Pending Request</p>
                <h2 className="stat-value text-[#30694B]">14</h2>
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

      <div className="grid grid-cols-2 gap-5">
        <div className="card bg-base-100 card-md shadow-sm relative">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div className="space-y-1">
              <p className="stat-title">Average Driver Rating</p>
              <h2 className="stat-value text-[#745fc9] leading-none">4.4</h2>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm relative">
          <div className="card-body flex-row justify-between border-[#745fc9] border-2 rounded-sm">
            <div className="space-y-1">
              <p className="stat-title">Monthly Survey Total</p>
              <h2 className="stat-value text-[#745fc9] leading-none">12</h2>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
        </div>
      </div>

      <h1 className="text-SM font-bold text-[#745fc9] mt-4 mb-1">
        Top 3 Driver by Ratings
      </h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="card bg-base-100 card-md shadow-sm relative">
          <div className="card-body flex-row justify-between items-center border-[#745fc9] border-2 rounded-sm">
            <div className="space-y-1">
              <p className="stat-title">Rating</p>
              <h2 className="stat-value text-[#745fc9] leading-none">4.9</h2>
              <p className="text-sm">Jayzen P. Galvez</p>
            </div>
            <img
              className="h-12 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899679.png"
              alt="first"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm relative">
          <div className="card-body flex-row justify-between items-center border-[#745fc9] border-2 rounded-sm">
            <div className="space-y-1">
              <p className="stat-title">Rating</p>
              <h2 className="stat-value text-[#745fc9] leading-none">4.1</h2>
              <p className="text-sm">Joswe L. Tubio</p>
            </div>
            <img
              className="h-12 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899684.png"
              alt="second"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm relative">
          <div className="card-body flex-row justify-between items-center border-[#745fc9] border-2 rounded-sm">
            <div className="space-y-1">
              <p className="stat-title">Rating</p>
              <h2 className="stat-value text-[#745fc9] leading-none">3.9</h2>
              <p className="text-sm">Dester O. Golloso</p>
            </div>
            <img
              className="h-12 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899691.png"
              alt="third"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
        </div>
      </div>

      <h1 className="text-SM font-bold mb-1 mt-10 text-[#1B4079]">
        COMPLIANCE MONITORING
      </h1>

      <div className="grid grid-cols-2 gap-5">
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Vehicles PMS Overdue", value: 4, icon: <ArchiveX /> },
            { label: "Vehicles PMS Up-to-Date", value: 16, icon: <Wrench /> },
            {
              label: "Vehicles PMS Due Soon",
              value: 9,
              icon: <TriangleAlert />,
            },
            { label: "Insurance Expiring Soon", value: 4, icon: <BookAlert /> },
            { label: "Expired Insurances", value: 8, icon: <FileX /> },
            { label: "Active Insurances", value: 2, icon: <FileCheck /> },
          ].map((item, i) => (
            <div
              key={i}
              className="card bg-base-100 card-md shadow-sm relative"
            >
              <div className="card-body flex-row justify-between border-[#1B4079] border-2 rounded-sm">
                <div className="space-y-1">
                  <p className="stat-title">{item.label}</p>
                  <h2 className="stat-value text-[#1B4079] leading-none">
                    {item.value}
                  </h2>
                </div>
                <div className="h-8 w-12 mr-2 text-[#1B4079]">{item.icon}</div>
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-center bg-base-100 shadow-xl rounded-sm border-2 border-[#1B4079]">
          <div className="card bg-base-100 p-5 w-100">
            <h2 className="text-xl font-bold mb-4 text-center">
              Compliance Chart
            </h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </main>
  );
}
