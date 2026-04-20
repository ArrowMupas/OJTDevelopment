import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TripTicketPage() {
  const [ticketNo, setTicketNo] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [rating, setRating] = useState(0);
  const [isReceived, setIsReceived] = useState(false);

  const [driver, setDriver] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [history, setHistory] = useState([]);

  // UI STATES
  const [showForm, setShowForm] = useState(true);
  const [fullHistory, setFullHistory] = useState(false);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // FETCH DRIVERS
  useEffect(() => {
    async function fetchDrivers() {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("designation", "Driver Mechanic B")
        .order("last_name", { ascending: true });

      if (error) {
        console.error("Error fetching drivers:", error);
      } else {
        setDrivers(data);
      }
    }

    fetchDrivers();
  }, []);

  // RECEIVE TICKET
  const receiveTicket = () => {
    if (!ticketNo || !dateReceived || !timeReceived || !driver) {
      alert("Please complete all fields!");
      return;
    }

    if (history.some((h) => h.number === ticketNo)) {
      alert("DTT number already exists!");
      return;
    }

    if (rating === 0) {
      alert("Please rate the driver first!");
      return;
    }

    const newRecord = {
      number: ticketNo,
      driver,
      date: dateReceived,
      time: timeReceived,
      rating,
      status: "Received",
    };

    setHistory([...history, newRecord]);
    setIsReceived(true);

    // RESET
    setTimeout(() => {
      setTicketNo("");
      setDateReceived("");
      setTimeReceived("");
      setRating(0);
      setDriver("");
      setIsReceived(false);
    }, 1000);
  };

  // FILTER HISTORY (NO RATING FILTER NOW)
  const filteredHistory = history.filter((item) => {
    const itemDate = new Date(item.date);
    const fromDate = filterFrom ? new Date(filterFrom) : null;
    const toDate = filterTo ? new Date(filterTo) : null;

    return (
      item.driver.toLowerCase().includes(search.toLowerCase()) &&
      (!fromDate || itemDate >= fromDate) &&
      (!toDate || itemDate <= toDate)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* ===== FORM (SIDEBAR) ===== */}
        {showForm && (
          <div className="w-full md:w-1/3 card bg-base-100 shadow-xl p-6 space-y-4">

            <h2 className="text-xl font-bold text-center">
              Driver's Trip Ticket
            </h2>

            {/* DTT No */}
            <div>
              <label className="font-semibold">DTT No.</label>
              <input
                type="text"
                value={ticketNo}
                onChange={(e) => setTicketNo(e.target.value)}
                className="input input-bordered w-full mt-1"
                placeholder="Enter DTT No."
              />
            </div>

            {/* Driver */}
            <div>
              <label className="font-semibold">Driver</label>
              <select
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="select select-bordered w-full mt-1"
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={`${d.first_name} ${d.last_name}`}>
                    {d.last_name}, {d.first_name} {d.middle_initial}.
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="font-semibold">Date</label>
              <input
                type="date"
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className="input input-bordered w-full mt-1"
              />
            </div>

            {/* Time */}
            <div>
              <label className="font-semibold">Time</label>
              <input
                type="time"
                value={timeReceived}
                onChange={(e) => setTimeReceived(e.target.value)}
                className="input input-bordered w-full mt-1"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="font-semibold">Driver's Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              onClick={receiveTicket}
              disabled={isReceived}
              className={`btn w-full ${
                isReceived ? "btn-disabled" : "btn-success"
              }`}
            >
              {isReceived ? "Received" : "Receive"}
            </button>
          </div>
        )}

        {/* ===== HISTORY (MAIN AREA) ===== */}
        <div className={`card bg-base-100 shadow-xl p-6 w-full ${fullHistory ? "" : "md:w-2/3"}`}>

          <h2 className="text-xl font-bold mb-4">
            Trip History Report
          </h2>
          <button className="btn btn-sm btn-error mb-3 flex items-center gap-2 ">
          🖨️ Export PDF
           </button>


          
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-sm font-light">Search</label>

            <input
              type="text"
              placeholder="Search Driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />
            </div>
            

        <div>
            <label className="text-sm font-light">From</label>
          <input
             type="date"
             value={filterFrom}
             onChange={(e) => setFilterFrom(e.target.value)}
             className="input input-bordered w-full"
          />
          </div>
        

          <div> 
             <label className="text-sm font-light">To</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="input input-bordered w-full"
            /></div>
            

          

          </div>

          

          {/* TABLE */}
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500">No matching records.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>DTT No.</th>
                    <th>Driver</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHistory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.number}</td>
                      <td>{item.driver}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>{"★".repeat(item.rating)}</td>
                      <td>
                        <span className="badge badge-success">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
} 