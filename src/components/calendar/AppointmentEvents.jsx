import { useState, useEffect } from "react";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../services/appointmentService";
import { getBusinessTypes } from "../../services/businessService";
import { getAppointmentFields } from "../../services/appointmentFieldService";

export const useAppointmentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [formStructure, setFormStructure] = useState({
    custom_fields: [],
  });
  const [calendarApi, setCalendarApi] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointments = await getAppointments();
        setEvents(appointments);

        try {
          const fields = await getAppointmentFields();
          setFormStructure({
            custom_fields: fields,
          });
        } catch (structureError) {
          console.error(
            "Error obteniendo los campos personalizados:",
            structureError
          );
        }

        setShowOnboarding(false);
      } catch (error) {
        console.error("Error al cargar las citas:", error);

        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.error_type === "business_type_required"
        ) {
          console.log("Se requiere seleccionar un tipo de negocio");

          if (error.response.data.business_types?.business_types) {
            setBusinessTypes(error.response.data.business_types.business_types);
          } else {
            try {
              const typesResponse = await getBusinessTypes();
              if (typesResponse.business_types) {
                setBusinessTypes(typesResponse.business_types);
              }
            } catch (businessTypesError) {
              console.error(
                "Error al obtener tipos de negocio:",
                businessTypesError
              );
            }
          }

          setShowOnboarding(true);
        } else {
          alert("Error al cargar las citas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSelect = (selectInfo) => {
    setCalendarApi(selectInfo.view.calendar);

    const customFieldsValues = {};
    formStructure.custom_fields.forEach((field) => {
      if (field.type === "boolean") {
        customFieldsValues[`custom_${field.id}`] = false;
      } else if (
        field.type === "select" &&
        field.options &&
        field.options.length > 0
      ) {
        customFieldsValues[`custom_${field.id}`] = field.options[0];
      } else {
        customFieldsValues[`custom_${field.id}`] = "";
      }
    });

    setSelectedAppointment({
      title: "",
      contact: null,
      start: selectInfo.start,
      end: selectInfo.end,
      status: "pending",
      ...customFieldsValues,
    });
    setOpenModal(true);
  };

  const handleEventClick = async (clickInfo) => {
    try {
      const appointment = await getAppointment(clickInfo.event.id);

      const appointmentWithDates = {
        ...appointment,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
      };

      setSelectedAppointment(appointmentWithDates);
      setOpenModal(true);
    } catch (error) {
      console.error("Error al obtener la cita:", error);
      alert("Error al obtener los detalles de la cita");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
    if (calendarApi) {
      calendarApi.unselect();
    }
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

      if (calendarApi) {
        calendarApi.unselect();
      }
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

  const handleBusinessTypeSelection = async (businessTypeId, mode) => {
    try {
      setLoading(true);
      return { businessTypeId, mode };
    } catch (error) {
      console.error("Error al seleccionar el tipo de negocio:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    openModal,
    selectedAppointment,
    showOnboarding,
    businessTypes,
    formStructure,
    handleSelect,
    handleEventClick,
    handleEventChange,
    handleModalClose,
    handleModalSubmit,
    handleModalChange,
    handleDeleteAppointment,
    handleBusinessTypeSelection,
    renderEventContent,
  };
};
