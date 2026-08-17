// src/components/ui/Input.jsx

export default function Input({
  className = "",
  style = {},
  ...props
}) {
  return (
    <input
      className={className}
      style={{
        width: "100%",
        minHeight: "50px",
        padding: "12px 14px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "#fff",
        color: "var(--text)",
        fontSize: "1rem",
        ...style,
      }}
      {...props}
    />
  );
}