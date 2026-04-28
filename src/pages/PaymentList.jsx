import { FileArchive, Search, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const sampleData = [
    {
      id: 1,
      controlNo: "CTRL-001",
      payeeName: "Juan Dela Cruz",
      transactionType: "Reimbursement",
      particulars: "Fuel reimbursement - March",
      amount: 1500,
      date: "2026-04-01",
    },
    {
      id: 2,
      controlNo: "CTRL-002",
      payeeName: "Maria Reyes",
      transactionType: "Insurance",
      particulars: "Vehicle insurance renewal",
      amount: 5000,
      date: "2026-04-10",
    },
    {
      id: 3,
      controlNo: "CTRL-003",
      payeeName: "Pedro Santos",
      transactionType: "Fuel Service",
      particulars: "Fuel allocation",
      amount: 2000,
      date: "2026-04-15",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPayments(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.payeeName.toLowerCase().includes(search.toLowerCase()) ||
        p.controlNo.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedType
        ? p.transactionType === selectedType
        : true;

      const itemDate = new Date(p.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;

      const matchesDate =
        (!from || itemDate >= from) && (!to || itemDate <= to);

      return matchesSearch && matchesType && matchesDate;
    });
  }, [payments, search, selectedType, startDate, endDate]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 300),
    [],
  );

  function handleExport() {
    if (!filteredPayments.length) return;

    const sheetData = [
      ["Payment Report"],
      [],
      ["Total Records:", filteredPayments.length],
      [],
      [
        "Control No.",
        "Date",
        "Payee Name",
        "Transaction Type",
        "Particulars",
        "Amount",
      ],
      ...filteredPayments.map((p) => [
        p.controlNo,
        p.date,
        p.payeeName,
        p.transactionType,
        p.particulars,
        p.amount,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payment_report.xlsx");
  }

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-25">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/transactions">
            <button className="btn btn-outline flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Link>

          <div>
            <h1 className="text-lg font-bold">Payment List</h1>
            <p className="text-sm text-gray-500">
              View and track all payment transactions.
            </p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleExport}>
          <FileArchive className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <label className="input input-neutral w-full">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search by Payee or Control No."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </label>

        <select
          className="select w-full"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Transactions</option>
          <option>Reimbursement</option>
          <option>Insurance</option>
          <option>Fuel Service</option>
          <option>Registration</option>
        </select>

        <input
          type="date"
          className="input input-bordered w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="input input-bordered w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");
            setSelectedType("");
            setStartDate("");
            setEndDate("");
          }}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="border-0 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table min-h-50">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Control No.</th>
                <th>Date</th>
                <th>Payee Name</th>
                <th>Transaction Type</th>
                <th>Particulars</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <progress className="progress progress-success w-56"></progress>
                    <p className="mt-2 text-gray-500">Loading payments...</p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Search className="mx-auto mb-2 size-8 text-gray-400" />
                    <p className="text-gray-500">No records found</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-green-50">
                    <td className="font-semibold">{p.controlNo}</td>
                    <td>{p.date}</td>
                    <td>{p.payeeName}</td>
                    <td>{p.transactionType}</td>
                    <td className="text-xs">{p.particulars}</td>
                    <td className="text-right font-semibold">
                      ₱ {Number(p.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-green-50 font-medium">
              <tr>
                <td colSpan="5" className="py-5 text-left text-gray-700">
                  Total Records: {filteredPayments.length}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
