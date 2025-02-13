import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createContact = async (contactData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/contacts`, contactData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const getContacts = async (page = 1, perPage = 15) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/contacts`, {
      params: {
        page,
        per_page: perPage,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data.data,
      total: response.data.total,
      currentPage: response.data.current_page,
      perPage: response.data.per_page,
    };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const updateContact = async (id, contactData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_URL}/contacts/${id}`,
      contactData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

export const searchContacts = async (query, page = 1, perPage = 10) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/contacts/search?query=${query}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching contacts:", error);
    throw error;
  }
};
