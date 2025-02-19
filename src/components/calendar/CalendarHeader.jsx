import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Today, Settings } from "@mui/icons-material";
import PropTypes from "prop-types";

export const CalendarHeader = ({
  title,
  viewMode,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onConfigClick,
}) => {
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 },
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          order: { xs: 1, sm: 2 },
          mb: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textTransform: "capitalize",
            fontSize: {
              xs: "1rem",
              sm: "1.25rem",
            },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onConfigClick}
            size="small"
            sx={{
              mr: 1,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Settings />
          </IconButton>
          <FormControl size="small">
            <Select
              value={viewMode}
              onChange={onViewChange}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                height: { xs: 35, sm: 40 },
                "& .MuiSelect-select": {
                  py: 1,
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                },
              }}
            >
              <MenuItem value="multiMonthYear">Año</MenuItem>
              <MenuItem value="dayGridMonth">Mes</MenuItem>
              <MenuItem value="timeGridWeek">Semana</MenuItem>
              <MenuItem value="timeGridDay">Día</MenuItem>
              <MenuItem value="listWeek">Lista</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 1.5 }}
        sx={{
          width: { xs: "100%", sm: "auto" },
          order: { xs: 2, sm: 1 },
          mr: { sm: 4 },
        }}
      >
        <Button
          variant="outlined"
          onClick={onPrev}
          startIcon={<ChevronLeft />}
          sx={{
            height: { xs: 35, sm: 40 },
            minWidth: { xs: 0, sm: 110 },
            flex: { xs: 1, sm: "none" },
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" } }}>Anterior</Box>
        </Button>
        <Button
          variant="outlined"
          onClick={onNext}
          endIcon={<ChevronRight />}
          sx={{
            height: { xs: 35, sm: 40 },
            minWidth: { xs: 0, sm: 110 },
            flex: { xs: 1, sm: "none" },
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" } }}>Siguiente</Box>
        </Button>
        <Button
          variant="contained"
          onClick={onToday}
          startIcon={<Today />}
          sx={{
            height: { xs: 35, sm: 40 },
            minWidth: { xs: 0, sm: 100 },
            flex: { xs: 1, sm: "none" },
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" } }}>Hoy</Box>
        </Button>
      </Stack>
    </Box>
  );
};

CalendarHeader.propTypes = {
  title: PropTypes.string.isRequired,
  viewMode: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onToday: PropTypes.func.isRequired,
  onConfigClick: PropTypes.func.isRequired,
};
