/**
 * Utilidades para el manejo de citas y sus estados
 */

/**
 * Obtiene el color hexadecimal correspondiente a un estado de cita
 * @param {string} status - El estado de la cita (pending, attended, cancelled)
 * @returns {string} - Código de color hexadecimal
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "attended":
      return "#4caf50"; // Verde
    case "pending":
      return "#ff9800"; // Naranja
    case "cancelled":
      return "#f44336"; // Rojo
    default:
      return "#808080"; // Gris por defecto
  }
};

/**
 * Obtiene el color MUI y la etiqueta correspondiente a un estado de cita
 * @param {string} status - El estado de la cita (pending, attended, cancelled)
 * @returns {Object} - Objeto con propiedades color y label para usar con componentes MUI
 */
export const getStatusInfo = (status) => {
  switch (status) {
    case "attended":
      return { color: "success", label: "Atendida" };
    case "pending":
      return { color: "warning", label: "Pendiente" };
    case "cancelled":
      return { color: "error", label: "Cancelada" };
    default:
      return { color: "default", label: "Desconocido" };
  }
};

/**
 * Renderiza un componente Chip de MUI con el estilo apropiado para un estado
 * @param {string} status - El estado de la cita (pending, attended, cancelled)
 * @param {Object} props - Propiedades adicionales para el componente Chip
 * @returns {JSX.Element} - Componente Chip configurado
 */
export const renderStatusChip = (status, props = {}) => {
  const { color, label } = getStatusInfo(status);
  return { color, label, ...props };
};
