import { useState, useEffect } from "react";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
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
      const appointment = await getAppointment(clickInfo.event.id);

      setSelectedAppointment({
        ...appointment,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
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
        await updateAppointment(selectedAppointment.id, selectedAppointment);
      } else {
        await createAppointment(selectedAppointment);
      }

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

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment?.id) return;

    if (confirm("¿Estás seguro de eliminar esta cita?")) {
      try {
        await deleteAppointment(selectedAppointment.id);
        const updatedAppointments = await getAppointments();
        setEvents(updatedAppointments);
        handleModalClose();
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
        alert("Error al eliminar la cita. Por favor intente nuevamente.");
      }
    }
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
    handleDeleteAppointment,
    renderEventContent,
  };
};
