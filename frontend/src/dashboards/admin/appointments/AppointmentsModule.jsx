import { useState } from 'react';

import PageContainer from '../../../components/ui/PageContainer';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';

import PatientAppointmentHeader from './components/PatientAppointmentHeader';
import PatientSearchDialog from './components/PatientSearchDialog';
import AssignedAppointmentsTab from './components/AssignedAppointmentsTab';
import AppointmentAssignmentTab from './components/AppointmentAssignmentTab';

import { getAppointments } from './services/appointments.service';

export default function AppointmentsModule() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('assigned');
  const [mostrar, setMostrar] = useState('proximas');

  async function loadAppointments(patientId, filter = mostrar) {
    const data = await getAppointments({
      pacienteId: patientId,
      mostrar: filter
    });

    setAppointments(data);
  }

  async function handleSelectPatient(selectedPatient) {
    setPatient(selectedPatient);
    setShowPatientDialog(false);
    await loadAppointments(selectedPatient.id, 'proximas');
  }

  function handleUndo() {
    setPatient(null);
    setAppointments([]);
    setMostrar('proximas');
    setActiveTab('assigned');
  }

  return (
    <PageContainer>
      <div className="sgcm-toolbar">
        <Button onClick={handleUndo}>
          Deshacer
        </Button>

        <Button onClick={() => window.print()}>
          Vista Previa
        </Button>
      </div>

      <PageHeader title="CITA MÉDICA" />

      <PatientAppointmentHeader
        patient={patient}
        onOpenSearch={() => setShowPatientDialog(true)}
        onClear={() => {
          setPatient(null);
          setAppointments([]);
        }}
      />

      <div className="sgcm-tabs">
        <button
          className={activeTab === 'assigned' ? 'sgcm-tab active' : 'sgcm-tab'}
          onClick={() => setActiveTab('assigned')}
        >
          Citas asignadas
        </button>

        <button
          className={activeTab === 'assignment' ? 'sgcm-tab active' : 'sgcm-tab'}
          onClick={() => setActiveTab('assignment')}
        >
          Asignación de citas
        </button>
      </div>

      {activeTab === 'assigned' && (
        <AssignedAppointmentsTab
          appointments={appointments}
          mostrar={mostrar}
          onChangeMostrar={async (value) => {
            setMostrar(value);

            if (patient) {
              await loadAppointments(patient.id, value);
            }
          }}
          onRefresh={() => patient && loadAppointments(patient.id, mostrar)}
        />
      )}

      {activeTab === 'assignment' && (
        <AppointmentAssignmentTab
          patient={patient}
          onCreated={() => patient && loadAppointments(patient.id, 'proximas')}
        />
      )}

      <PatientSearchDialog
        open={showPatientDialog}
        onClose={() => setShowPatientDialog(false)}
        onSelect={handleSelectPatient}
      />
    </PageContainer>
  );
}