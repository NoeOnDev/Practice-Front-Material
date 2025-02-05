import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import {
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
import { useState, useRef } from "react";

export const AppointmentCalendar = () => {
  const [viewMode, setViewMode] = useState("dayGridMonth");
  const [title, setTitle] = useState("");
  const calendarRef = useRef(null);

  const handleViewChange = (event) => {
    setViewMode(event.target.value);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(event.target.value);
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setTitle(calendarApi.view.title);
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setTitle(calendarApi.view.title);
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setTitle(calendarApi.view.title);
  };

  const handleDatesSet = (arg) => {
    setTitle(arg.view.title);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper elevation={3} sx={{ height: "100%", overflow: "hidden" }}>
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

            <FormControl size="small">
              <Select
                value={viewMode}
                onChange={handleViewChange}
                sx={{
                  minWidth: { xs: 100, sm: 120 },
                  height: { xs: 35, sm: 40 },
                  "& .MuiSelect-select": {
                    py: 1,
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                  },
                }}
              >
                <MenuItem value="dayGridMonth">Mes</MenuItem>
                <MenuItem value="timeGridWeek">Semana</MenuItem>
                <MenuItem value="timeGridDay">Día</MenuItem>
                <MenuItem value="listWeek">Lista</MenuItem>
              </Select>
            </FormControl>
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
              onClick={handlePrev}
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
              onClick={handleNext}
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
              onClick={handleToday}
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

        <Box sx={{ p: { xs: 1, sm: 2 }, height: "calc(100% - 75px)" }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              multiMonthPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView={viewMode}
            locale={esLocale}
            height="100%"
            allDaySlot={false}
            headerToolbar={false}
            datesSet={handleDatesSet}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }}
            dayHeaderFormat={{
              weekday: "short",
            }}
            views={{
              timeGrid: {
                dayHeaderFormat: {
                  weekday: "short",
                },
              },
              dayGrid: {
                dayHeaderFormat: {
                  weekday: "short",
                },
              },
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6],
              startTime: "09:00",
              endTime: "20:00",
            }}
            selectConstraint="businessHours"
          />
        </Box>
      </Paper>
    </Box>
  );
};
