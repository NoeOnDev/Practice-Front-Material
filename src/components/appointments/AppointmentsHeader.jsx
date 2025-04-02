import { Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PropTypes from "prop-types";
import { useState } from "react";
import { ExportDialog } from "./ExportDialog";

export const AppointmentsHeader = ({
  selectedCount,
  onMultipleDelete,
  setSelected,
}) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <>
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
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => setExportDialogOpen(true)}
          >
            Exportar
          </Button>
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

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      />
    </>
  );
};

AppointmentsHeader.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onMultipleDelete: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};
