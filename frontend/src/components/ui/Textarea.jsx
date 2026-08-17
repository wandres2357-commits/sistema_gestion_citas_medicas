// src/components/ui/Textarea.jsx

export default function Textarea({
  className = "",
  rows = 5,
  style = {},
  ...props
}) {
  return (
    <textarea
      rows={rows}
      className={className}
      style={{
        width: "100%",
        minHeight: "140px",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "#fff",
        color: "var(--text)",
        resize: "vertical",
        fontSize: "1rem",
        ...style,
      }}
      {...props}
    />
  );
}