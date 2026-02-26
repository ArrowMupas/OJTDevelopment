export default function FormInput({
  label,
  label2,
  type = "text",
  placeholder = "Type here",
  register,
  error,
  name,
}) {
  return (
    <div className="relative z-0 w-full mb-4 group">
      <fieldset className="fieldset">
        {label2 && <p className="font-syle: italic">{label2}</p>}
        <legend className="fieldset-legend text-sm">{label}</legend>
        <input
          type={type}
          className={`input w-full  ${error ? "border-red-500" : ""}`}
          placeholder={placeholder}
          {...register(name)}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </fieldset>
    </div>
  );
}
