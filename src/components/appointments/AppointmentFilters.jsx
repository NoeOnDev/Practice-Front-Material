import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Chip,
  Collapse,
  Divider,
  Autocomplete,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import ClearIcon from "@mui/icons-material/Clear";
import PropTypes from "prop-types";
import { useState } from "react";

export const AppointmentFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  contacts,
  loading,
  activeFilterCount,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  // Ordenar los contactos alfabéticamente por nombre
  const sortedContacts = [...(contacts || [])].sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <Box sx={{ mt: 2, mb: expanded ? 3 : 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={toggleExpanded}
            color={expanded ? "primary" : "default"}
            size="small"
          >
            {expanded ? <FilterListOffIcon /> : <FilterListIcon />}
          </IconButton>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filtros avanzados
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              size="small"
              color="primary"
              label={activeFilterCount}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        {activeFilterCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={onClearFilters}
            startIcon={<ClearIcon />}
          >
            Limpiar filtros
          </Button>
        )}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) =>
                    onFilterChange("status", e.target.value || null)
                  }
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="attended">Atendida</MenuItem>
                  <MenuItem value="cancelled">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <DatePicker
                  label="Desde"
                  value={
                    filters.start_date ? new Date(filters.start_date) : null
                  }
                  onChange={(date) => {
                    const formatted = date
                      ? date.toISOString().split("T")[0]
                      : null;
                    onFilterChange("start_date", formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      InputProps: {
                        endAdornment: filters.start_date && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFilterChange("start_date", null);
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <DatePicker
                  label="Hasta"
                  value={filters.end_date ? new Date(filters.end_date) : null}
                  onChange={(date) => {
                    const formatted = date
                      ? date.toISOString().split("T")[0]
                      : null;
                    onFilterChange("end_date", formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      InputProps: {
                        endAdornment: filters.end_date && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFilterChange("end_date", null);
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                fullWidth
                size="small"
                options={sortedContacts}
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.last_name}`
                }
                value={
                  sortedContacts.find(
                    (contact) => contact.id === filters.contact_id
                  ) || null
                }
                onChange={(event, newValue) => {
                  onFilterChange("contact_id", newValue ? newValue.id : null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Contacto" />
                )}
                loading={loading}
                loadingText="Cargando contactos..."
                noOptionsText="No hay contactos disponibles"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.sort_by || "start"}
                  onChange={(e) => onFilterChange("sort_by", e.target.value)}
                  label="Ordenar por"
                >
                  <MenuItem value="start">Fecha de inicio</MenuItem>
                  <MenuItem value="title">Título</MenuItem>
                  <MenuItem value="status">Estado</MenuItem>
                  <MenuItem value="created_at">Fecha de creación</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Orden</InputLabel>
                <Select
                  value={filters.sort_order || "desc"}
                  onChange={(e) => onFilterChange("sort_order", e.target.value)}
                  label="Orden"
                >
                  <MenuItem value="desc">Descendente</MenuItem>
                  <MenuItem value="asc">Ascendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="outlined" onClick={onClearFilters} sx={{ mr: 1 }}>
              Limpiar
            </Button>
            <Button
              variant="contained"
              onClick={() => setExpanded(false)}
              color="primary"
            >
              Aplicar filtros
            </Button>
          </Box>
        </Box>
      </Collapse>
      {expanded && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
};

AppointmentFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  contacts: PropTypes.array,
  loading: PropTypes.bool,
  activeFilterCount: PropTypes.number.isRequired,
};

AppointmentFilters.defaultProps = {
  contacts: [],
  loading: false,
};
