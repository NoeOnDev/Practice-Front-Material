import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import {
  createAppointmentField,
  updateAppointmentField,
  deleteAppointmentField,
} from "../../services/appointmentFieldService";

export const FieldsManagement = ({ fields, onFieldsChange, onRefresh }) => {
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldForm, setFieldForm] = useState({
    name: "",
    type: "text",
    required: false,
    options: [],
    order: 0,
  });
  const [newOptionText, setNewOptionText] = useState("");
  const [savingField, setSavingField] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddField = () => {
    setEditingField(null);
    setFieldForm({
      name: "",
      type: "text",
      required: false,
      options: [],
      order: fields.length + 1,
    });
    setNewOptionText("");
    setOpenFieldDialog(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldForm({
      name: field.name,
      type: field.type || "text",
      required: field.required || false,
      options: field.options || [],
      order: field.order || 0,
    });
    setNewOptionText("");
    setOpenFieldDialog(true);
  };

  const handleDeleteField = async (field) => {
    if (
      confirm(`¿Estás seguro que deseas eliminar el campo "${field.name}"?`)
    ) {
      setDeleting(true);
      setError(null);

      try {
        await deleteAppointmentField(field.id);

        const updatedFields = fields.filter((f) => f.id !== field.id);
        onFieldsChange(updatedFields);

        setError(null);
        alert("Campo eliminado correctamente");
        onRefresh();
      } catch (error) {
        console.error("Error al eliminar campo:", error);
        alert(
          "Error al eliminar el campo: " +
            (error.message || "Intente nuevamente")
        );
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleCloseFieldDialog = () => {
    setOpenFieldDialog(false);
    setEditingField(null);
    setError(null);
  };

  const handleFieldInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFieldForm({
      ...fieldForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddOption = () => {
    if (
      newOptionText.trim() !== "" &&
      !fieldForm.options.includes(newOptionText.trim())
    ) {
      setFieldForm({
        ...fieldForm,
        options: [...fieldForm.options, newOptionText.trim()],
      });
      setNewOptionText("");
    }
  };

  const handleDeleteOption = (optionToDelete) => {
    setFieldForm({
      ...fieldForm,
      options: fieldForm.options.filter((option) => option !== optionToDelete),
    });
  };

  const handleSaveField = async () => {
    if (!fieldForm.name.trim()) {
      setError("El nombre del campo es obligatorio");
      return;
    }

    if (
      fieldForm.type === "select" &&
      (!fieldForm.options || fieldForm.options.length === 0)
    ) {
      setError(
        "Los campos tipo lista desplegable requieren al menos una opción"
      );
      return;
    }

    setSavingField(true);
    setError(null);

    try {
      let savedField;

      if (editingField) {
        savedField = await updateAppointmentField(editingField.id, fieldForm);
      } else {
        savedField = await createAppointmentField(fieldForm);
      }

      let updatedFields;
      if (editingField) {
        updatedFields = fields.map((field) =>
          field.id === savedField.id ? savedField : field
        );
      } else {
        updatedFields = [...fields, savedField];
      }

      onFieldsChange(updatedFields);
      setOpenFieldDialog(false);
      setEditingField(null);
      setError(null);
      alert(
        editingField
          ? "Campo actualizado correctamente"
          : "Campo creado correctamente"
      );
      onRefresh();
    } catch (error) {
      console.error("Error al guardar campo:", error);
      setError(
        "Error al guardar el campo: " + (error.message || "Intente nuevamente")
      );
    } finally {
      setSavingField(false);
    }
  };

  const getFieldTypeLabel = (type) => {
    switch (type) {
      case "text":
        return "Campo de texto";
      case "select":
        return "Lista desplegable";
      case "number":
        return "Campo numérico";
      case "boolean":
        return "Casilla de verificación";
      default:
        return type;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Campos Personalizados</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddField}
        >
          Agregar Campo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ mb: 3 }}>
        <List>
          {fields.length === 0 ? (
            <ListItem>
              <ListItemText primary="No hay campos personalizados configurados" />
            </ListItem>
          ) : (
            fields.map((field, index) => (
              <Box key={field.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  sx={{
                    py: 1.5,
                    backgroundColor: field.required
                      ? "action.hover"
                      : "transparent",
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {field.name}
                        {field.required && (
                          <Chip
                            label="Obligatorio"
                            color="primary"
                            size="small"
                            sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Tipo: {getFieldTypeLabel(field.type)}
                        </Typography>
                        {field.type === "select" &&
                          field.options &&
                          field.options.length > 0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              Opciones: {field.options.join(", ")}
                            </Typography>
                          )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Editar campo">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditField(field)}
                        sx={{ mr: 1 }}
                      color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar campo">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteField(field)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))
          )}
        </List>
      </Paper>

      <Dialog
        open={openFieldDialog}
        onClose={handleCloseFieldDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingField ? "Editar campo" : "Agregar nuevo campo"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nombre del campo"
              name="name"
              value={fieldForm.name}
              onChange={handleFieldInputChange}
              fullWidth
              required
              error={!fieldForm.name.trim()}
              helperText={
                !fieldForm.name.trim() ? "El nombre es obligatorio" : ""
              }
            />

            <FormControl fullWidth>
              <InputLabel>Tipo de campo</InputLabel>
              <Select
                name="type"
                value={fieldForm.type}
                onChange={handleFieldInputChange}
                label="Tipo de campo"
              >
                <MenuItem value="text">Campo de texto</MenuItem>
                <MenuItem value="number">Campo numérico</MenuItem>
                <MenuItem value="select">Lista desplegable</MenuItem>
                <MenuItem value="boolean">Casilla de verificación</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={fieldForm.required}
                  onChange={handleFieldInputChange}
                  name="required"
                />
              }
              label="Campo obligatorio"
            />

            {fieldForm.type === "select" && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Opciones
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Agregar opción"
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddOption}
                    disabled={!newOptionText.trim()}
                  >
                    Agregar
                  </Button>
                </Box>

                {fieldForm.options.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Las listas desplegables necesitan al menos una opción.
                  </Alert>
                )}

                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {fieldForm.options.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      onDelete={() => handleDeleteOption(option)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFieldDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveField}
            variant="contained"
            color="primary"
            disabled={
              savingField ||
              !fieldForm.name.trim() ||
              (fieldForm.type === "select" && fieldForm.options.length === 0)
            }
            startIcon={
              savingField && <CircularProgress size={16} color="inherit" />
            }
          >
            {savingField ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

FieldsManagement.propTypes = {
  fields: PropTypes.array.isRequired,
  onFieldsChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
