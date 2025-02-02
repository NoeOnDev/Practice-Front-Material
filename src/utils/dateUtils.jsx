import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (dateString) => {
  try {
    const datePart = dateString.split("T")[0];
    const date = parseISO(datePart);
    return format(date, "dd/MM/yyyy", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const apiDateToDate = (dateString) => {
  try {
    const datePart = dateString.split("T")[0];
    return parseISO(datePart);
  } catch (error) {
    console.error("Error converting API date:", error);
    return null;
  }
};

export const dateToApiDate = (date) => {
  try {
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error converting to API date:", error);
    return null;
  }
};
