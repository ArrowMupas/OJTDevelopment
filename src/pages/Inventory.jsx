import { FileArchive, Search, CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const sampleData = [
    {
      id: 1,
      stock_no: "STK-001",
      brand: "Toyota",
      model: "Hiace",
      description: "Brake pads for Toyota Hiace vehicles.",
      quantity: 25,
    },
    {
      id: 2,
      stock_no: "STK-002",
      brand: "Mitsubishi",
      model: "L300",
      description: "Oil filter compatible with Mitsubishi L300.",
      quantity: 40,
    },
    {
      id: 3,
      stock_no: "STK-003",
      brand: "Isuzu",
      model: "NPR",
      description: "Heavy-duty air filter for Isuzu NPR trucks.",
      quantity: 15,
    },
  ];

  async function fetchInventory(searchTerm = "", start = "", end = "") {
    setLoading(true);

    let data = sampleData;

    if (searchTerm) {
      data = data.filter((item) =>
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setInventory(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, start, end) => {
        fetchInventory(value, start, end);
      }, 400),
    [],
  );

  function handleExport() {
    if (!inventory.length) return;

    const sheetData = [
      ["Inventory Report"],
      [],
      ["Total Items:", inventory.length],
      [],
      ["Stock No.", "Vehicle Brand", "Model", "Description", "Quantity"],
      ...inventory.map((item) => [
        item.stock_no,
        item.brand,
        item.model,
        item.description,
        item.quantity,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    XLSX.writeFile(workbook, "inventory_report.xlsx");
  }

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-25">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Inventory Module</h1>
          <p className="text-sm text-gray-500">
            Manage and monitor inventory records.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={handleExport}>
            <FileArchive className="h-4 w-4" />
            Generate Report
          </button>

          <button
            className="btn btn-success"
            onClick={() =>
              document.getElementById("inventoryModal").showModal()
            }
          >
            <CirclePlus className="h-4 w-4" />
            Add New
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <label className="input input-neutral w-full">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search Description"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value, startDate, endDate);
            }}
          />
        </label>

        <input
          type="date"
          className="input input-bordered w-full"
          value={startDate}
          onChange={(e) => {
            const value = e.target.value;
            setStartDate(value);
            fetchInventory(search, value, endDate);
          }}
        />

        <input
          type="date"
          className="input input-bordered w-full"
          value={endDate}
          onChange={(e) => {
            const value = e.target.value;
            setEndDate(value);
            fetchInventory(search, startDate, value);
          }}
        />

        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
            fetchInventory();
          }}
        >
          Clear
        </button>
      </div>

      <div className="border-0 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table min-h-50">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Stock No.</th>
                <th>Vehicle Brand</th>
                <th>Model</th>
                <th>Description</th>
                <th className="text-center">Quantity</th>
                <th className="w-32 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center gap-3">
                      <progress className="progress progress-success w-56"></progress>
                      <p className="text-gray-500">Loading inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-8 text-gray-500" />
                      <p className="text-gray-500">No inventory found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50">
                    <td>{item.stock_no}</td>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>
                    <td className="text-xs">{item.description}</td>
                    <td className="text-center font-semibold">
                      {item.quantity}
                    </td>

                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <button className="btn btn-xs btn-info">
                          <Pencil className="size-3" />
                        </button>
                        <button className="btn btn-xs btn-error">
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-green-50 font-medium">
              <tr>
                <td colSpan="6" className="py-5 text-left text-gray-700">
                  Total Items: {inventory.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <dialog id="inventoryModal" className="modal">
        <div className="modal-box w-11/12 max-w-lg rounded-xl p-6">
          <h1 className="mb-4 text-xl font-bold uppercase">
            Add Inventory Item
          </h1>

          <button
            className="btn btn-circle btn-ghost absolute top-3 right-3"
            onClick={() => document.getElementById("inventoryModal").close()}
          >
            ✕
          </button>

          <form className="space-y-4">
            <input
              className="input input-bordered w-full"
              placeholder="Stock No."
            />

            <input
              className="input input-bordered w-full"
              placeholder="Vehicle Brand"
            />

            <input
              className="input input-bordered w-full"
              placeholder="Model"
            />

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              rows={3}
            ></textarea>

            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Quantity"
            />

            <button className="btn w-full bg-green-600 text-white">Save</button>
          </form>
        </div>
      </dialog>
    </main>
  );
}
