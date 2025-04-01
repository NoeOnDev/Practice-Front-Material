import { useState, useEffect } from "react";
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
  Alert,
  Tooltip,
  CircularProgress,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { customScrollbarStyles } from "../../../utils/styleUtils";
import PropTypes from "prop-types";

export const CustomizeFormStep = ({
  formStructure,
  selectedType,
  onComplete,
}) => {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [savingField, setSavingField] = useState(false);

  const [fieldForm, setFieldForm] = useState({
    name: "",
    type: "text",
    required: false,
    options: [],
    order: 0,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [newOptionText, setNewOptionText] = useState("");

  useEffect(() => {
    const loadFields = () => {
      setLoading(true);
      try {
        let fieldsData = [];

        if (formStructure && formStructure.custom_fields) {
          fieldsData = formStructure.custom_fields;
        } else if (selectedType && selectedType.fields) {
          fieldsData = selectedType.fields;
        }

        setFields(fieldsData);

        onComplete({
          custom_fields: fieldsData,
        });
      } catch (error) {
        console.error("Error configurando campos:", error);
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, [formStructure, selectedType, onComplete]);

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

    try {
      const updatedFields = fields.filter((f) => f.id !== fieldToDelete.id);
      setFields(updatedFields);

      onComplete({
        custom_fields: updatedFields,
      });

      alert("Campo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar campo:", error);
      alert("Error al eliminar campo");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setFieldToDelete(null);
    }
  };

  const handleCloseFieldDialog = () => {
    setOpenFieldDialog(false);
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
      return;
    }

    if (
      fieldForm.type === "select" &&
      (!fieldForm.options || fieldForm.options.length === 0)
    ) {
      return;
    }

    setSavingField(true);

    try {
      let savedField;
      let updatedFields;

      if (editingField) {
        savedField = {
          ...fieldForm,
          id: editingField.id,
        };

        updatedFields = fields.map((field) =>
          field.id === savedField.id ? savedField : field
        );
      } else {
        const tempId = -1 * Date.now();
        savedField = {
          ...fieldForm,
          id: tempId,
        };

        updatedFields = [...fields, savedField];
      }

      setFields(updatedFields);

      // Notifica al componente padre los campos actualizados
      onComplete({
        custom_fields: updatedFields,
      });

      alert(
        editingField
          ? "Campo actualizado correctamente"
          : "Campo creado correctamente"
      );

      setOpenFieldDialog(false);
    } catch (error) {
      console.error("Error al guardar campo:", error);
      alert(
        `Error al ${editingField ? "actualizar" : "crear"} campo: ${error.message || ""}`
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "lg",
        mt: 2,
        overflow: "auto",
        maxHeight: "100%",
        ...customScrollbarStyles,
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 3 }}>
        Personaliza los campos de atención
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4, position: "relative" }}>
        <Typography variant="h6" gutterBottom>
          Campos para la atención de citas
        </Typography>

        <Typography variant="body1" paragraph>
          Personaliza los campos que utilizarás durante la atención de citas
          para <strong>{selectedType?.name}</strong>. Puedes editar, eliminar o
          agregar nuevos campos según tus necesidades.
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="medium">
            ¡Importante! Los cambios que realices aquí no se guardarán
            permanentemente hasta que hagas clic en el botón
            &ldquo;Finalizar&rdquo; al final del proceso.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Si sales de esta pantalla, recargas la página o cierras el navegador
            antes de finalizar, perderás todos los cambios realizados en estos
            campos.
          </Typography>
        </Alert>

        <Alert severity="info" sx={{ mb: 3 }}>
          Los campos básicos (Contacto, Título, Estado, Fechas) no pueden ser
          modificados. Los campos personalizados se utilizarán durante la atención de las citas.
        </Alert>

        {fields.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary" variant="body1" sx={{ mb: 2 }}>
              No hay campos personalizados para este tipo de negocio.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddField}
            >
              Agregar campo
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ mb: 3 }}>
              {fields.map((field, index) => (
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
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar campo">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteField(field)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
            </List>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddField}
                color="primary"
              >
                Agregar campo
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Alert severity="info" sx={{ mb: 4 }}>
        No te preocupes si no estás seguro ahora. Podrás personalizar esta
        configuración más adelante desde los ajustes de tu agenda, pero recuerda hacer clic en &ldquo;Finalizar&rdquo; para guardar los cambios actuales.
      </Alert>

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
                <MenuItem value="select">Lista desplegable</MenuItem>
                <MenuItem value="number">Campo numérico</MenuItem>
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !deleting && setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el campo &ldquo;
            {fieldToDelete?.name}&rdquo;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDeleteField}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting && <CircularProgress size={16} color="inherit" />
            }
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

CustomizeFormStep.propTypes = {
  formStructure: PropTypes.object,
  selectedType: PropTypes.object,
  onComplete: PropTypes.func.isRequired,
};
