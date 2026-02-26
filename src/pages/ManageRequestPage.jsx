import {
  BadgeInfo,
  Search,
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  Ellipsis,
  Info,
  FilterIcon,
} from "lucide-react";

export default function ManageRequestsPage() {
  return (
    <main className="p-8 h-full">
      <h1 className="text-4xl font-bold ">Manage Request</h1>
      <p className="text-gray-500 mb-6">
        View and manage all service requests here.
      </p>

      <div className="grid grid-cols-3 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">21</h2>
              <p>Today's Request</p>
            </div>
            <Clipboard className="h-8 w-12 mr-2 text-[#d2dc15]" />
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">4</h2>
              <p>Completed Request</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-highlight" />
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">19</h2>
              <p>Pending Request</p>
            </div>
            <ClipboardClock className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-12    ">List of Request</h2>

      <div className="bg-base-100 mt-4">
        <div className="overflow-x-auto border border-green-600">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                {/* <th>Request Number</th> */}
                {/* <th>Timestamp</th> */}
                <th>Email Address</th>
                {/* <th>Service Vehicle</th> */}
                <th>Destination</th>
                {/* <th>Time of departure</th>
                <th>Date of departure</th>
                <th>Purpose of travel</th>
                <th>with:</th> */}
                <th>Passengers</th>
                {/* <th>Requested by</th> */}
                {/* <th>Duration of travel</th> */}
                {/* <th>Other instructions</th> */}
                <th>Contact No.</th>
                {/* <th>Remarks</th> */}
                <th>Assigned Driver</th>
                <th>Assigned vehicle</th>
                <th>Plate No.</th>
                <th>Status</th>
                <th>Action</th>

                {/* <th>Rating</th> */}
                {/* <th>Reason for not completing</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>rhangue@nea.gov.ph</td>
                <td>NAIA T3</td>
                <td>rhangue@nea.gov.ph</td>
                <td>09190048776</td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Driver</option>
                    <option>Dexter O. Golloso</option>
                    <option>Jonathan G.Mendros</option>
                    <option>Edwin Christian Verano</option>
                    <option>Nector T. Cinanan Jr.</option>
                    <option>Virgilio Y. Susaya</option>
                    <option>Rolando C. Revilla Jr.</option>
                    <option>Guy G. Rivera</option>
                  </select>
                </td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Vehicle</option>
                    <option>Toyota Altis</option>
                    <option>Honda City</option>
                    <option>Isuzu Crosswind</option>
                    <option>Isuzu Sportivo</option>
                    <option>Toyota Coaster</option>
                    <option>Toyota Hi-Ace Grandia</option>
                    <option>Isuzu MuX</option>
                  </select>
                </td>
                <td>SLD 626</td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Status</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button
                        className="btn btn-square"
                        onClick={() =>
                          document.getElementById("my_modal_3").showModal()
                        }
                      >
                        <Ellipsis className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>jamesrafaelsevilla@gmail.com</td>
                <td>OSG </td>
                <td>James Rafael Sevilla</td>
                <td>.</td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Driver</option>
                    <option>Dexter O. Golloso</option>
                    <option>Jonathan G.Mendros</option>
                    <option>Edwin Christian Verano</option>
                    <option>Nector T. Cinanan Jr.</option>
                    <option>Virgilio Y. Susaya</option>
                    <option>Rolando C. Revilla Jr.</option>
                    <option>Guy G. Rivera</option>
                  </select>
                </td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Vehicle</option>
                    <option>Toyota Altis</option>
                    <option>Honda City</option>
                    <option>Isuzu Crosswind</option>
                    <option>Isuzu Sportivo</option>
                    <option>Toyota Coaster</option>
                    <option>Toyota Hi-Ace Grandia</option>
                    <option>Isuzu MuX</option>
                  </select>
                </td>
                <td>SLD 624</td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Status</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button
                        className="btn btn-square"
                        onClick={() =>
                          document.getElementById("my_modal_3").showModal()
                        }
                      >
                        <Ellipsis className="h-4 w-6" />
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>johnzedric.isipin1@gmail.com</td>
                <td>UP</td>
                <td>John Zedric Isipin and Mark John Alondra</td>
                <td>09083065323</td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Driver</option>
                    <option>Dexter O. Golloso</option>
                    <option>Jonathan G.Mendros</option>
                    <option>Edwin Christian Verano</option>
                    <option>Nector T. Cinanan Jr.</option>
                    <option>Virgilio Y. Susaya</option>
                    <option>Rolando C. Revilla Jr.</option>
                    <option>Guy G. Rivera</option>
                  </select>
                </td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Vehicle</option>
                    <option>Toyota Altis</option>
                    <option>Honda City</option>
                    <option>Isuzu Crosswind</option>
                    <option>Isuzu Sportivo</option>
                    <option>Toyota Coaster</option>
                    <option>Toyota Hi-Ace Grandia</option>
                    <option>Isuzu MuX</option>
                  </select>
                </td>
                <td>SJX840</td>
                <td>
                  <select
                    defaultValue="Pick a font"
                    className="select select-ghost"
                  >
                    <option disabled={true}>Status</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>
                  <ul>
                    <li className="flex gap-2">
                      <button
                        className="btn btn-square"
                        onClick={() =>
                          document.getElementById("my_modal_3").showModal()
                        }
                      >
                        <Ellipsis className="h-4 w-6" />
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

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] border-3 border-doubled border-gray-200 rounded-lg">
          <h3 className="font-bold text-3xl flex items-center gap-2">
            <Info className="h-9 w-9" />
            Activity Information
          </h3>
          <div className="mt-6">
            <div className="md:gap-12 text-sm">
              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Request Identification
                  </h2>

                  <legend className="fieldset-legendc font-bold">
                    Request Number:
                  </legend>
                  <p className="mb-2">[Request Number here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Timestamp:
                  </legend>
                  <p className="mb-2">[Timestamp here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Requested by:
                  </legend>
                  <p className="mb-2">[Requested by here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Travel Schedule
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Date of Departure:
                  </legend>
                  <p className="mb-2">[Date of Departure here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Time of Departure:
                  </legend>
                  <p className="mb-2">[Time of Departure here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Duration of Travel:
                  </legend>
                  <p className="mb-2">[Duration of Travel here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Vehicle Information
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Service Vehicle:
                  </legend>
                  <p className="mb-2">[Service Vehicle here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Held Items:
                  </legend>
                  <p className="mb-2">[Held Items here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Travel Information
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Purpose of Travel:
                  </legend>
                  <p className="mb-2">[Purpose of Travel here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Other Instructions:
                  </legend>
                  <p className="mb-2">[Other Instructions here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Feedback Details
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Remarks:
                  </legend>
                  <p className="mb-2">[Remarks here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Ratings:
                  </legend>
                  <p className="mb-2">[Ratings here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Reason for not completing:
                  </legend>
                  <p className="mb-2">[Reason for not completing here.]</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
}
