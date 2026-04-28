import { LucideFileClock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function PaymentEntryPage() {
  const [controlNo, setControlNo] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [particulars, setParticulars] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (
      !controlNo ||
      !payeeName ||
      !transactionType ||
      !particulars ||
      !amount ||
      !date
    ) {
      alert("Please complete all fields!");
      return;
    }

    console.log({
      controlNo,
      payeeName,
      transactionType,
      particulars,
      amount,
      date,
    });

    setIsSubmitted(true);

    setTimeout(() => {
      setControlNo("");
      setPayeeName("");
      setTransactionType("");
      setParticulars("");
      setAmount("");
      setDate("");
      setIsSubmitted(false);
    }, 1000);
  };

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold">Payments</h1>
        <p className="text-sm text-gray-500">
          Input transaction details below.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex justify-end">
            <Link to="/payment-list">
              <button className="btn btn-info flex gap-2 text-white">
                <LucideFileClock className="h-4 w-6" />
                Payment List
              </button>
            </Link>
          </div>

          {/* FORM */}
          <div className="card bg-base-100 mb-18 w-full rounded-xl p-8 shadow-xl">
            <h2 className="mb-6 text-center text-xl font-bold">
              Payment Entry Form
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Control No */}
              <div>
                <label className="font-semibold">Control No.</label>
                <input
                  type="text"
                  value={controlNo}
                  onChange={(e) => setControlNo(e.target.value)}
                  className="input input-bordered mt-1 w-full"
                  placeholder="Enter Control No."
                />
              </div>

              {/* Date */}
              <div>
                <label className="font-semibold">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered mt-1 w-full"
                />
              </div>

              {/* Payee Name */}
              <div>
                <label className="font-semibold">Payee's Name</label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="input input-bordered mt-1 w-full"
                  placeholder="Enter Name"
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label className="font-semibold">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="select select-bordered mt-1 w-full"
                >
                  <option value="">Select Transaction</option>
                  <option>Reimbursement</option>
                  <option>Insurance</option>
                  <option>Fuel Service</option>
                  <option>Registration</option>
                </select>
              </div>
            </div>

            {/* Amount */}
            <div className="mt-4 mb-4">
              <label className="font-semibold">Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered mt-1 w-full"
                placeholder="e.g. 1,000.00"
              />
            </div>

            {/* Particulars */}
            <div>
              <label className="font-semibold">
                Particulars (Period Covered, Employee Designation, Others)
              </label>
              <textarea
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
                className="textarea textarea-bordered mt-1 w-full"
                placeholder="Enter details..."
              />
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className={`btn px-10 ${
                  isSubmitted ? "btn-disabled" : "btn-success"
                }`}
              >
                {isSubmitted ? "Saved" : "Submit Transaction"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
