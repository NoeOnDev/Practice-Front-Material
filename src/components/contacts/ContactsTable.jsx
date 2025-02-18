import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TablePagination,
  Checkbox,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PropTypes from "prop-types";
import { formatDate } from "../../utils/dateUtils";

export const ContactsTable = ({
  contacts,
  onRowClick,
  onEditClick,
  onDeleteClick,
  page,
  totalRows,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  searchQuery,
  onSearchChange,
  selected,
  setSelected,
}) => {
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(contacts.map((contact) => contact.id));
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

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          placeholder="Buscar contactos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
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

      {contacts.length === 0 && searchQuery ? (
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
            No se encontraron contactos con el término &quot;{searchQuery}&quot;
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Prueba con otros términos de búsqueda
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "background.default",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "grey.400",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "grey.500",
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < contacts.length
                      }
                      checked={
                        contacts.length > 0 &&
                        selected.length === contacts.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Correo Electrónico</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Fecha de Nacimiento</TableCell>
                  <TableCell>Notas</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => {
                  const isItemSelected = isSelected(contact.id);

                  return (
                    <TableRow key={contact.id} selected={isItemSelected} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelect(contact.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{
                          cursor: "pointer",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {`${contact.first_name} ${contact.last_name} ${contact.middle_name}`}
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{
                          cursor: "pointer",
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {contact.email}
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{ cursor: "pointer" }}
                      >
                        {`${contact.phone_code} ${contact.phone_number}`}
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{ cursor: "pointer" }}
                      >
                        {contact.state}
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{
                          cursor: "pointer",
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {contact.address}
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{ cursor: "pointer" }}
                      >
                        {formatDate(contact.birth_date)}
                      </TableCell>
                      <TableCell
                        onClick={() => onRowClick(contact)}
                        sx={{
                          cursor: "pointer",
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {contact.notes}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(contact);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(contact);
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
            count={totalRows}
            page={page - 1}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[5, 10, 15, 25, 50]}
          />
        </>
      )}
    </Paper>
  );
};

ContactsTable.propTypes = {
  contacts: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onMultipleDelete: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
