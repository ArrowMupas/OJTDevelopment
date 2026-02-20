import { supabase } from "../supabaseClient";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm(); // React Hook Form package for form handling
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

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

    // 5. Set loading state back to false
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-inter">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-10 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form
          // On submit button click call handleSubmit from react-hook-form which will call our submitMessage function
          onSubmit={handleSubmit(submitMessage)}
          className="py-3 h-full flex flex-col justify-between"
        >
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              // Register the input of user (for exampple "firstName") with react-hook-form using the "register" function
              {...register("firstName")}
              className="input"
            />

            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
              className="input"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="input w-full"
          />

          <input
            type="text"
            placeholder="Phone Number"
            {...register("phone")}
            className="input w-full"
          />

          <textarea
            placeholder="Your Message"
            {...register("message")}
            className="textarea w-full h-40"
          />

          <button
            type="submit"
            className="btn btn-success flex items-center gap-2 w-full"
            disabled={isSubmitting}
          >
            {/* isSubmitting is a state and if it's true we show a loading spinner the "&&" means if true show this*/}
            {isSubmitting && <span className="loading loading-spinner"></span>}
            {/* the "? :" is a ternary operator which is basically if this is true show this else show that" */}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Right: Company Info */}
        <div className="bg-green-600 text-white p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>

          <p>
            Formerly located at the D&E and CDC Buildings, 1050 Quezon Avenue,
            Paligsahan, their office is now inside Triangle Park at the National
            Government Center in Quezon City.<strong></strong>
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
            nea.motorpool@gmail.com{" "}
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
