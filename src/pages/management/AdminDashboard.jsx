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
    <main className="h-full px-5 py-4 pb-25">
      <h1 className="text-lg font-bold">Admin Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">Overall view of system data.</p>

      <h1 className="text-SM mt-8 mb-1 font-bold text-green-700">
        VEHICLE REQUESTS
      </h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-5">
          <div className="card bg-base-100 card-md relative shadow-sm">
            <div className="card-body border-success flex h-full flex-col justify-between rounded-sm border-2">
              <div>
                <p className="stat-title">Today's Request</p>
                <h2 className="stat-value text-success">19</h2>
              </div>
              <Clipboard className="text-success h-8 w-12 self-end" />
            </div>
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 hover:opacity-30"></div>
          </div>

          <div className="card bg-base-100 card-md relative shadow-sm">
            <div className="card-body border-success flex h-full flex-col justify-between rounded-sm border-2">
              <div>
                <p className="stat-title">Total Monthly Request</p>
                <h2 className="stat-value text-success">34</h2>
              </div>
              <ClipboardClock className="text-success h-8 w-12 self-end" />
            </div>
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 hover:opacity-30"></div>
          </div>

          <div className="card bg-base-100 card-md relative shadow-sm">
            <div className="card-body flex h-full flex-col justify-between rounded-sm border-2 border-[#30694B]">
              <div>
                <p className="stat-title">Completed Request</p>
                <h2 className="stat-value text-[#30694B]">7</h2>
              </div>
              <ClipboardCheck className="h-8 w-12 self-end text-[#30694B]" />
            </div>
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 hover:opacity-30"></div>
          </div>

          <div className="card bg-base-100 card-md relative shadow-sm">
            <div className="card-body flex h-full flex-col justify-between rounded-sm border-2 border-[#30694B]">
              <div>
                <p className="stat-title">Pending Request</p>
                <h2 className="stat-value text-[#30694B]">14</h2>
              </div>
              <ClipboardClock className="h-8 w-12 self-end text-[#30694B]" />
            </div>
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#85CF3C] via-[#C2DE46] to-[#FFED4F] opacity-0 transition duration-300 hover:opacity-30"></div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="card bg-base-100 border-success rounded-sm border-2 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-bold">Request Chart</h2>
          <Line data={lineData} />
        </div>
      </div>

      <h1 className="text-SM mt-10 mb-1 font-bold text-[#745fc9]">
        DRIVER MONITORING
      </h1>

      <div className="grid grid-cols-2 gap-5">
        <div className="card bg-base-100 card-md relative shadow-sm">
          <div className="card-body flex-row justify-between rounded-sm border-2 border-[#745fc9]">
            <div className="space-y-1">
              <p className="stat-title">Average Driver Rating</p>
              <h2 className="stat-value leading-none text-[#745fc9]">4.4</h2>
            </div>
            <ClipboardCheck className="mr-2 h-8 w-12 text-[#745fc9]" />
          </div>
          <div className="absolute inset-0 rounded-sm bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 hover:opacity-30"></div>
        </div>

        <div className="card bg-base-100 card-md relative shadow-sm">
          <div className="card-body flex-row justify-between rounded-sm border-2 border-[#745fc9]">
            <div className="space-y-1">
              <p className="stat-title">Monthly Survey Total</p>
              <h2 className="stat-value leading-none text-[#745fc9]">12</h2>
            </div>
            <ClipboardCheck className="mr-2 h-8 w-12 text-[#745fc9]" />
          </div>
          <div className="absolute inset-0 rounded-sm bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 hover:opacity-30"></div>
        </div>
      </div>

      <h1 className="text-SM mt-4 mb-1 font-bold text-[#745fc9]">
        Top 3 Driver by Ratings
      </h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="card bg-base-100 card-md relative shadow-sm">
          <div className="card-body flex-row items-center justify-between rounded-sm border-2 border-[#745fc9]">
            <div className="space-y-1">
              <p className="stat-title">Rating</p>
              <h2 className="stat-value leading-none text-[#745fc9]">4.9</h2>
              <p className="text-sm">Jayzen P. Galvez</p>
            </div>
            <img
              className="h-12 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899679.png"
              alt="first"
            />
          </div>
          <div className="absolute inset-0 rounded-sm bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 hover:opacity-30"></div>
        </div>

        <div className="card bg-base-100 card-md relative shadow-sm">
          <div className="card-body flex-row items-center justify-between rounded-sm border-2 border-[#745fc9]">
            <div className="space-y-1">
              <p className="stat-title">Rating</p>
              <h2 className="stat-value leading-none text-[#745fc9]">4.1</h2>
              <p className="text-sm">Joswe L. Tubio</p>
            </div>
            <img
              className="h-12 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899684.png"
              alt="second"
            />
          </div>
          <div className="absolute inset-0 rounded-sm bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 hover:opacity-30"></div>
        </div>

        <div className="card bg-base-100 card-md relative shadow-sm">
          <div className="card-body flex-row items-center justify-between rounded-sm border-2 border-[#745fc9]">
            <div className="space-y-1">
              <p className="stat-title">Rating</p>
              <h2 className="stat-value leading-none text-[#745fc9]">3.9</h2>
              <p className="text-sm">Dester O. Golloso</p>
            </div>
            <img
              className="h-12 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/4899/4899691.png"
              alt="third"
            />
          </div>
          <div className="absolute inset-0 rounded-sm bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 hover:opacity-30"></div>
        </div>
      </div>

      <h1 className="text-SM mt-10 mb-1 font-bold text-[#1B4079]">
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
              className="card bg-base-100 card-md relative shadow-sm"
            >
              <div className="card-body flex-row justify-between rounded-sm border-2 border-[#1B4079]">
                <div className="space-y-1">
                  <p className="stat-title">{item.label}</p>
                  <h2 className="stat-value leading-none text-[#1B4079]">
                    {item.value}
                  </h2>
                </div>
                <div className="mr-2 h-8 w-12 text-[#1B4079]">{item.icon}</div>
              </div>
              <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#5828B0] via-[#4B83BD] to-[#3DDDCA] opacity-0 transition duration-300 hover:opacity-30"></div>
            </div>
          ))}
        </div>

        <div className="bg-base-100 flex w-full justify-center rounded-sm border-2 border-[#1B4079] shadow-xl">
          <div className="card bg-base-100 w-100 p-5">
            <h2 className="mb-4 text-center text-xl font-bold">
              Compliance Chart
            </h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </main>
  );
}
