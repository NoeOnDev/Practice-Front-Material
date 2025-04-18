import PropTypes from "prop-types";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { Contacts } from "../pages/Contacts";
import { AppointmentCalendar } from "../pages/AppointmentCalendar";
import { Appointments } from "../pages/Appointments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import { AppointmentFieldsConfig } from "../pages/AppointmentFieldsConfig";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const basePath = pathname.split("/")[1];

  let content;

  switch (basePath) {
    case "calendar":
      content = <AppointmentCalendar />;
      break;
    case "contacts":
      content = <Contacts />;
      break;
    case "appointments":
      content = <Appointments />;
      break;
    case "settings":
      content = <AppointmentFieldsConfig />;
      break;
    default:
      content = <Typography>Page not found</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export const DashboardLayoutNavigationLinks = (props) => {
  const { window } = props;
  const router = useDemoRouter("/calendar");
  const demoWindow = window !== undefined ? window() : undefined;
  const navigate = useNavigate();
  const { currentUser, loading, signIn, signOut } = useAuth();

  React.useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return null;
  }

  const session = {
    user: {
      name: currentUser.displayName,
      email: currentUser.email,
      image: currentUser.photoURL,
    },
  };

  const authentication = {
    signIn: signIn,
    signOut: signOut,
  };

  return (
    <AppProvider
      navigation={[
        {
          segment: "calendar",
          title: "Agenda",
          icon: <EventIcon />,
        },
        {
          segment: "appointments",
          title: "Citas",
          icon: <ScheduleIcon />,
        },
        {
          segment: "contacts",
          title: "Lista de Contactos",
          icon: <ContactMailIcon />,
        },
        {
          segment: "settings",
          title: "Configuración",
          icon: <SettingsIcon />,
        },
      ]}
      branding={{
        logo: null,
        title: "Agenda Pro",
        homeUrl: "/calendar",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      session={session}
      authentication={authentication}
      localeText={{
        accountSignInLabel: "Iniciar sesión",
        accountSignOutLabel: "Cerrar sesión",
      }}
    >
      <DashboardLayout defaultSidebarCollapsed>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
};

DashboardLayoutNavigationLinks.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};
