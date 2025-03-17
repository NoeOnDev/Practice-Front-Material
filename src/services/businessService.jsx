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

export const selectBusinessType = async (
  businessTypeId,
  mode = "customize"
) => {
  try {
    const token = localStorage.getItem("token");

    const data = {
      business_type_id: businessTypeId,
      mode: mode,
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
