import { useState } from "react";
import LocationForm from "./LocationForm";
import LocationsList from "./LocationsList";

export default function LocationsModule() {
  const [locations, setLocations] = useState([]);

  return (
    <section>
      <h2>Sedes / Clínicas</h2>

      <LocationForm
        locations={locations}
        setLocations={setLocations}
      />

      <LocationsList locations={locations} />
    </section>
  );
}
