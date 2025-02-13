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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        overflow: "auto",
        "& .MuiTable-root": {
          minWidth: 1200,
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
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
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
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
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalRows}
        page={page - 1} // TablePagination usa base 0
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count}`
        }
        rowsPerPageOptions={[5, 10, 15, 25, 50]}
      />
    </TableContainer>
  );
};

ContactsTable.propTypes = {
  contacts: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};