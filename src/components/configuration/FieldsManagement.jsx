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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [savingField, setSavingField] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

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

  const handleDeleteField = (field) => {
    setFieldToDelete(field);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteField = async () => {
    if (!fieldToDelete) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteAppointmentField(fieldToDelete.id);

      const updatedFields = fields.filter((f) => f.id !== fieldToDelete.id);
      onFieldsChange(updatedFields);

      setDeleteConfirmOpen(false);
      setFieldToDelete(null);
      setError(null);
      onRefresh();
    } catch (error) {
      console.error("Error al eliminar campo:", error);
      setError("Error al eliminar el campo: " + (error.message || "Intente nuevamente"));
    } finally {
      setDeleting(false);
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
      setError("Los campos tipo lista desplegable requieren al menos una opción");
      return;
    }

    setSavingField(true);
    setError(null);

    try {
      let savedField;

      if (editingField) {
        // Actualizar campo existente
        savedField = await updateAppointmentField(editingField.id, fieldForm);
      } else {
        // Crear nuevo campo
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
      onRefresh(); // Recargar los campos desde el backend
    } catch (error) {
      console.error("Error al guardar campo:", error);
      setError("Error al guardar el campo: " + (error.message || "Intente nuevamente"));
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
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {field.name}
                        {field.required && (
                          <Chip
                            size="small"
                            label="Obligatorio"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={getFieldTypeLabel(field.type)}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Editar campo">
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => handleEditField(field)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar campo">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteField(field)}
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
          {editingField ? "Editar Campo" : "Agregar Nuevo Campo"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre del campo"
            name="name"
            value={fieldForm.name}
            onChange={handleFieldInputChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="field-type-label">Tipo de campo</InputLabel>
            <Select
              labelId="field-type-label"
              id="field-type"
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
            sx={{ mt: 1 }}
          />

          {fieldForm.type === "select" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Opciones de la lista
              </Typography>
              <Box sx={{ display: "flex", mb: 1 }}>
                <TextField
                  fullWidth
                  label="Nueva opción"
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddOption}
                  sx={{ ml: 1 }}
                  disabled={!newOptionText.trim()}
                >
                  Agregar
                </Button>
              </Box>
              <Box sx={{ mt: 1 }}>
                {fieldForm.options.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay opciones definidas
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {fieldForm.options.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        onDelete={() => handleDeleteOption(option)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFieldDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveField}
            variant="contained"
            color="primary"
            disabled={savingField}
          >
            {savingField ? (
              <CircularProgress size={24} />
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography>
            ¿Estás seguro que deseas eliminar el campo &quot;
            {fieldToDelete?.name}&quot;?
          </Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer y podría afectar a las citas existentes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmDeleteField}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : "Eliminar"}
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