export default function FormSection({
  title,
  children,
  className = "",
  actions = null,
}) {
  return (
    <section
      className={`sgcm-section ${className}`}
    >
      {(title || actions) && (
        <div className="sgcm-section-header">

          {title && (
            <h3 className="sgcm-section-title">
              {title}
            </h3>
          )}

          {actions && (
            <div className="sgcm-section-actions">
              {actions}
            </div>
          )}

        </div>
      )}

      {children}

    </section>
  );
}