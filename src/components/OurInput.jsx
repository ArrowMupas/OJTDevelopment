export default function FormInput({
  label,
  type = "text",
  placeholder = "Type here",
  register,
  error,
  name,
}) {
  return (
    <div className="relative z-0 w-full mb-4 group">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{label}</legend>
        <input
          type={type}
          className={`input w-full ${error ? "border-red-500" : ""}`}
          placeholder={placeholder}
          {...register(name)}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </fieldset>
    </div>
  );
}
