import { CircleCheckBig } from "lucide-react";

export default function TransactionsPage() {
  return (
    <main className="p-7 w-full h-full ">
      <div class="card lg:card-side bg-base-100 w-186 p-6 max-w-l mx-auto">
        <figure>
          {/* <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            alt="Album"
          /> */}
        </figure>
        <div class="card-body bg-[#FDFDFD] border-2 border-green-600 rounded-lg">
          <div className="mb-4 justify-center items-center text-center p-3">
            <h1 class="text-xl font-bold">Request for NEA Service Vehicle</h1>
            <p className="text-gray-500">
              Fill up the form to request a vehicle for your official use.
            </p>
          </div>

          <div class="w-full mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Service Vehicle to be used by:
              </legend>
              <p className="font-syle: italic">Department/Division/Offices</p>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div class="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                In going to:
              </legend>
              <p className="font-syle: italic">The Destination</p>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div class="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Time of Departure:
              </legend>
              <input
                type="time"
                className="input w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div class="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Date of Departure:
              </legend>
              <input
                type="date"
                className="input w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div class="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Purpose of Travel:
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div class="flex flex-col gap-5 mt-3">
            <legend className="fieldset-legendc font-bold">With:</legend>
            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer">
                <input name="radio" type="radio" class="radio h-3 w-3" />
              </label>
              <label class="ml-2 text-slate-600 cursor-pointer text-sm">
                Baggage
              </label>
            </div>

            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer">
                <input
                  name="radio"
                  type="radio"
                  class="radio h-3 w-3"
                  id="equipment-custom"
                />
              </label>
              <label
                class="ml-2 text-slate-600 cursor-pointer text-sm"
                for="equipment-custom"
              >
                Equipment
              </label>
            </div>

            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer">
                <input
                  name="radio"
                  type="radio"
                  class="radio h-3 w-3"
                  id="equipment-custom"
                />
              </label>
              <label
                class="ml-2 text-slate-600 cursor-pointer text-sm"
                for="equipment-custom"
              >
                <div class="w-75">
                  <fieldset className="fieldset">
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Others (please specify)"
                    />
                    {/* <p className="label">Optional</p> */}
                  </fieldset>
                </div>
              </label>
            </div>
            <div class="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Name of Passenger:
                </legend>
                <p className="font-syle: italic">
                  Input all the names if more than one (1).
                </p>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Duration of Travel:
                </legend>
                <select defaultValue="Pick a browser" className="select">
                  <option disabled={true}>Choose</option>
                  <option>Same Day</option>
                  <option>2 Days</option>
                  <option>3 Days</option>
                  <option>4 Days</option>
                  <option>5 Days or more</option>
                </select>
              </fieldset>
            </div>
            <div class="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Other Instructions:
                </legend>
                <input
                  type="text"
                  className="input w-full"
                  rows="2"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Contact Number of Passenger:
                </legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Requested By:
                </legend>
                <p className="font-syle: italic">
                  Division Manager/Department Manager/Deputy Administrator.
                </p>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div class="card-actions justify-end mt-4">
              <button class="btn bg-green-600 border-0 text-white p-4">
                <CircleCheckBig className="h-4 w-4 mr-2" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
