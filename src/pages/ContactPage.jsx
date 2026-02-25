import { supabase } from "../supabaseClient";
import { Contact, Mail, MapPin, PhoneCall } from "lucide-react";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email({ message: "Please enter a valid email" }),
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

  // Function to handle contact submission
  const submitMessage = async (data) => {
    // 1. Set loading state to true
    setIsSubmitting(true);
    // 2. Insert data into Supabase "contacts" table
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
      // 3. Show error toast if insertion fails
      toast.error("Failed to send message");
    } else {
      // 4. Show success toast and reset form if insertion succeeds
      toast.success("Message sent!");
      reset();
    }

    // 5. Stop the loading state
    setIsSubmitting(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto ">
      <h1 className="text-4xl font-bold mb-10 text-center ">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form
          // On submit button click call handleSubmit from react-hook-form which will call our submitMessage function
          onSubmit={handleSubmit(submitMessage)}
          className="py-2 h-full flex flex-col justify-between"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="First Name"
                // Register the input of user (for exampple "firstName") with react-hook-form using the "register" function
                {...register("firstName")}
                className={`input w-full ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className={`input w-full ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 ">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`input w-full ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone")}
              className={`input w-full ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <textarea
              placeholder="Your Message"
              {...register("message")}
              className={`textarea w-full h-40 ${errors.message ? "border-red-500" : ""}`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-lg bg-green-500 hover:bg-highlight flex items-center gap-2 w-full mt-4 text-white"
            disabled={isSubmitting}
          >
            <Contact className="h-5 w-5" />
            {isSubmitting && <span className="loading loading-spinner"></span>}
            {isSubmitting ? "Submitting..." : "Submit your inquiry"}
          </button>
        </form>

        {/* Right: Company Info */}
        <div className="bg-green-600 text-white p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>

          <p>
            Formerly located at the D&E and CDC Buildings, 1050 Quezon Avenue,
            Paligsahan, their office is now inside Triangle Park at the National
            Government Center in Quezon City.
          </p>

          <p>
            <strong>
              <PhoneCall className="h-10 w-4 inline-block mr-2" /> Phone:
            </strong>{" "}
            (929) 190-9119
          </p>
          <p>
            <strong>
              <Mail className="h-10 w-4 inline-block mr-2" /> Email:
            </strong>{" "}
            nea.motorpool@gmail.com
          </p>
          <p>
            <strong>
              <MapPin className="h-4 w-4 inline-block mr-2" /> Address:
            </strong>{" "}
            57 NEA Building, NIA Road, Government Center, Diliman , Quezon City,
            Philippines, 1001
          </p>

          <div className="flex justify-center items-center gap-6">
            <a
              href="https://twitter.com/nea_ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d1dadf] text-4xl transition duration-200 hover:scale-110"
            >
              <FaTwitter className="w-8 h-20" />
            </a>

            <a
              href="https://www.youtube.com/@NEAPhilippines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e2e2d1] text-3xl transition duration-200 hover:scale-110"
            >
              <FaYoutube className="w-8 h-20" />
            </a>
            <a
              href="https://www.facebook.com/NEAPhilippines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e2e2d1] text-3xl transition duration-200 hover:scale-110"
            >
              <FaFacebook className="w-8 h-20" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
