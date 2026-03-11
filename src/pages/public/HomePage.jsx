import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative h-150 bg-linear-to-r from-slate-100 to-gray-100 overflow-hidden">
      <motion.div
        className="absolute right-0 top-0 w-full md:w-4/5 h-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div
          className="w-full h-full bg-cover bg-center opacity-40 md:opacity-100 sm:opacity-70"
          style={{
            backgroundImage: `url(https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/Neabg.png)`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-gray-100 via-white/40 lg:via-transparent to-transparent"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        className="relative z-10 container px-5 lg:px-10 flex flex-col py-10 sm:py-20 h-full"
      >
        <div className="flex flex-col gap-10 md:justify-between h-full max-w-xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight uppercase text-green-800">
              Transport <br /> Operations
              <div className="flex flex-col justify-start">
                <span className="">Services </span>
                <span className="text-rotate text-5xl ">
                  <span className="justify-items-start">
                    <span className="text-green-500">System</span>
                    <span className="text-lime-600">Website</span>
                    <span className="text-emerald-700">Unit </span>
                  </span>
                </span>
              </div>
            </h1>
            <p className="text-sm sm:text-lg max-w-xs text-gray-700 leading-tight">
              Submit your request to the Transport Operations Services Unit
              (TOSU) for review and approval.
            </p>
          </div>

          <div className="flex flex-col items-start space-y-4">
            <a
              href="/request-vehicle"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-success bg-green-400 rounded-xl uppercase font-bold text-white text-sm px-7"
            >
              Make a Vehicle Request
            </a>
            <p className="text-sm text-gray-500 font-medium italic">
              * (1) One vehicle per request.
            </p>

            <a
              href="/survey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-success px-8 rounded-xl uppercase leading-tight font-bold text-white text-sm"
            >
              Fill up survey
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
