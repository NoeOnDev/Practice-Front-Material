import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  getExportColumns,
  exportAppointments,
} from "../../services/appointmentService";

export const ExportDialog = ({ open, onClose }) => {
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      loadColumns();
    }
  }, [open]);

  const loadColumns = async () => {
    try {
      setLoading(true);
      setError(null);
      const columnsData = await getExportColumns();
      setColumns(columnsData);
      // Por defecto, seleccionar todas las columnas
      setSelectedColumns(columnsData.map((column) => column.key));
    } catch (error) {
      console.error("Error cargando columnas:", error);
      setError("Error al cargar las columnas disponibles");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAll = (event) => {
    if (event.target.checked) {
      setSelectedColumns(columns.map((column) => column.key));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleToggleColumn = (columnKey) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnKey)) {
        return prev.filter((key) => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      setError("Debes seleccionar al menos una columna para exportar");
      return;
    }

    try {
      setExporting(true);
      setError(null);
      await exportAppointments(selectedColumns);
      onClose();
    } catch (error) {
      console.error("Error en la exportación:", error);
      setError("Error al exportar las citas. Por favor, inténtalo de nuevo.");
    } finally {
      setExporting(false);
    }
  };

  // Separar las columnas estándar de las personalizadas
  const standardColumns = columns.filter((col) => !col.custom);
  const customColumns = columns.filter((col) => col.custom);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Exportar Citas</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              Selecciona las columnas que deseas incluir en el archivo CSV
              exportado.
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedColumns.length === columns.length}
                  indeterminate={
                    selectedColumns.length > 0 &&
                    selectedColumns.length < columns.length
                  }
                  onChange={handleToggleAll}
                  disabled={exporting}
                />
              }
              label="Seleccionar todas las columnas"
            />

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Columnas estándar
            </Typography>
            <FormGroup sx={{ ml: 2 }}>
              {standardColumns.map((column) => (
                <FormControlLabel
                  key={column.key}
                  control={
                    <Checkbox
                      checked={selectedColumns.includes(column.key)}
                      onChange={() => handleToggleColumn(column.key)}
                      disabled={exporting}
                    />
                  }
                  label={column.label}
                />
              ))}
            </FormGroup>

            {customColumns.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Campos personalizados
                </Typography>
                <FormGroup sx={{ ml: 2 }}>
                  {customColumns.map((column) => (
                    <FormControlLabel
                      key={column.key}
                      control={
                        <Checkbox
                          checked={selectedColumns.includes(column.key)}
                          onChange={() => handleToggleColumn(column.key)}
                          disabled={exporting}
                        />
                      }
                      label={column.label}
                    />
                  ))}
                </FormGroup>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={exporting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={loading || exporting || selectedColumns.length === 0}
          startIcon={
            exporting && <CircularProgress size={16} color="inherit" />
          }
        >
          {exporting ? "Exportando..." : "Exportar CSV"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
