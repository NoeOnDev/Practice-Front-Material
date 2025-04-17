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
import { getStatusColor } from "../../utils/appointmentUtils";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

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
          error.response.data.error_type === "custom_fields_required"
        ) {
          console.log("Se requiere configurar campos personalizados");

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
        showSnackbar("Cita actualizada correctamente", "success");
      } else {
        await createAppointment(selectedAppointment);
        showSnackbar("Cita creada correctamente", "success");
      }

      const updatedAppointments = await getAppointments();
      setEvents(updatedAppointments);
      handleModalClose();
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      showSnackbar("Error al guardar la cita", "error");
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

  const handleEventChange = async (changeInfo) => {
    try {
      const originalAppointment = await getAppointment(changeInfo.event.id);

      if (!originalAppointment) {
        throw new Error(
          "No se pudo obtener la información original de la cita"
        );
      }

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

      const updatedAppointment = {
        ...originalAppointment,
        start: changeInfo.event.startStr,
        end: changeInfo.event.endStr,
      };

      console.log("Datos de actualización:", updatedAppointment);

      await updateAppointment(changeInfo.event.id, updatedAppointment);

      showSnackbar("Cita actualizada correctamente", "success");

      console.log("Cita actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la cita:", error);

      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Código de estado:", error.response.status);
      }

      try {
        const updatedAppointments = await getAppointments();
        setEvents(updatedAppointments);
      } catch (fetchError) {
        console.error("Error al restaurar el calendario:", fetchError);
      }

      showSnackbar("No se pudo actualizar la cita. Se ha restaurado el calendario.", "error");

      alert("No se pudo actualizar la cita. Se ha restaurado el calendario.");
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment?.id) return;

    if (confirm("¿Estás seguro de eliminar esta cita?")) {
      try {
        const response = await deleteAppointment(selectedAppointment.id);

        if (response.appointments) {
          const formattedEvents = response.appointments.map((appointment) => ({
            id: appointment.id,
            title: appointment.title,
            start: appointment.start,
            end: appointment.end,
            status: appointment.status,
            contactName: `${appointment.contact.first_name} ${appointment.contact.last_name}`,
            backgroundColor: getStatusColor(appointment.status),
            borderColor: getStatusColor(appointment.status),
          }));

          setEvents(formattedEvents);
        } else {
          const updatedAppointments = await getAppointments();
          setEvents(updatedAppointments);
        }

        showSnackbar("Cita eliminada correctamente", "success");

        handleModalClose();
      } catch (error) {
        console.error("Error al eliminar la cita:", error);

        showSnackbar("Error al eliminar la cita", "error");

        alert("Error al eliminar la cita. Por favor intente nuevamente.");
      }
    }
  };

  const renderEventContent = (eventInfo) => {
    const contactName = eventInfo.event.extendedProps.contactName || "";

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
          {contactName && <strong>{contactName}</strong>}
          {contactName && eventInfo.event.title && <span> - </span>}
          <span>{eventInfo.event.title}</span>
          {eventInfo.timeText && <small> ({eventInfo.timeText})</small>}
        </div>
      );
    }

    return (
      <div
        style={{
          backgroundColor: eventInfo.backgroundColor,
          borderColor: eventInfo.borderColor,
          padding: "2px 5px",
          borderRadius: "3px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: "1em",
        }}
      >
        {contactName && <strong>{contactName}</strong>}
        {contactName && eventInfo.event.title && <span> - </span>}
        <span>{eventInfo.event.title}</span>
        {eventInfo.timeText && <small> ({eventInfo.timeText})</small>}
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

  const handleAttendComplete = async () => {
    try {
      const updatedAppointments = await getAppointments();
      setEvents(updatedAppointments);

      if (selectedAppointment?.id) {
        const refreshedAppointment = await getAppointment(
          selectedAppointment.id
        );
        const appointmentWithDates = {
          ...refreshedAppointment,
          start: new Date(refreshedAppointment.start),
          end: new Date(refreshedAppointment.end),
        };
        setSelectedAppointment(appointmentWithDates);
      }
    } catch (error) {
      console.error("Error actualizando citas después de atender:", error);
    }
  };

  const handleNewAppointment = () => {
    const startDate = new Date();
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

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
      start: startDate,
      end: endDate,
      status: "pending",
      ...customFieldsValues,
    });

    setOpenModal(true);
  };

  const handleCustomizationComplete = (updatedFormStructure) => {
    setFormStructure(updatedFormStructure);
  };

  return {
    events,
    loading,
    openModal,
    selectedAppointment,
    showOnboarding,
    businessTypes,
    formStructure,
    snackbar,
    closeSnackbar,
    handleSelect,
    handleEventClick,
    handleEventChange,
    handleModalClose,
    handleModalSubmit,
    handleModalChange,
    handleDeleteAppointment,
    handleBusinessTypeSelection,
    renderEventContent,
    handleAttendComplete,
    handleNewAppointment,
    handleCustomizationComplete,
  };
};
