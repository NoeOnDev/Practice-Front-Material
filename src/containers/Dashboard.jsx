import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { ContactsList } from "../pages/ContactsList";
import { Contacts } from "../pages/Contacts";

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
    case "/contacts-list":
      content = <ContactsList />;
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

  const router = useDemoRouter("/contacts-list");

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={[
        {
          segment: "contacts-list",
          title: "Lista de Contactos",
          icon: <ContactMailIcon />,
        },
        {
          segment: "contacts",
          title: "Nuevo Contacto",
          icon: <ContactMailIcon />,
        },
      ]}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: "My Dashboard",
        homeUrl: "/contacts-list",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
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
