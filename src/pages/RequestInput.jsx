export default function RequestInputPage() {
  return (
    <main className="h-full p-8 bg-green-200 pb-25">
      <div className="card lg:card-side p-7 w-3xl mx-auto bg-white shadow-lg">
        <form className="card-body max-w-3xl border-2 border-green-600 rounded-lg border-dashed p-7">
          <div className=" text-center p-3 items-center justify-center flex flex-col gap-2">
            <img
              className="size-22 w-38 "
              src="https://t3.ftcdn.net/jpg/17/69/68/12/360_F_1769681289_Lo74Io6ucUNoPL52ve5CcrZmTkQsYZJk.webp"
              alt="NEA Logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
              }}
            />
            <h1 className="text-4xl font-bold text-green-700 tracking-tight font-rubik">
              Thank You for Submitting
            </h1>
            <p className="text-gray-500 text-sm">
              Kindly coordinate with motorpool with your request.
            </p>
          </div>
          <div className="grid grid-cols-3 md:flex-row gap-15 mt-2">
            <div>
              <legend className="fieldset-legendc font-bold">Going to:</legend>
              <p className="mb-3">Going to here.</p>
              <legend className="fieldset-legendc font-bold">
                Date of Departure:
              </legend>
              <p className="mb-3">Date here.</p>

              <legend className="fieldset-legendc font-bold">
                Time of Departure:
              </legend>
              <p className="mb-3">Time here.</p>
              <legend className="fieldset-legendc font-bold">
                Duration of Travel:
              </legend>
              <p className="mb-3">Duration here.</p>
              <legend className="fieldset-legendc font-bold">
                Purpose Departure:
              </legend>
              <p className="mb-3">Purpose here.</p>
              <legend className="fieldset-legendc font-bold">
                Held Items Departure:
              </legend>
              <p className="mb-3">Held Items here.</p>
            </div>

            <div className="">
              <legend className="fieldset-legendc font-bold">
                Requested by:
              </legend>
              <p className="mb-3">Requested here.</p>
              <legend className="fieldset-legendc font-bold">
                Name of Passenger(s):
              </legend>
              <p className="mb-3">Names here.</p>
              <legend className="fieldset-legendc font-bold">
                Passenger Contact Number:
              </legend>
              <p className="mb-3">Contact No. here.</p>
              <legend className="fieldset-legendc font-bold">Email:</legend>
              <p className="mb-3">Date here.</p>
            </div>
            <div>
              <legend className="fieldset-legendc font-bold">
                Service Vehicle to be used by:
              </legend>
              <p className="mb-3">Service Vehicle to be used by here.</p>
              <legend className="fieldset-legendc font-bold">
                Other instructions:
              </legend>
              <p className="mb-3">Other Instruction here.</p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
