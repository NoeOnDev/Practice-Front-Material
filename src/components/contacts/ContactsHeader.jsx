import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

export const ContactsHeader = ({
  selectedCount,
  onMultipleDelete,
  onCreateNew,
  setSelected,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => {
          onMultipleDelete();
          setSelected([]);
        }}
        disabled={selectedCount === 0}
      >
        Eliminar ({selectedCount}) contactos
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onCreateNew}
        startIcon={<AddIcon />}
        sx={{
          fontSize: {
            xs: "0.875rem",
            sm: "0.9rem",
          },
          py: { xs: 1 },
          px: { xs: 2 },
          width: { xs: "auto", sm: "auto" },
        }}
      >
        Nuevo Contacto
      </Button>
    </Box>
  );
};

ContactsHeader.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onMultipleDelete: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};
