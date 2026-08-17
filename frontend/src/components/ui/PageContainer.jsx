import Card from "./Card";

export default function PageContainer({
  children,
}) {
  return (
    <Card className="contact-panel">
      {children}
    </Card>
  );
}
`