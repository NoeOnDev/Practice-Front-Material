import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAppointmentFields = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/appointment-fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.fields;
  } catch (error) {
    console.error("Error obteniendo campos personalizados:", error);
    throw error;
  }
};

export const createAppointmentField = async (fieldData) => {
  try {
    const token = localStorage.getItem("token");

    const validTypes = ["text", "select", "boolean", "number"];
    if (!validTypes.includes(fieldData.type)) {
      throw new Error(`Tipo de campo inválido: ${fieldData.type}`);
    }

    if (
      fieldData.type === "select" &&
      (!fieldData.options || fieldData.options.length === 0)
    ) {
      throw new Error("Los campos tipo select requieren opciones");
    }

    const response = await axios.post(
      `${API_URL}/appointment-fields`,
      fieldData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.field;
  } catch (error) {
    console.error("Error creando campo personalizado:", error);
    throw error;
  }
};

export const updateAppointmentField = async (fieldId, fieldData) => {
  try {
    const token = localStorage.getItem("token");

    if (
      fieldData.type === "select" &&
      (!fieldData.options || fieldData.options.length === 0)
    ) {
      throw new Error("Los campos tipo select requieren opciones");
    }

    const response = await axios.put(
      `${API_URL}/appointment-fields/${fieldId}`,
      fieldData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.field;
  } catch (error) {
    console.error("Error actualizando campo personalizado:", error);
    throw error;
  }
};

export const deleteAppointmentField = async (fieldId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${API_URL}/appointment-fields/${fieldId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error eliminando campo personalizado:", error);
    throw error;
  }
};

export const reorderAppointmentFields = async (fieldsOrder) => {
  try {
    const token = localStorage.getItem("token");

    const orderData = fieldsOrder.map((id, index) => ({
      id,
      order: index + 1,
    }));

    const response = await axios.put(
      `${API_URL}/appointment-fields/reorder`,
      { fields: orderData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error reordenando campos personalizados:", error);
    throw error;
  }
};
