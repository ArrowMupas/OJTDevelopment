import Filter from "daisyui/components/filter";
import {
  ArchiveRestore,
  Car,
  FilterIcon,
  PenLine,
  SquarePlus,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MaintenancePage() {
  return (
    <main className="p-7 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Maintenance</h1>

      <div>
        <Link to="/maintenance">
          <button className="btn bg-white text-black border-black hover:bg-green-700 hover:text-white transition">
            <Car className="h-4 w-6 inline-block mr-2" />
            Vehicles
          </button>
        </Link>

        <Link to="/drivers">
          <button className="btn bg-white text-black border-black hover:bg-green-700 hover:text-white transition ml-3">
            <UsersRound className="h-4 w-6 inline-block mr-2" />
            Drivers
          </button>
        </Link>
      </div>

      <label className="input mt-5 w-115 border-black">
        <svg
          className="h-[1em] opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Search" />
      </label>

      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn mt-5 ml-2 bg-green-700 text-white"
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
        className="btn flex-end mt-5 ml-4 bg-white text-black border-black hover:bg-green-700 hover:text-white transition ml-3"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        <SquarePlus className="h-4 w-6" />
        Add New
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h1 className="text-2xl font-bold mb-6">Add Driver</h1>
          <form method="dialog max-w-md mx-auto">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
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
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type here"
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
              </div>
            </div>
            <div class="relative z-0 w-116 mb-4 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Username</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="relative z-0 w-116 mb-4 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Email</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="relative z-0 w-116 mb-4 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Password</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
          </form>
          <div className="flex justify-center mt-3">
            <Link to="">
              <button className="btn bg-[#990808] text-white hover:bg-[#d41919] hover:text-white transition w-32">
                Cancel
              </button>
            </Link>

            <Link to="">
              <button className="btn bg-green-700 text-white hover:bg-[#5DBE3F] hover:text-white transition w-32 ml-1">
                Done
              </button>
            </Link>
          </div>
        </div>
      </dialog>

      <h2 className="text-2xl mt-7 font-bold mb-6">Drivers</h2>
      <div className="bg-base-100 mt-2 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>001</th>
                <td>Golloso, Dexter O.</td>
                <td>Gollosodo</td>
                <td>golosodo@gmail.com</td>
                <td>380016</td>
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
                <th>002</th>
                <td>Dela Cruz, Jerome C.</td>
                <td>delacruzjc</td>
                <td>delacruzjc@gmail.com</td>
                <td>123456</td>
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
                <th>003</th>
                <td>Revilla, Rolando C.</td>
                <td>revillarc</td>
                <td>revillarc@gmail.com</td>
                <td>revilla24</td>
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
                <th>004</th>
                <td>Gonzales, Rustico A.</td>
                <td>gonzalesra</td>
                <td>gonzalesra@gmail.com</td>
                <td>123456</td>
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
                <th>005</th>
                <td>Susaya, Virgilio Y.</td>
                <td>susayavy</td>
                <td>susayav@gmail.com</td>
                <td>123456</td>
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
