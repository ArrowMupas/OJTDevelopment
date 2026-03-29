export default function FormInput({
  label,
  label2,
  type = "text",
  step,
  placeholder = "Type here",
  register,
  error,
  name,
  list,
  options = [],
}) {
  return (
    <div className="relative z-0 w-full group">
      <fieldset className="fieldset">
        {label2 && <p className="italic">{label2}</p>}
        <legend className="fieldset-legend text-sm truncate">{label}</legend>

        <input
          type={type}
          className={`input w-full ${error ? "input-error" : ""}`}
          placeholder={placeholder}
          {...register(name)}
          step={step}
          list={list}
        />

        {list && options.length > 0 && (
          <datalist id={list}>
            {options.map((opt, i) => (
              <option key={i} value={opt} />
            ))}
          </datalist>
        )}

        {error && <p className="text-error text-sm mt-1">{error.message}</p>}
      </fieldset>
    </div>
  );
}
