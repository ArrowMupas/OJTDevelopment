import { useState } from "react";
import { motion } from "framer-motion";

const values = [
  {
    title: "Reliability",
    description:
      "Vehicles are maintained to the highest standards and ready when you need them.",
  },
  {
    title: "Safety First",
    description:
      "Every ride is backed by thorough safety checks and trained personnel.",
  },
  {
    title: "Transparency & Trust",
    description:
      "Operations, schedules, and costs are clearly communicated — no surprises.",
  },
  {
    title: "People-Oriented Service",
    description:
      "We listen actively to our users and adapt our services for practical solutions.",
  },
];

const services = [
  {
    title: "Requesting a Vehicle",
    description:
      "Getting where you need to go is easy. Whether it’s a quick site visit or a multi-day trip, just book in advance and we’ll handle the rest.",
  },
  {
    title: "Active Safety Monitoring",
    description:
      "Your safety is our priority. We constantly monitor our cars—from regular tire changes to engine check-ups—to ensure every vehicle is in top condition before you hit the road.",
  },
  {
    title: "Supporting Our Drivers",
    description:
      "Our drivers are the heart of our service. We provide them with the training and tools they need to get you to your destination safely and comfortably.",
  },
  {
    title: "Carpooling/Ride Sharing",
    description:
      "Carpooling allows multiple passengers traveling to the same or nearby destinations to share a single vehicle. This helps reduce the number of trips, save fuel, and make transportation more efficient.",
  },
];

const faqs = [
  {
    question: "How do I request a vehicle?",
    answer:
      "Scan the QR code to access the vehicle request form. Fill out the required details and submit your request. We recommend sending your request at least 24–48 hours in advance to ensure a driver and vehicle are available.",
  },
  {
    question: "What types of vehicles are used?",
    answer:
      "We utilize a fleet of standard passenger vehicles (sedans/SUVs) kept in peak condition to ensure a comfortable and professional ride for all staff.",
  },
  {
    question: "Can I book for multi-day trips?",
    answer:
      "Yes. Whether you need a same-day drop-off or a vehicle for two or more days for provincial assignments, our motorpool is equipped to handle long-duration travel.",
  },
  {
    question: "How is vehicle safety managed?",
    answer:
      "Your safety is our priority. We follow a strict maintenance schedule that includes regular tire rotations, brake checks, and engine diagnostics to keep you safe during every kilometer of your journey.",
  },
];

const AboutUs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className=" text-black text-center py-20 px-4 flex flex-col items-center relative overflow-hidden"
      >
        <div className="relative z-10 bg-white p-3 rounded-full mb-6 shadow-2xl">
          <img
            className="w-30 h-30 object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="NEA Logo"
          />
        </div>

        <h1 className="relative z-10 text-5xl font-bold uppercase mb-4 tracking-tight">
          About Us
        </h1>

        <p className="relative z-10 text-lg max-w-2xl mx-auto text-black leading-relaxed px-4">
          The central hub where NEA employees coordinate with the Transport
          Operations Services Unit (TOSU) for dependable, safe, and professional
          travel.
        </p>
      </motion.header>

      {/* Our Purpose Section */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pl-6"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Our Purpose
          </h2>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            The NEA Motorpool serves as the vital link between our workforce and
            their mission. It is the primary platform where all NEA employees
            request transport services from the Transport Operations Services
            Unit (TOSU) to facilitate reliable travel to their required
            destinations.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed italic">
            Whether it is a quick same-day trip or an extended assignment
            requiring two or more days of travel, we ensure every department has
            the mobility required to fulfill their duties.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-20 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-12 uppercase tracking-widest">
            Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 border border-gray-100 rounded-2xl bg-white hover:bg-green-600 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <h3 className="text-xl font-bold text-green-800 group-hover:text-white mb-3">
                  {value.title}
                </h3>

                <p className="text-gray-600 group-hover:text-blue-50 transition-colors">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight uppercase">
            What We Do
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto text-lg italic">
            We handle the logistics and the maintenance so you can stay focused
            on your work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start p-8 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-green-700 transition-all duration-300"
            >
              <div className="mr-5 mt-1 bg-green-50 p-3 rounded-lg">
                <div className="w-3 h-3 bg-green-700 rounded-full"></div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto py-20 px-6 bg-white border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-serif text-gray-800 mb-6">FAQ</h2>
        </div>

        <div className="border-t border-green-200">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="border-b border-green-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center py-6 text-left hover:bg-green-50 transition px-2"
              >
                <span className="text-xl font-bold text-gray-900">
                  {faq.question}
                </span>

                <span
                  className={`transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="pl-4 pr-10 pb-6 border-l-4 border-green-700"
                >
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Footer */}
      <motion.footer
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white py-20 px-4 text-center text-black"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 tracking-tight uppercase">
            Our Mission
          </h2>

          <p className="text-xl font-light leading-relaxed opacity-95 italic">
            "To support the workforce of the National Electrification
            Administration with seamless transport logistics, ensuring every
            official journey is safe, comfortable, and reliable."
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default AboutUs;
