export default function SurveyInput() {
  return (
    <main className="min-h-screen bg-linear-to-b from-lime-100 to-green-200 pb-25 flex justify-center p-2 sm:p-8 ">
      <div className="card w-full max-w-xl bg-white shadow-lg rounded-3xl p-7">
        <div className="card-body max-w-3xl border-2 border-green-600 rounded-lg border-dashed p-7">
          <div className="text-center flex flex-col items-center justify-center gap-2 p-3">
            <img
              className="size-20 sm:size-28"
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
              alt="NEA Logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
              }}
            />
            <h1 className="text-3xl font-bold text-green-700 tracking-tight uppercase">
              Thank you for your response.
            </h1>
            <p className="text-gray-500 text-sm">
              Your survey response is recorded.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-6 p-4">
            {/* LEFT - MAIN CONTENT (wide) */}
            <div className=" flex flex-col w-full text-center items-center lg:text-left lg:items-start gap-4 ">
              {/* NAME */}
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">Name:</p>
                <p className="text-xl font-bold text-emerald-600 wrap-break-word">
                  Doe, John
                </p>
              </div>

              {/* DATE & TIME */}
              <div className="space-y-1">
                <p className="text-xs  text-gray-500 ">Email</p>

                <p className="text-lg font-medium text-gray-800">
                  johndoe@gmail.com
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs  text-gray-500 ">Travel Date</p>
                <p className="text-lg font-medium text-gray-800">06-03-2026</p>
              </div>

              {/* DURATION */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 ">Driver</p>
                <p className="text-lg font-medium text-gray-800">
                  Dexter O. Golloso
                </p>
              </div>

              {/* PURPOSE */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 ">Vehicle</p>
                <p className="text-lg font-medium text-gray-800">
                  Toyota Innova
                </p>
              </div>
            </div>

            {/* RIGHT - SIDEBAR (narrow) */}
            <div className="w-full gap-4 text-center items-center lg:text-left lg:items-start flex flex-col ">
              <div>
                <p className="text-xs text-gray-500 ">Driver's Appearance</p>
                <p className="text-gray-800 font-medium">Excellent</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Driver's Behavior</p>
                <p className="text-gray-800 font-medium">Good</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Safety Driving Skills</p>
                <p className="text-gray-800 font-medium break-words">
                  Satisfied
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Vehicle Condition(s)</p>
                <p className="text-gray-800 font-medium break-words">Good</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">On Time</p>
                <p className="text-gray-800 font-medium">Satisfied</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Comments/Suggestions</p>
                <p className="text-gray-800 font-medium break-all">
                  Sample suggestion/text here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
