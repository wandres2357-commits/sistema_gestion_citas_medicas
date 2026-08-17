import Input from "@/components/ui/Input";
import FieldGroup from "@/components/ui/FieldGroup";

export default function SearchField({
  id,
  label,
  value = "",
  placeholder = "Buscar...",
  onSearch,
  onClear,
  required = false,
  disabled = false,
  readOnly = true,
  className = "",
  buttonTitle = "Buscar",
}) {
  return (
    <FieldGroup
      label={label}
      htmlFor={id}
      required={required}
      className={className}
    >
      <div className="sgcm-search-row">

        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          className="sgcm-search-input"
        />

        <button
          type="button"
          className="sgcm-search-button"
          title={buttonTitle}
          aria-label={buttonTitle}
          disabled={disabled}
          onClick={onSearch}
        >
          🔍
        </button>

        {onClear && value && (
          <button
            type="button"
            className="sgcm-clear-button"
            title="Limpiar"
            aria-label="Limpiar"
            disabled={disabled}
            onClick={onClear}
          >
            ✕
          </button>
        )}

      </div>
    </FieldGroup>
  );
}