import PropTypes from "prop-types";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { Contacts } from "../pages/Contacts";
import { AppointmentCalendar } from "../pages/AppointmentCalendar";
import { CalendarIcon } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";

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
  let content;
  switch (pathname) {
    case "/calendar":
      content = <AppointmentCalendar />;
      break;
    case "/contacts":
      content = <Contacts />;
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
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image,
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
          icon: <CalendarIcon />,
        },
        {
          segment: "contacts",
          title: "Lista de Contactos",
          icon: <ContactMailIcon />,
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
