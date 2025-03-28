import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { getContactsAndSearch } from "../../services/contactService";
import { useDebounce } from "../../hooks/useDebounce";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CancelIcon from "@mui/icons-material/Cancel";
import { AppointmentForm } from "./AppointmentForm";
import { AttendAppointmentModal } from "./AttendAppointmentModal";
import { updateAppointment } from "../../services/appointmentService";

export const AppointmentFormModal = ({
  open,
  appointment,
  onClose,
  onSubmit,
  onChange,
  onDelete,
  title,
  formStructure = { custom_fields: [] },
  onAttendComplete,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [attendModalOpen, setAttendModalOpen] = useState(false);
  const originalStatus = useRef(appointment.status);
  const [appointmentData, setAppointmentData] = useState(appointment);

  useEffect(() => {
    if (open && appointment) {
      originalStatus.current = appointment.status;
      setAppointmentData(appointment);
    }
  }, [open, appointment]);

  useEffect(() => {
    if (open || autocompleteOpen) {
      loadInitialContacts();
    }
  }, [open, autocompleteOpen]);

  const loadInitialContacts = async () => {
    try {
      setLoading(true);
      const response = await getContactsAndSearch("", 1, 15);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error cargando contactos iniciales:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (value) => {
    try {
      setLoading(true);
      if (!value || value.trim() === "") {
        await loadInitialContacts();
      } else {
        const response = await getContactsAndSearch(value);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error buscando contactos:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearchChange, 300);

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
    debouncedSearch(newInputValue);
  };

  const handleAttendClick = () => {
    onClose();
    setTimeout(() => {
      setAttendModalOpen(true);
    }, 100);
  };

  const handleCancelClick = async () => {
    if (!appointment.id) return;

    if (confirm("¿Estás seguro de cancelar esta cita?")) {
      try {
        const updatedAppointment = {
          ...appointment,
          status: "cancelled",
        };

        await updateAppointment(appointment.id, updatedAppointment);

        onClose();
        if (onAttendComplete) {
          onAttendComplete();
        }
      } catch (error) {
        console.error("Error al cancelar la cita:", error);
        alert("Error al cancelar la cita. Por favor intente nuevamente.");
      }
    }
  };

  const handleAttendClose = () => {
    setAttendModalOpen(false);
  };

  const handleAttendCompleteWrapper = () => {
    setAttendModalOpen(false);
    if (onAttendComplete) {
      onAttendComplete();
    }
  };

  if (!open && !attendModalOpen) return null;

  const showAttendButton = appointment.id && appointment.status === "pending";
  const showCancelButton = showAttendButton;

  const isReadOnly =
    originalStatus.current === "attended" ||
    originalStatus.current === "cancelled";

  return (
    <>
      {open && (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <form onSubmit={onSubmit}>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{title}</Typography>
              <Box>
                {appointment.id && (
                  <>
                    {showCancelButton && (
                      <IconButton
                        color="error"
                        onClick={handleCancelClick}
                        size="small"
                        sx={{ mr: 1 }}
                        title="Cancelar cita"
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                    {showAttendButton && (
                      <IconButton
                        color="primary"
                        onClick={handleAttendClick}
                        size="small"
                        sx={{ mr: 1 }}
                        title="Atender cita"
                      >
                        <MedicalServicesIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={onDelete}
                      size="small"
                      title="Eliminar cita"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </DialogTitle>
            <DialogContent>
              <AppointmentForm
                appointment={appointment}
                onChange={onChange}
                formStructure={formStructure}
                contacts={searchResults}
                loading={loading}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                readOnlyDates={false}
                autocompleteOpen={autocompleteOpen}
                onAutocompleteOpenChange={setAutocompleteOpen}
              />
            </DialogContent>
            <DialogActions
              sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}
            >
              <Button onClick={onClose}>
                {isReadOnly ? "Cerrar" : "Cancelar"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" variant="contained" color="primary">
                  Guardar
                </Button>
              )}
            </DialogActions>
          </form>
        </Dialog>
      )}

      <AttendAppointmentModal
        open={attendModalOpen}
        appointment={appointmentData}
        onClose={handleAttendClose}
        formStructure={formStructure}
        onAttendComplete={handleAttendCompleteWrapper}
      />
    </>
  );
};

AppointmentFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  appointment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  title: PropTypes.string.isRequired,
  formStructure: PropTypes.object,
  onAttendComplete: PropTypes.func,
};
