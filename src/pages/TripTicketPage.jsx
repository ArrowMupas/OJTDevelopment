import { useState } from "react";

export default function TripTicketPage() {
  const [ticketNo, setTicketNo] = useState("TT-001");
  const [status, setStatus] = useState("Pending");
  const [dateReceived, setDateReceived] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [rating, setRating] = useState(0);
  const [isReceived, setIsReceived] = useState(false);

  const [history, setHistory] = useState([]);

  // 🔍 FILTER STATES
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterRating, setFilterRating] = useState("");

  const receiveTicket = () => {
    if (!dateReceived || !timeReceived) {
      alert("Please select date and time!");
      return;
    }

    if (rating === 0) {
      alert("Please rate the driver first!");
      return;
    }

    setStatus("Received");
    setIsReceived(true);

    const newRecord = {
      number: ticketNo,
      date: dateReceived,
      time: timeReceived,
      rating,
      status: "Received",
    };

    setHistory([...history, newRecord]);

    const nextNumber = `TT-${String(history.length + 2).padStart(3, "0")}`;

    setTimeout(() => {
      setTicketNo(nextNumber);
      setStatus("Pending");
      setDateReceived("");
      setTimeReceived("");
      setRating(0);
      setIsReceived(false);
    }, 1000);
  };

  // 🔍 FILTER LOGIC
  const filteredHistory = history.filter((item) => {
    return (
      item.number.toLowerCase().includes(search.toLowerCase()) &&
      (filterDate ? item.date === filterDate : true) &&
      (filterRating ? item.rating === Number(filterRating) : true)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">

        {/* ===== Trip Ticket Form ===== */}
        <div className="card bg-base-100 shadow-xl p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold text-center">
            Driver's Trip Ticket
          </h2>

          <div>
            <label className="font-semibold">DTT No.</label>
           <input
            type="text"
            onChange={(e) => setTicketNo(e.target.value)}
            className="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Status</label>
            <input
              type="text"
              value={status}
              className="input input-bordered w-full mt-1"
              
            />
          </div>

          <div>
            <label className="font-semibold">Select Date</label>
            <input
              type="date"
              value={dateReceived}
              onChange={(e) => setDateReceived(e.target.value)}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Select Time</label>
            <input
              type="time"
              value={timeReceived}
              onChange={(e) => setTimeReceived(e.target.value)}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label className="font-semibold mb-2 block">
              Driver Rating
            </label>
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
            <p className="text-sm mt-1 text-gray-500">
              Selected: {rating} star{rating > 1 && "s"}
            </p>
          </div>

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

        {/* ===== Trip History ===== */}
        <div className="card bg-base-100 shadow-xl p-6 flex-1">
          <h2 className="text-xl font-bold mb-4">
            Trip History Report
          </h2>

          {/* 🔍 FILTER UI */}
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Search DTT No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input input-bordered w-full"
            />

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* TABLE */}
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500">No matching records.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Trip Ticket No.</th>
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