import Filter from "daisyui/components/filter";
import { ArchiveRestore, FilterIcon, PenLine } from "lucide-react";

export default function InquiryPage() {
  return (
    <main className="p-7 w-full h-full">
      <h1 className="text-3xl font-bold text-gray-800">Inquiry</h1>
      <p className="text-gray-500 mb-6">All inquiries can be viewed here.</p>
      <label className="input mt-1 w-115 border-black">
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
          className="btn mt-1 ml-2 bg-green-600 text-white"
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
      <h2 className="text-2xl mt-7 font-bold mb-6">Inquiries Table</h2>
      <div className="bg-base-100 mt-2 border border-green-600">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>ID</th> {/*can be hidden */}
                <th>Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Message</th>
                <th>Time Sent</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>2147</th>
                <td>John Doe</td>
                <td>john.doe@example.com</td>
                <td>09123456789</td>
                <td>Looking for an available driver.</td>
                <td>10:30 AM</td>
                <td>Sep.28, 2023</td>
              </tr>
              <tr>
                <th>3941</th>
                <td>Jane Smith</td>
                <td>jane.smith@example.com</td>
                <td>09876543210</td>
                <td>Need information about vehicle.</td>
                <td>11:45 AM</td>
                <td>Sep.28, 2023</td>
              </tr>
              <tr>
                <th>2907</th>
                <td>John Cain</td>
                <td>cain.john@example.com</td>
                <td>09123456789</td>
                <td>Is there an available driver?</td>
                <td>01:30 PM</td>
                <td>Sep.28, 2023</td>
              </tr>
              <tr>
                <th>9364</th>
                <td>Louis Benitez</td>
                <td>louis.benitez@example.com</td>
                <td>091234245789</td>
                <td>Inquiring about drivers today.</td>
                <td>09:15 PM</td>
                <td>Jul.21, 2023</td>
              </tr>
              <tr>
                <th>9366</th>
                <td>Maria Maquez</td>
                <td>maria.maquez@example.com</td>
                <td>09123456780</td>
                <td>
                  Looking for insurance options for my vehicle. Looking for
                  insurance options for my vehicle. Looking for insurance
                  options for my vehicle. Looking for insurance options for my
                  vehicle. Looking for insurance options for my vehicle. Looking
                  for insurance options for my vehicle.
                </td>
                <td>02:15 PM</td>
                <td>Sep. 28, 2023</td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
