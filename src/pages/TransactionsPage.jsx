import { useState } from "react";

export default function PaymentEntryPage() {
  const [transactionNo, setTransactionNo] = useState("");
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (
      !transactionNo ||
      !payerName ||
      !amount ||
      !paymentMethod ||
      !date ||
      !time
    ) {
      alert("Please complete all fields!");
      return;
    }

    console.log({
      transactionNo,
      payerName,
      amount,
      paymentMethod,
      date,
      time,
    });

    setIsSubmitted(true);

    setTimeout(() => {
      setTransactionNo("");
      setPayerName("");
      setAmount("");
      setPaymentMethod("");
      setDate("");
      setTime("");
      setIsSubmitted(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 py-10">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Payment / Transaction Entry</h1>
        <p className="text-sm text-gray-500">
          Input payment or transaction details.
        </p>
      </div>

      {/* Centered Form */}
      <div className="card bg-base-100 w-full max-w-lg space-y-5 rounded-xl p-8 shadow-xl">
        <h2 className="text-center text-xl font-bold">Payment Entry Form</h2>

        {/* Transaction No */}
        <div>
          <label className="font-semibold">Transaction No.</label>
          <input
            type="text"
            value={transactionNo}
            onChange={(e) => setTransactionNo(e.target.value)}
            className="input input-bordered mt-1 w-full"
            placeholder="Enter Transaction No."
          />
        </div>

        {/* Payer Name */}
        <div>
          <label className="font-semibold">Payer Name</label>
          <input
            type="text"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            className="input input-bordered mt-1 w-full"
            placeholder="Enter Name"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered mt-1 w-full"
            placeholder="Enter Amount"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="font-semibold">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="select select-bordered mt-1 w-full"
          >
            <option value="">Select Method</option>
            <option>Cash</option>
            <option>GCash</option>
            <option>Bank Transfer</option>
          </select>
        </div>

        {/* Date & Time (Improved Layout) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered mt-1 w-full"
            />
          </div>

          <div>
            <label className="font-semibold">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input input-bordered mt-1 w-full"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitted}
          className={`btn mt-2 w-full ${
            isSubmitted ? "btn-disabled" : "btn-success"
          }`}
        >
          {isSubmitted ? "Saved" : "Submit Transaction"}
        </button>
      </div>
    </div>
  );
}
