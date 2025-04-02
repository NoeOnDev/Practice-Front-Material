import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Box, Paper, CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { CalendarHeader } from "../components/calendar/CalendarHeader";
import { useAppointmentEvents } from "../components/calendar/AppointmentEvents";
import { AppointmentFormModal } from "../components/calendar/AppointmentFormModal";
import { CalendarConfigModal } from "../components/calendar/CalendarConfigModal";
import { BusinessTypeOnboarding } from "../components/calendar/BusinessTypeOnboarding";
import { customScrollbarStyles } from "../utils/styleUtils";

export const AppointmentCalendar = () => {
  const [viewMode, setViewMode] = useState("timeGridWeek");
  const [title, setTitle] = useState("");
  const calendarRef = useRef(null);
  const containerRef = useRef(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [calendarConfig, setCalendarConfig] = useState({
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  const {
    events,
    loading,
    openModal,
    selectedAppointment,
    showOnboarding,
    businessTypes,
    formStructure,
    handleSelect,
    handleEventClick,
    handleEventChange,
    handleModalClose,
    handleModalSubmit,
    handleModalChange,
    handleDeleteAppointment,
    renderEventContent,
    handleAttendComplete,
    handleNewAppointment
  } = useAppointmentEvents();

  const handleOnboardingComplete = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateSize();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

  const handleConfigChange = (newConfig) => {
    setCalendarConfig(newConfig);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.setOption("businessHours", {
        daysOfWeek: newConfig.businessHours.daysOfWeek,
        startTime: newConfig.businessHours.startTime,
        endTime: newConfig.businessHours.endTime,
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (showOnboarding) {
    return (
      <BusinessTypeOnboarding
        businessTypes={businessTypes}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper elevation={3} sx={{ height: "100%", overflow: "auto" }}>
        <CalendarHeader
          title={title}
          viewMode={viewMode}
          onViewChange={handleViewChange}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onConfigClick={() => setConfigOpen(true)}
          onNewAppointment={handleNewAppointment}
        />

        <Box
          sx={{
            height: "calc(100% - 75px)",
            overflow: "hidden",
            "& .fc": {
              height: "100%",
              width: "100%",
            },
            "& .fc-view-harness": {
              height: "100% !important",
            },
            "& .fc-multimonth-daygrid": {
              backgroundColor: "background.paper",
            },
            "& .fc-multimonth": {
              backgroundColor: "background.default",
            },
            "& .fc-multimonth-title": {
              color: "text.primary",
              backgroundColor: "background.default",
            },
            "& .fc-multimonth-header": {
              backgroundColor: "background.default",
            },
            "& .fc-multimonth-daygrid-table": {
              backgroundColor: "background.paper",
            },
            "& .fc-day": {
              backgroundColor: "background.paper",
            },
            "& ::-webkit-scrollbar": {
              width: "6px",
              height: "8px",
            },
            "& ::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "& ::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
            },
            "& ::-webkit-scrollbar-thumb:hover": {
              background: "rgba(0, 0, 0, 0.3)",
            },
            "@media (prefers-color-scheme: dark)": {
              "& ::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.2)",
              },
              "& ::-webkit-scrollbar-thumb:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            },
            "& .fc-more-link": {
              color: "primary.main",
              textDecoration: "none",
              fontSize: "0.85em",
              fontWeight: "500",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            "& .fc-daygrid-event": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            "& .fc-daygrid-block-event .fc-event-time": {
              fontSize: "0.85em",
            },
            "& .fc-list": {
              backgroundColor: "background.default",
            },
            "& .fc-list-day": {
              backgroundColor: "background.default",
            },
            "& .fc-list-day-cushion": {
              backgroundColor: "background.paper",
            },
            "& .fc-list-event": {
              backgroundColor: "background.paper",
              "&:hover td": {
                backgroundColor: "action.hover",
              },
            },
            "& .fc-list-day-text, & .fc-list-day-side-text": {
              color: "text.primary",
            },
            "& .fc-list-empty": {
              backgroundColor: "background.paper",
              color: "text.secondary",
            },
            ...customScrollbarStyles,
          }}
        >
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
                dayMaxEventRows: 3,
              },
              dayGridMonth: {
                eventDisplay: "block",
                moreLinkClassNames: "fc-more-link",
              },
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            selectOverlap={false}
            /* selectAllow={function (selectInfo) {
              return (
                selectInfo.start.getTime() >= new Date().getTime() &&
                selectInfo.end.getTime() >= selectInfo.start.getTime()
              );
            }}
              */
            dayMaxEvents={true}
            /* businessHours={{
              daysOfWeek: calendarConfig.businessHours.daysOfWeek,
              startTime: calendarConfig.businessHours.startTime,
              endTime: calendarConfig.businessHours.endTime,
            }} */

            // selectConstraint="businessHours"
            handleWindowResize={true}
            events={events}
            select={handleSelect}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            dayMaxEventRows={true}
            moreLinkText={(nEvents) => `+${nEvents} más`}
            moreLinkClick="popover"
            eventDisplay="block"
            eventMaxStack={3}
            eventContent={renderEventContent}
            eventOverlap={false}
            weekNumbers={false}
          />
        </Box>
      </Paper>

      <AppointmentFormModal
        open={openModal}
        appointment={selectedAppointment || {}}
        contacts={[]}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onChange={handleModalChange}
        onDelete={handleDeleteAppointment}
        title={
          selectedAppointment?.status === "attended" ||
          selectedAppointment?.status === "cancelled"
            ? "Detalles de la Cita"
            : selectedAppointment?.id
              ? "Editar Cita"
              : "Nueva Cita"
        }
        formStructure={formStructure}
        onAttendComplete={handleAttendComplete}
      />

      <CalendarConfigModal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        config={calendarConfig}
        onConfigChange={handleConfigChange}
      />
    </Box>
  );
};
