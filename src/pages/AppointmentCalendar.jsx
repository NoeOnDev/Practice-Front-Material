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
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Stack direction="row" spacing={1.5} flex={1}>
            <Button
              variant="outlined"
              onClick={handlePrev}
              startIcon={<ChevronLeft />}
              sx={{
                height: 40,
                minWidth: 110,
                textTransform: "none",
                fontSize: "0.95rem",
              }}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              onClick={handleNext}
              endIcon={<ChevronRight />}
              sx={{
                height: 40,
                minWidth: 110,
                textTransform: "none",
                fontSize: "0.95rem",
              }}
            >
              Siguiente
            </Button>
            <Button
              variant="contained"
              onClick={handleToday}
              startIcon={<Today />}
              sx={{
                height: 40,
                minWidth: 100,
                textTransform: "none",
                fontSize: "0.95rem",
              }}
            >
              Hoy
            </Button>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              textTransform: "capitalize",
              fontSize: {
                xs: "1.1rem",
                sm: "1.25rem",
              },
              flex: 1,
              textAlign: "center",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <FormControl size="small">
              <Select
                value={viewMode}
                onChange={handleViewChange}
                sx={{
                  minWidth: 120,
                  height: 40,
                  "& .MuiSelect-select": {
                    py: 1,
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
        </Box>

        <Box sx={{ p: 2, height: "calc(100% - 72px)" }}>
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
