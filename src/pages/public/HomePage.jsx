import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative h-150 overflow-hidden bg-linear-to-r from-slate-100 to-gray-100">
      <motion.div
        className="absolute top-0 right-0 h-full w-full md:w-4/5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div
          className="h-full w-full bg-cover bg-center opacity-40 sm:opacity-70 md:opacity-100"
          style={{
            backgroundImage: `url(https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/Neabg.png)`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-gray-100 via-white/40 to-transparent lg:via-transparent"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        className="relative z-10 container flex h-full flex-col px-5 py-10 sm:py-20 lg:px-10"
      >
        <div className="flex h-full max-w-xl flex-col gap-10 md:justify-between">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-green-800 uppercase">
              Transport <br /> Operations
              <div className="flex flex-col justify-start">
                <span className="">Services </span>
                <span className="text-rotate text-5xl">
                  <span className="justify-items-start">
                    <span className="text-success">System</span>
                    <span className="text-lime-600">Website</span>
                    <span className="text-emerald-700">Unit </span>
                  </span>
                </span>
              </div>
            </h1>
            <p className="max-w-xs text-sm leading-tight text-gray-700 sm:text-lg">
              Submit your request to the Transport Operations Services Unit
              (TOSU) for review and approval.
            </p>
          </div>

          <div className="flex flex-col items-start space-y-4">
            <a
              href="/request-vehicle"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-success rounded-xl bg-green-400 px-7 text-sm font-bold text-white uppercase"
            >
              Make a Vehicle Request
            </a>
            <p className="text-sm font-medium text-gray-500 italic">
              * (1) One vehicle per request.
            </p>

            <a
              href="/survey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-success rounded-xl px-8 text-sm leading-tight font-bold text-white uppercase"
            >
              Fill up survey
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
