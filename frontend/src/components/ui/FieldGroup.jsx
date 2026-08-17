export default function FieldGroup({
  label,
  htmlFor,
  children,
  required = false,
  error = "",
  hint = "",
  className = "",
}) {
  return (
    <div className={`sgcm-field ${className}`}>

      {label && (
        <label
          htmlFor={htmlFor}
          className="sgcm-label"
        >
          {label}

          {required && (
            <span className="sgcm-required">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {hint && !error && (
        <small className="sgcm-field-hint">
          {hint}
        </small>
      )}

      {error && (
        <small className="sgcm-field-error">
          {error}
        </small>
      )}

    </div>
  );
}