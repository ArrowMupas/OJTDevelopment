import { supabase } from "../../supabaseClient";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMessage = async (data) => {
    setIsSubmitting(true);

    const { error } = await supabase.from("contacts").insert([
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phone,
        message: data.message,
      },
    ]);

    if (error) {
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent!");
      reset();
    }

    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-5xl p-8 py-20"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center"
      >
        <h1 className="text-center text-5xl font-bold tracking-tight uppercase">
          Contact Us
        </h1>

        <p className="relative z-10 mx-auto max-w-2xl px-4 text-lg leading-relaxed text-black">
          Leave a message for your inquiries
        </p>
      </motion.div>

      {/* Content */}
      <div className="grid gap-12 py-20 md:grid-cols-2">
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit(submitMessage)}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-green-700"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="floating-label">
                <span>First Name</span>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className={`input w-full ${
                    errors.firstName ? "input-error" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-error mt-1 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </label>
            </div>

            <div className="flex-1">
              <label className="floating-label">
                <span>Last Name</span>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  className={`input w-full ${
                    errors.lastName ? "input-error" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-error mt-1 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="floating-label">
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`input w-full ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && (
                <p className="text-error mt-1 text-sm">
                  {errors.email.message}
                </p>
              )}
            </label>
          </div>

          <div className="mt-4">
            <label className="floating-label">
              <span>Phone Number</span>
              <input
                type="text"
                placeholder="Phone Number"
                {...register("phone")}
                className={`input w-full ${errors.phone ? "input-error" : ""}`}
              />
              {errors.phone && (
                <p className="text-error mt-1 text-sm">
                  {errors.phone.message}
                </p>
              )}
            </label>
          </div>

          <div className="mt-4">
            <label className="floating-label">
              <span>Message</span>
              <textarea
                placeholder="Your Message"
                {...register("message")}
                className={`textarea h-40 w-full ${
                  errors.message ? "input-error" : ""
                }`}
              />
              {errors.message && (
                <p className="text-error mt-1 text-sm">
                  {errors.message.message}
                </p>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-lg mt-4 flex w-full items-center gap-2 rounded-lg bg-green-600 tracking-wider text-white uppercase hover:bg-green-500"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="loading loading-spinner"></span>}
            {isSubmitting ? "Submitting..." : "Submit your inquiry"}
          </button>
        </motion.form>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 rounded-lg bg-green-600 px-10 py-8 text-white"
        >
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-wider uppercase">
            Contact Information
          </h2>

          <div className="flex items-start">
            <PhoneCall className="mt-1 mr-3 h-5 w-5 text-white" />
            <div>
              <p>
                <strong>Trunkline:</strong> 8929-1909
              </p>
              <p>
                <strong>Local:</strong> 1119
              </p>
              <p>
                <strong>Mobile No.:</strong> 09164230007
              </p>
            </div>
          </div>

          <p>
            <strong>
              <Mail className="mr-2 inline-block h-4 w-4" /> Email:
            </strong>{" "}
            nea.motorpool@gmail.com
          </p>

          <p>
            <strong>
              <MapPin className="mr-2 inline-block h-4 w-4" /> Address:
            </strong>{" "}
            Basement 1, NEA Building #57, NIA Road, Quezon City, Philippines,
            1001
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
