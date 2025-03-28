import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createAppointment = async (appointmentData) => {
  try {
    const token = localStorage.getItem("token");

    const formatDateToUTC = (dateValue) => {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const formattedData = {
      contact_id: appointmentData.contact.id,
      title: appointmentData.title,
      start: formatDateToUTC(appointmentData.start),
      end: formatDateToUTC(appointmentData.end),
      status: appointmentData.status,
    };

    const fieldValues = {};
    Object.keys(appointmentData).forEach((key) => {
      if (key.startsWith("custom_")) {
        const fieldId = key.replace("custom_", "");
        fieldValues[fieldId] = appointmentData[key];
      }
    });

    if (Object.keys(fieldValues).length > 0) {
      formattedData.field_values = fieldValues;
    }

    const response = await axios.post(
      `${API_URL}/appointments`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getAppointments = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data.map((appointment) => ({
      id: appointment.id,
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      status: appointment.status,
      contactName: `${appointment.contact.first_name} ${appointment.contact.last_name}`,
      backgroundColor: getStatusColor(appointment.status),
      borderColor: getStatusColor(appointment.status),
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "attended":
      return "#4caf50";
    case "pending":
      return "#ff9800";
    case "cancelled":
      return "#f44336";
    default:
      return "#808080";
  }
};

export const getAppointment = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { appointment } = response.data;

    const formattedAppointment = {
      id: appointment.id,
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      status: appointment.status,
      contact: appointment.contact,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at,
      field_values: appointment.field_values,
      backgroundColor: getStatusColor(appointment.status),
      borderColor: getStatusColor(appointment.status),
    };

    if (appointment.field_values && appointment.field_values.length > 0) {
      appointment.field_values.forEach((fieldValue) => {
        formattedAppointment[`custom_${fieldValue.appointment_field_id}`] =
          fieldValue.value;
      });
    }

    return formattedAppointment;
  } catch (error) {
    console.error("Error obteniendo la cita:", error);
    throw error;
  }
};

export const updateAppointment = async (id, appointmentData) => {
  try {
    const token = localStorage.getItem("token");

    const formatDateToUTC = (dateValue) => {
      let date;
      
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        date = new Date(dateValue);
      }
      
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const formattedData = {
      contact_id: appointmentData.contact.id,
      title: appointmentData.title,
      start: formatDateToUTC(appointmentData.start),
      end: formatDateToUTC(appointmentData.end),
      status: appointmentData.status,
    };

    const fieldValues = {};
    Object.keys(appointmentData).forEach((key) => {
      if (key.startsWith("custom_")) {
        const fieldId = key.replace("custom_", "");
        fieldValues[fieldId] = appointmentData[key];
      }
    });

    if (Object.keys(fieldValues).length > 0) {
      formattedData.field_values = fieldValues;
    }

    console.log("Enviando al servidor (UTC):", formattedData);

    const response = await axios.patch(
      `${API_URL}/appointments/${id}`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error actualizando la cita:", error);
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error eliminando la cita:", error);
    throw error;
  }
};

export const attendAppointment = async (id, attendData) => {
  try {
    const token = localStorage.getItem("token");

    const data = {
      ...attendData,
      status: attendData.status || "attended",
    };

    const response = await axios.post(
      `${API_URL}/appointments/${id}/attend`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error atendiendo cita:", error);
    throw error;
  }
};

export const getAppointmentsRaw = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
