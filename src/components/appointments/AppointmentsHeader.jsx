import { Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

export const AppointmentsHeader = ({
  selectedCount,
  onMultipleDelete,
  setSelected,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: { xs: 2, sm: 0 },
        mb: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 500,
          order: { xs: 1, sm: 1 },
          alignSelf: { xs: "flex-start", sm: "center" },
        }}
      >
        Citas
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          order: { xs: 2, sm: 2 },
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "space-between", sm: "flex-end" },
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
          Eliminar ({selectedCount}) citas
        </Button>
      </Box>
    </Box>
  );
};

AppointmentsHeader.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onMultipleDelete: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};
