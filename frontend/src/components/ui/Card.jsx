// src/components/ui/Card.jsx

export default function Card({
  className = "",
  children,
  style = {},
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--surface)",
        borderRadius: "20px",
        padding: "28px 24px",
        boxShadow:
          "0 18px 40px rgba(2,6,23,.10)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}