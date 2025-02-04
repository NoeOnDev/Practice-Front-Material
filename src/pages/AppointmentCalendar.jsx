import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { es } from "date-fns/locale";
import { useTheme } from "@mui/material/styles";
import { Paper, IconButton, Box, Typography, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es },
});

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
};

// Primero definir las vistas disponibles
const views = {
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
};

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  const label = () => {
    const date = toolbar.date;
    return format(date, "MMMM yyyy", { locale: es });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        flexWrap: { xs: "wrap", sm: "nowrap" },
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            textTransform: "capitalize",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {label()}
        </Typography>
      </Box>

      {/* Selector de vistas */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          order: { xs: 3, sm: 2 },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {Object.keys(views).map((view) => (
          <Button
            key={view}
            onClick={() => toolbar.onView(view)}
            variant={toolbar.view === view ? "contained" : "outlined"}
            size="small"
            sx={{
              flex: { xs: 1, sm: "initial" },
              minWidth: "auto",
              px: 2,
            }}
          >
            {views[view]}
          </Button>
        ))}
      </Box>

      {/* Navegación */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          order: { xs: 2, sm: 3 },
        }}
      >
        <IconButton onClick={goToBack} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={goToCurrent} size="small">
          <Typography sx={{ fontSize: "0.875rem" }}>Hoy</Typography>
        </IconButton>
        <IconButton onClick={goToNext} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export const AppointmentCalendar = () => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        height: "calc(100vh - 100px)",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        components={{
          toolbar: CustomToolbar,
        }}
        style={{
          height: "100%",
          "--mui-palette-primary-main": theme.palette.primary.main,
          "--mui-palette-primary-contrastText":
            theme.palette.primary.contrastText,
          "--mui-palette-background-paper": theme.palette.background.paper,
          "--mui-palette-background-default": theme.palette.background.default,
          "--mui-palette-text-primary": theme.palette.text.primary,
          "--mui-palette-divider": theme.palette.divider,
          "--mui-palette-action-selected": theme.palette.action.selected,
          "--mui-palette-action-disabledBackground":
            theme.palette.action.disabledBackground,
        }}
      />
    </Paper>
  );
};
