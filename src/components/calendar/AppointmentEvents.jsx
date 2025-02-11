import { useState, useEffect } from "react";
import { 
  createAppointment, 
  getAppointments,
  getAppointment,
  updateAppointment
} from "../../services/appointmentService";

export const useAppointmentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = await getAppointments();
        setEvents(appointments);
      } catch (error) {
        console.error("Error al cargar las citas:", error);
        alert("Error al cargar las citas");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSelect = (selectInfo) => {
    setSelectedAppointment({
      title: "",
      contact: null,
      start: selectInfo.start,
      end: selectInfo.end,
      status: "pending",
    });
    setOpenModal(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = async (clickInfo) => {
    try {
      // Obtener la información completa de la cita
      const appointment = await getAppointment(clickInfo.event.id);
      
      // Actualizar el estado con la cita seleccionada
      setSelectedAppointment({
        ...appointment,
        start: new Date(appointment.start),
        end: new Date(appointment.end)
      });
      
      setOpenModal(true);
    } catch (error) {
      console.error("Error al obtener la cita:", error);
      alert("Error al obtener los detalles de la cita");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();

    try {
      if (selectedAppointment.id) {
        // Si tiene ID, actualizar la cita existente
        await updateAppointment(selectedAppointment.id, selectedAppointment);
      } else {
        // Si no tiene ID, crear nueva cita
        await createAppointment(selectedAppointment);
      }

      // Recargar todas las citas para actualizar la vista
      const updatedAppointments = await getAppointments();
      setEvents(updatedAppointments);
      handleModalClose();
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      alert("Error al guardar la cita. Por favor intente nuevamente.");
    }
  };

  const handleModalChange = (event) => {
    const { name, value } = event.target;
    setSelectedAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    openModal,
    selectedAppointment,
    handleSelect,
    handleEventClick,
    handleEventChange,
    handleModalClose,
    handleModalSubmit,
    handleModalChange,
    renderEventContent,
  };
};
