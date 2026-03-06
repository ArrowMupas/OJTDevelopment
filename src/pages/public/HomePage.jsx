export default function HomePage() {
  return (
    <div className="relative h-180 bg-white  overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute right-0 top-0 w-full lg:w-4/5 h-full">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 md:opacity-100"
          style={{
            backgroundImage: `url(https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/Neabg.png)`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/40 lg:via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container px-6 lg:px-12 flex flex-col py-25 min-h-screen">
        <div className="max-w-xl space-y-7">
          <h1 className="text-5xl font-bold  tracking-tight uppercase leading-14">
            Transport Operations <br />
            <span className="text-green-600">Services System</span>
          </h1>

          <p className="relative z-10 text-lg max-w-2xl mx-auto  leading-relaxed">
            Submit your request to the Transport Operations Services Unit (TOSU)
            for review and approval.
          </p>

          {/* Button */}
          <div className="flex flex-col items-center md:items-start">
            <a
              href="/request-vehicle"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg px-8 bg-green-500 hover:bg-green-400 rounded-xl uppercase leading-tight font-bold text-white text-sm"
            >
              Request Vehicle
            </a>

            <p className="mt-2 text-sm text-slate-400 font-medium italic">
              * (1) One vehicle per request.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <a
              href="/survey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-success px-8  rounded-xl uppercase leading-tight font-bold text-white text-sm"
            >
              Fill up survey
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
