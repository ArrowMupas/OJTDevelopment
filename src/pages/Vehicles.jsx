import {
  ArchiveRestore,
  FilterIcon,
  PenLine,
  Search,
  SquarePlus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MaintenancePage() {
  return (
    <main className="p-7 w-full h-full">
      <h1 className="text-3xl font-bold text-gray-800">Vehicle Maintenance</h1>
      <p className="text-gray-500 mb-6">Vehicle and driver management</p>

      <div className="space-x-3">
        <label className="input w-1/3 border-black">
          <Search className="h-4 w-6" />
          <input type="search" required placeholder="Search" />
        </label>

        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn ml-2 bg-green-600 text-white"
          >
            <FilterIcon className="h-4 w-6" />
            Filter
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li className="rounded-sm focus:bg-highlight">
              <a className="active:bg-highlight">Ascending</a>
            </li>
            <li>
              <a className="active:bg-highlight">Descending</a>
            </li>
            <li>
              <a className="active:bg-highlight">Date</a>
            </li>
            <li>
              <a className="active:bg-highlight">Time</a>
            </li>
          </ul>
        </div>
        <button
          className="btn flex-end  bg-white text-black border-black hover:bg-green-600 hover:text-white transition ml-3"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          <SquarePlus className="h-4 w-6" />
          Add New
        </button>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h1 className="text-2xl font-bold mb-6">Add Vehicle</h1>
          <form method="dialog max-w-md mx-auto">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <div class="relative z-0 w-116 mb-3 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Vehicle Name</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Required Covered</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Plate Number</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Policy ID</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Policy Number</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Issue Date</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Period Covered</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
            </div>
          </form>
          <div className="flex justify-center mt-3">
            <Link to="">
              <button className="btn bg-[#990808] text-white hover:bg-[#d41919] hover:text-white transition w-32">
                Cancel
              </button>
            </Link>

            <Link to="">
              <button className="btn bg-green-600 text-white hover:bg-[#5DBE3F] hover:text-white transition w-32 ml-1">
                Done
              </button>
            </Link>
          </div>
        </div>
      </dialog>

      <h2 className="text-2xl mt-7 font-bold mb-6">Vehicles</h2>
      <div className="bg-base-100 mt-2 border border-green-600">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Policy ID</th>
                <th>Policy No.</th>
                <th>Vehicle</th>
                <th>Plate No.</th>
                <th>Issue Date</th>
                <th>Period Covered</th>
                <th>Required Covered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1000775941</th>
                <td>MV-PC-GSISHO-0202730</td>
                <td>Toyota Altis</td>
                <td>SJX840</td>
                <td>Sep. 28, 2023</td>
                <td>Nov. 01, 2023 to Nov. 01, 2024</td>
                <td>Comprehensive & TPL</td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button className="btn btn-square">
                        <PenLine className="h-4 w-6" />
                      </button>
                      <button className="btn btn-square">
                        <ArchiveRestore className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th>1000775941</th>
                <td>MV-PC-GSISHO-0202730</td>
                <td>Honda City</td>
                <td>SJH180</td>
                <td>Sep. 28, 2023</td>
                <td>Nov. 01, 2023 to Nov. 01, 2024</td>
                <td>Comprehensive & TPL</td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button className="btn btn-square">
                        <PenLine className="h-4 w-6" />
                      </button>
                      <button className="btn btn-square">
                        <ArchiveRestore className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th>1000772907</th>
                <td>MV-PC-GSISHO-0201339</td>
                <td>Isuzu Sportivo</td>
                <td>SLD629</td>
                <td>Aug. 29, 2023</td>
                <td>Oct. 01, 2023 to Oct. 01, 2024</td>
                <td>Comprehensive & TPL</td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button className="btn btn-square">
                        <PenLine className="h-4 w-6" />
                      </button>
                      <button className="btn btn-square">
                        <ArchiveRestore className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th>1000769364</th>
                <td>MV-PC-GSISHO-0200044</td>
                <td>Isuzu Crosswind</td>
                <td>SKX918</td>
                <td>Jul. 21, 2023</td>
                <td>Sept. 01, 2023 to Sept. 01, 2024</td>
                <td>Comprehensive & TPL</td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button className="btn btn-square">
                        <PenLine className="h-4 w-6" />
                      </button>
                      <button className="btn btn-square">
                        <ArchiveRestore className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th>1000769366</th>
                <td>MV-PC-GSISHO-0200045</td>
                <td>Isuzu Sportivo</td>
                <td>SLD628</td>
                <td>Jul. 21, 2023</td>
                <td>Sept. 01, 2023 to Sept. 01, 2024</td>
                <td>Comprehensive & TPL</td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button className="btn btn-square">
                        <PenLine className="h-4 w-6" />
                      </button>
                      <button className="btn btn-square">
                        <ArchiveRestore className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
