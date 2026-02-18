import { Clipboard, ClipboardCheck, ClipboardClock } from "lucide-react";

export default function HomePage() {
  return (
    <main className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="card w-96 bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">21</h2>
              <p>Today's Request</p>
            </div>
            <Clipboard className="h-8 w-12 mr-2 text-[#d2dc15]" />
          </div>
        </div>

        <div className="card w-96 bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">4</h2>
              <p>Completed Request</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-highlight" />
          </div>
        </div>

        <div className="card w-96 bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">19</h2>
              <p>Pending Request</p>
            </div>
            <ClipboardClock className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 ">Pending Service Monitor</h2>

      <div className="bg-base-100 mt-4">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Email</th>
                <th>Requested by</th>
                <th>Purpose</th>
                <th>Destination</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>jherryroque@gmail.com</td>
                <td>ccsmo staff</td>
                <td>to deliver nea annual report and calendars</td>
                <td>Lucena, Dalahican Airport</td>
                <td>11:26:44</td>
                <td>1/12/2026</td>
              </tr>
              <tr>
                <th>2</th>
                <td>ocorsecc2020@gmail.com</td>
                <td>CORSEC</td>
                <td>Board Meeting</td>
                <td>Accomodation to NEA</td>
                <td>9:48:59</td>
                <td>1/7/2026</td>
              </tr>
              <tr>
                <th>3</th>
                <td>nea.engineeringtod@gmail.com</td>
                <td>Engineering Department</td>
                <td>
                  Technical Assistance (TA) for Distribution System Maintenance
                  (DSM)
                </td>
                <td>CASURECO I</td>
                <td>9:08:26</td>
                <td>1/7/2026</td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
