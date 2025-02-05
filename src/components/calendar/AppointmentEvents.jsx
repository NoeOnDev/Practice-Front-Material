import { useState } from "react";

const sampleEvents = [
  {
    id: 1,
    contactName: "Juan Pérez",
    title: "Consulta Dental",
    notes: "Primera visita del paciente",
    start: "2025-02-05T10:00:00",
    end: "2025-02-05T11:00:00",
    status: "confirmed",
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  {
    id: 2,
    contactName: "María García",
    title: "Limpieza Dental",
    notes: "Limpieza dental semestral",
    start: "2025-02-20T14:00:00",
    end: "2025-02-20T15:00:00",
    status: "pending",
    backgroundColor: "#ff9800",
    borderColor: "#ff9800",
  },
  {
    id: 3,
    contactName: "Carlos López",
    title: "Extracción",
    notes: "Cancelado por el paciente",
    start: "2025-02-10T16:00:00",
    end: "2025-02-10T17:00:00",
    status: "cancelled",
    backgroundColor: "#f44336",
    borderColor: "#f44336",
  },
];

export const useAppointmentEvents = () => {
  const appointmentColors = {
    confirmed: "#4caf50",
    pending: "#ff9800",
    cancelled: "#f44336",
  };

  const [events, setEvents] = useState(sampleEvents);

  const handleSelect = (selectInfo) => {
    const title = prompt("Por favor ingrese un título para la cita");
    if (title) {
      const newEvent = {
        id: Date.now(),
        title,
        contactName: "Nuevo Contacto",
        notes: "",
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        status: "pending",
        backgroundColor: appointmentColors.pending,
        borderColor: appointmentColors.pending,
        display: "block",
        textColor: "#fff",
      };
      setEvents([...events, newEvent]);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo) => {
    if (confirm(`¿Desea eliminar la cita '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  const handleEventChange = (changeInfo) => {
    setEvents(
      events.map((event) =>
        event.id === changeInfo.event.id
          ? {
              ...event,
              start: changeInfo.event.startStr,
              end: changeInfo.event.endStr,
            }
          : event
      )
    );
  };

  const renderEventContent = (eventInfo) => {
    if (
      eventInfo.view.type.includes("dayGrid") ||
      eventInfo.view.type.includes("multiMonth")
    ) {
      return (
        <div
          style={{
            width: "100%",
            backgroundColor: eventInfo.backgroundColor,
            borderColor: eventInfo.borderColor,
            padding: "2px 5px",
            borderRadius: "3px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "0.85em",
          }}
        >
          {eventInfo.timeText && <small>{eventInfo.timeText} </small>}
          <span>{eventInfo.event.title}</span>
        </div>
      );
    }

    return (
      <div
        style={{
          backgroundColor: eventInfo.backgroundColor,
          borderColor: eventInfo.borderColor,
          padding: "2px 5px",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <b>{eventInfo.timeText}</b>
        <p style={{ margin: 0 }}>{eventInfo.event.title}</p>
      </div>
    );
  };

  return {
    events,
    handleSelect,
    handleEventClick,
    handleEventChange,
    renderEventContent,
  };
};
