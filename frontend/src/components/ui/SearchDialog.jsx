import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "./SearchDialog.css";

export default function SearchDialog({
  open,
  title,
  children,
  onClose
}) {

  if (!open) {
    return null;
  }
  return (
    <div className="sd-backdrop">
      <Card className="sd-dialog">
        <div className="sd-header">
          <div className="sd-title">
            <h2>{title}</h2>
          </div>
          <div className="sd-actions">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
        <div className="sd-content">
          {children}
        </div>
      </Card>
    </div>
  );
}