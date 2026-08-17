// src/components/ui/Button.jsx

export default function Button({
  children,
  variant = "primary",
  className = "",
  style = {},
  ...props
}) {
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#ffffff",
    },

    accent: {
      background: "var(--accent)",
      color: "#ffffff",
    },

    danger: {
      background: "#dc2626",
      color: "#ffffff",
    },

    secondary: {
      background: "#f8fafc",
      color: "#334155",
      border: "1px solid #cbd5e1",
    },

    ghost: {
      background: "#ffffff",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
  };

  const currentVariant =
    variants[variant] ||
    variants.primary;

  return (
    <button
      className={className}
      style={{
        minHeight: "48px",
        padding: "12px 20px",
        borderRadius: "12px",

        border:
          currentVariant.border ||
          "none",

        fontWeight: "700",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "all .2s ease",
        boxShadow:
          "0 8px 20px rgba(2,6,23,.10)",

        ...currentVariant,

        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
