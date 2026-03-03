import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

export default function TransactionsPage() {
  const labels = ["Jan", "Feb", "Mar", "Apr"];

  const lineData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: [30, 45, 60, 50],
        borderColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.15)",
        pointBackgroundColor: "#1D4ED8",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: [80, 55, 70, 90],
        backgroundColor: ["#8B5CF6", "#6366F1", "#A78BFA", "#7C3AED"],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ["Marketing", "Operations", "Development"],
    datasets: [
      {
        data: [30, 40, 30],
        backgroundColor: ["#F97316", "#06B6D4", "#10B981"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutData = {
    labels: ["Desktop", "Mobile", "Tablet"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#22D3EE", "#F472B6", "#A3E635"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Line Chart */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Line Chart</h2>
        <Line data={lineData} />
      </div>

      {/* Bar Chart */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Bar Chart</h2>
        <Bar data={barData} />
      </div>

      {/* Pie Chart */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Pie Chart</h2>
        <Pie data={pieData} />
      </div>

      {/* Doughnut Chart */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Doughnut Chart</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}
