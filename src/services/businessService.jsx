import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getBusinessTypes = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/business-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error obteniendo tipos de negocio:", error);
    throw error;
  }
};

export const selectBusinessType = async (businessTypeId) => {
  try {
    const token = localStorage.getItem("token");

    const data = {
      business_type_id: businessTypeId,
    };

    const response = await axios.post(
      `${API_URL}/onboarding/business-type`,
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
    console.error("Error al seleccionar el tipo de negocio:", error);
    throw error;
  }
};

export const saveCustomFields = async (fields) => {
  try {
    const token = localStorage.getItem("token");

    const data = {
      fields: fields.map((field) => ({
        name: field.name,
        type: field.type,
        required: field.required,
        options: field.type === "select" ? field.options : undefined,
        order: field.order,
      })),
    };

    const response = await axios.post(
      `${API_URL}/onboarding/custom-fields`,
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
    console.error("Error al guardar los campos personalizados:", error);
    throw error;
  }
};
