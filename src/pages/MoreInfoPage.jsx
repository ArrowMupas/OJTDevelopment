import {
  ClipboardList,
  Navigation,
  Car,
  Users,
  PackageOpen,
  Star,
} from "lucide-react";

export default function MoreInfoPage() {
  return (
    <main className="p-8 h-full">
      <h1 className="text-4xl font-bold">More Information</h1>
      <p className="text-gray-500 mb-6">
        Request Informations can be viewed here.
      </p>

      <div className="grid grid-cols-3 md:flex-row gap-5">
        <div className="card bg-[#FAFFF7] card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#3C9C35] border-b-4 rounded-sm">
            <div>
              <h2 className="card-title mb-3 text-[#3C9C35]">
                Request Details
              </h2>

              <legend className="fieldset-legendc font-bold">
                Request Number:
              </legend>
              <p className="mb-2">Request Number here.</p>
              <legend className="fieldset-legendc font-bold">Timestamp:</legend>
              <p className="mb-2">Timestamp here.</p>
              <legend className="fieldset-legendc font-bold">Status:</legend>
              <p className="mb-2">Status here.</p>
              <legend className="fieldset-legendc font-bold">
                Requested by:
              </legend>
              <p className="mb-2">Requested by here.</p>
            </div>

            <ClipboardList className="h-9 w-12 mr-2 text-[#3C9C35]" />
          </div>
        </div>

        <div className="card bg-[#FCFFFF] card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#07A3A3] border-b-4 rounded-sm">
            <div>
              <h2 className="card-title mb-3 text-[#07A3A3]">
                Passenger Information
              </h2>

              <legend className="fieldset-legendc font-bold">
                Passengers:
              </legend>
              <p className="mb-2">Passengers here.</p>
              <legend className="fieldset-legendc font-bold">
                Email Address:
              </legend>
              <p className="mb-2">Email here.</p>
              <legend className="fieldset-legendc font-bold">
                Contact Number:
              </legend>
              <p className="mb-2">Contact here.</p>
            </div>

            <Users className="h-9 w-12 mr-2 text-[#07A3A3]" />
          </div>
        </div>

        <div className="card bg-[#FFFCFC] card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#C4412F] border-b-4 rounded-sm">
            <div>
              <h2 className="card-title mb-3 text-[#C4412F]">
                Vehicle Assignment
              </h2>

              <legend className="fieldset-legendc font-bold">
                Assigned Vehicle:
              </legend>
              <p className="mb-2">Vehicle here.</p>
              <legend className="fieldset-legendc font-bold">
                Service Vehicle:
              </legend>
              <p className="mb-2">Service Vehicle here.</p>
              <legend className="fieldset-legendc font-bold">
                Plate Number:
              </legend>
              <p className="mb-2">Plate no. here.</p>
            </div>

            <Car className="h-9 w-12 mr-2 text-[#C4412F]" />
          </div>
        </div>

        <div className="card bg-[#FFFBF7] card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#F77100] border-b-4 rounded-sm">
            <div>
              <h2 className="card-title mb-3 text-[#F77100]">
                Travel Information
              </h2>

              <legend className="fieldset-legendc font-bold">
                Destination:
              </legend>
              <p className="mb-2">Destination here.</p>
              <legend className="fieldset-legendc font-bold">
                Date of Departure:
              </legend>
              <p className="mb-2">Date of Departure here.</p>
              <legend className="fieldset-legendc font-bold">
                Time of Departure:
              </legend>
              <p className="mb-2">Time of Departure here.</p>
              <legend className="fieldset-legendc font-bold">
                Duration of Travel:
              </legend>
              <p className="mb-2">Duration of Travel here.</p>
            </div>

            <Navigation className="h-9 w-12 mr-2 text-[#F77100]" />
          </div>
        </div>

        <div className="card bg-[#FEFCFF] card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#46244E] border-b-4 rounded-sm">
            <div>
              <h2 className="card-title mb-3 text-[#46244E]">
                Additional Travel Data
              </h2>

              <legend className="fieldset-legendc font-bold">
                Held Items:
              </legend>
              <p className="mb-2">Items here.</p>
              <legend className="fieldset-legendc font-bold">
                Other Instructions:
              </legend>
              <p className="mb-2">Instructions here.</p>
              <legend className="fieldset-legendc font-bold">Remarks:</legend>
              <p className="mb-2">Remarks here.</p>
            </div>

            <PackageOpen className="h-9 w-12 mr-2 text-[#46244E]" />
          </div>
        </div>

        <div className="card bg-[#F2FCF9] card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#063E34] border-b-4 rounded-sm">
            <div>
              <h2 className="card-title mb-3 text-[#063E34]">
                Completion Data
              </h2>

              <legend className="fieldset-legendc font-bold">Ratings:</legend>
              <p className="mb-2">Ratings here.</p>
              <legend className="fieldset-legendc font-bold">
                Reason for not comepleting:
              </legend>
              <p className="mb-2">Reason here.</p>
            </div>

            <Star className="h-9 w-12 mr-2 text-[#063E34]" />
          </div>
        </div>
      </div>
    </main>
  );
}
