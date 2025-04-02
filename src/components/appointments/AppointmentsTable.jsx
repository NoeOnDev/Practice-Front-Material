import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  CircularProgress,
  Checkbox,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  SearchOff as SearchOffIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { customScrollbarStyles } from "../../utils/styleUtils";
import { useState } from "react";
import { renderStatusChip } from "../../utils/appointmentUtils";

export const AppointmentsTable = ({
  appointments,
  customFields,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  selected,
  setSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      !searchQuery ||
      appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredAppointments.map((appointment) => appointment.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((itemId) => itemId !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSearch = (value) => {
    setLoading(true);
    setSearchQuery(value);
    setTimeout(() => setLoading(false), 300);
  };

  const visibleCustomFields = customFields.slice(0, 3);
  const hiddenFieldsCount = Math.max(0, customFields.length - 3);

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          placeholder="Buscar citas..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : (
              searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleSearch("")}>
                    <SearchOffIcon />
                  </IconButton>
                </InputAdornment>
              )
            ),
            sx: {
              backgroundColor: "background.paper",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "divider",
              },
            },
          }}
        />
      </Box>

      {filteredAppointments.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            gap: 2,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 60, color: "text.secondary" }} />
          <Typography color="text.secondary" variant="h6" align="center">
            {searchQuery
              ? `No se encontraron citas con el término "${searchQuery}"`
              : "No hay citas registradas"}
          </Typography>
          {searchQuery && (
            <Typography color="text.secondary" variant="body2">
              Prueba con otros términos de búsqueda
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              flex: 1,
              overflowY: "auto",
              ...customScrollbarStyles,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < filteredAppointments.length
                      }
                      checked={
                        filteredAppointments.length > 0 &&
                        selected.length === filteredAppointments.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Estado</TableCell>

                  {visibleCustomFields.map((field) => (
                    <TableCell key={`header-${field.id}`}>
                      {field.name}
                    </TableCell>
                  ))}

                  {hiddenFieldsCount > 0 && (
                    <TableCell>
                      <Tooltip
                        title={`${hiddenFieldsCount} campos adicionales no mostrados`}
                      >
                        <Badge badgeContent={hiddenFieldsCount} color="primary">
                          <MoreHorizIcon color="action" />
                        </Badge>
                      </Tooltip>
                    </TableCell>
                  )}

                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((appointment) => {
                    const isItemSelected = isSelected(appointment.id);

                    return (
                      <TableRow
                        key={appointment.id}
                        hover
                        selected={isItemSelected}
                        onClick={() => onEdit && onEdit(appointment)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleSelect(appointment.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            cursor: "pointer",
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {appointment.contactName}
                        </TableCell>
                        <TableCell
                          sx={{
                            cursor: "pointer",
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {appointment.title}
                        </TableCell>
                        <TableCell
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          {format(new Date(appointment.start), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          {format(new Date(appointment.start), "HH:mm", {
                            locale: es,
                          })}
                          {" - "}
                          {format(new Date(appointment.end), "HH:mm", {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={renderStatusChip(appointment.status).label}
                            color={renderStatusChip(appointment.status).color}
                          />
                        </TableCell>

                        {visibleCustomFields.map((field) => (
                          <TableCell
                            key={`cell-${appointment.id}-${field.id}`}
                            sx={{
                              cursor: "pointer",
                              maxWidth: 160,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {appointment[`custom_${field.id}`] || ""}
                          </TableCell>
                        ))}

                        {hiddenFieldsCount > 0 && (
                          <TableCell>
                            <Tooltip
                              title={
                                <Box>
                                  {customFields.slice(3).map((field) => (
                                    <Typography
                                      key={field.id}
                                      variant="body2"
                                      sx={{ mb: 0.5 }}
                                    >
                                      <strong>{field.name}:</strong>{" "}
                                      {appointment[`custom_${field.id}`] || "-"}
                                    </Typography>
                                  ))}
                                </Box>
                              }
                            >
                              <IconButton size="small">
                                <MoreHorizIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}

                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete && onDelete(appointment);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredAppointments.length}
            page={page - 1}
            onPageChange={(e, newPage) => onPageChange(e, newPage + 1)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 15, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </>
      )}
    </Paper>
  );
};

AppointmentsTable.propTypes = {
  appointments: PropTypes.array.isRequired,
  customFields: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
