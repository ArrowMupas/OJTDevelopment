import React, { useState } from "react";
import {
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Search,
  History
} from "lucide-react";

export default function UnifiedFleetManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [vehicles, setVehicles] = useState([
    { plate: "SND 1339", model: "Isuzu Dmax", currentOdo: 45200, lastPmsOdo: 40000, pmsInterval: 5000 },
    { plate: "SJX 840", model: "Toyota Altis", currentOdo: 52800, lastPmsOdo: 52000, pmsInterval: 5000 },
    { plate: "SND 4482", model: "Isuzu Sportivo", currentOdo: 125000, lastPmsOdo: 124500, pmsInterval: 5000 },
    { plate: "SAA 9231", model: "Mitsubishi Adventure", currentOdo: 88400, lastPmsOdo: 83000, pmsInterval: 5000 }
  ]);

  const [withdrawals, setWithdrawals] = useState([
    { id: 1, plate: "SND 1339", liters: 30, odo: 45200, date: "2026-02-20", slip: "26-01-001" },
    { id: 2, plate: "SJX 840", liters: 25, odo: 52800, date: "2026-02-22", slip: "26-01-002" }
  ]);

  const [newSlip, setNewSlip] = useState({
    plate: "",
    liters: "",
    odo: "",
    slip: "",
    date: new Date().toISOString().split("T")[0]
  });

  const handleCompletePms = (plate) => {
    setVehicles(prev =>
      prev.map(v => v.plate === plate ? { ...v, lastPmsOdo: v.currentOdo } : v)
    );
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    const selectedVehicle = vehicles.find(v => v.plate === newSlip.plate);
    const enteredOdo = parseInt(newSlip.odo);

    if (!selectedVehicle) return;
    if (enteredOdo < selectedVehicle.currentOdo) {
      alert(`Odometer cannot be lower than ${selectedVehicle.currentOdo}`);
      return;
    }

    const entry = {
      id: withdrawals.length + 1,
      plate: newSlip.plate,
      liters: parseFloat(newSlip.liters),
      odo: enteredOdo,
      slip: newSlip.slip,
      date: newSlip.date
    };

    setWithdrawals(prev => [entry, ...prev]);

    setVehicles(prev =>
      prev.map(v => v.plate === newSlip.plate ? { ...v, currentOdo: enteredOdo } : v)
    );

    setNewSlip({
      plate: "",
      liters: "",
      odo: "",
      slip: "",
      date: new Date().toISOString().split("T")[0]
    });

    setIsModalOpen(false);
  };

  const filteredVehicles = vehicles.filter(v =>
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Motorpool Compliance Monitoring</h1>
            <p className="text-gray-500">PMS monitoring and withdrawal slip records</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-2xl flex items-center gap-2"
            >
              <History size={18}/> View History
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-500 text-white px-5 py-2 rounded-2xl flex items-center gap-2"
            >
              <Plus size={18}/> Log Fuel
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 max-w-md relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input
            type="text"
            placeholder="Search vehicle..."
            className="w-full pl-10 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* VEHICLE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v, i) => {
            const kmsSincePms = v.currentOdo - v.lastPmsOdo;
            const nextPmsOdo = v.lastPmsOdo + v.pmsInterval;
            const remainingKm = nextPmsOdo - v.currentOdo;
            const isDue = kmsSincePms >= v.pmsInterval;

            return (
              <div
                key={i}
                className={`p-6 rounded-2xl shadow flex flex-col justify-between border-2 ${
                  isDue ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h2 className="font-bold text-lg">{v.plate}</h2>
                    <p className="text-xs text-gray-500">{v.model}</p>
                  </div>
                  <div className="rounded-full p-2 bg-white shadow">
                    {isDue ? <AlertTriangle className="text-red-600 w-6 h-6"/> : <CheckCircle className="text-green-600 w-6 h-6"/>}
                  </div>
                </div>

                <p>Current: {v.currentOdo.toLocaleString()} KM</p>
                <p>Next PMS at: {nextPmsOdo.toLocaleString()} KM</p>

                <p className={`font-bold ${isDue ? "text-red-600" : "text-blue-600"}`}>
                  {isDue ? "PMS OVERDUE!" : `Remaining: ${remainingKm.toLocaleString()} KM`}
                </p>

                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    className={`h-full ${isDue ? "bg-red-600" : "bg-blue-600"}`}
                    style={{ width: `${Math.min((kmsSincePms / v.pmsInterval) * 100, 100)}%` }}
                  />
                </div>

                {isDue && (
                  <button
                    onClick={() => handleCompletePms(v.plate)}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-2xl"
                  >
                    Mark PMS Completed
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* HISTORY MODAL */}
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl rounded-2xl p-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-xl">Fuel Withdrawal History</h2>
                <button onClick={() => setIsHistoryOpen(false)}>
                  <X/>
                </button>
              </div>

              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr className="border-b">
                    <th className="px-4 py-2">Slip</th>
                    <th className="px-4 py-2">Plate</th>
                    <th className="px-4 py-2">Liters</th>
                    <th className="px-4 py-2">Odo</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(w => (
                    <tr key={w.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{w.slip}</td>
                      <td className="px-4 py-2">{w.plate}</td>
                      <td className="px-4 py-2">{w.liters}L</td>
                      <td className="px-4 py-2">{w.odo.toLocaleString()}</td>
                      <td className="px-4 py-2">{w.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOG FUEL MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-2xl p-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-xl">Log Fuel</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X/>
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                <select
                  required
                  className="w-full border p-3 rounded-2xl"
                  value={newSlip.plate}
                  onChange={e => setNewSlip({...newSlip, plate: e.target.value})}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.plate} value={v.plate}>{v.plate}</option>
                  ))}
                </select>

                <input
                  required
                  type="number"
                  placeholder="Liters"
                  className="w-full border p-3 rounded-2xl"
                  value={newSlip.liters}
                  onChange={e => setNewSlip({...newSlip, liters: e.target.value})}
                />

                <input
                  required
                  type="number"
                  placeholder="New Odometer"
                  className="w-full border p-3 rounded-2xl"
                  value={newSlip.odo}
                  onChange={e => setNewSlip({...newSlip, odo: e.target.value})}
                />

                <input
                  required
                  placeholder="Slip Number"
                  className="w-full border p-3 rounded-2xl"
                  value={newSlip.slip}
                  onChange={e => setNewSlip({...newSlip, slip: e.target.value})}
                />

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-2xl"
                >
                  Save Entry
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}