import { useState } from "react";

export default function TripTicketPage() {
  const [ticketNo, setTicketNo] = useState("TT-001");
  const [status, setStatus] = useState("Pending");
  const [dateReceived, setDateReceived] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [rating, setRating] = useState(0);
  const [isReceived, setIsReceived] = useState(false);

  const [history, setHistory] = useState([]);

  const receiveTicket = () => {
    // ✅ Validate date & time
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

    // 🔥 Generate next ticket number
    const nextNumber = `TT-${String(history.length + 2).padStart(3, "0")}`;

    // 🔄 Reset form
    setTimeout(() => {
      setTicketNo(nextNumber);
      setStatus("Pending");
      setDateReceived("");
      setTimeReceived("");
      setRating(0);
      setIsReceived(false);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">

      {/* ===== Trip Ticket Form ===== */}
      <div className="card bg-base-100 shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Trip Ticket</h2>

        {/* Ticket No */}
        <div>
          <label className="font-semibold">Trip Ticket No.</label>
          <input
            type="text"
            value={ticketNo}
            className="input input-bordered w-full mt-1"
            readOnly
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-semibold">Status</label>
          <input
            type="text"
            value={status}
            className="input input-bordered w-full mt-1"
            readOnly
          />
        </div>

        {/* ✅ Selectable Date */}
        <div>
          <label className="font-semibold">Select Date</label>
          <input
            type="date"
            value={dateReceived}
            onChange={(e) => setDateReceived(e.target.value)}
            className="input input-bordered w-full mt-1"
          />
        </div>

        {/* ✅ Selectable Time */}
        <div>
          <label className="font-semibold">Select Time</label>
          <input
            type="time"
            value={timeReceived}
            onChange={(e) => setTimeReceived(e.target.value)}
            className="input input-bordered w-full mt-1"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="font-semibold mb-2 block">Driver Rating</label>
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

        {/* Button */}
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

      {/* ===== History / Report ===== */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Trip History Report</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No records yet.</p>
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
                {history.map((item, index) => (
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
  );
}