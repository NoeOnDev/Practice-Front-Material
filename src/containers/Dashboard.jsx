import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { Home } from "../pages/Home";
import { Profile } from "../pages/Profile";
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
    case "/home":
      content = <Home />;
      break;
    case "/profile":
      content = <Profile />;
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
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutNavigationLinks(props) {
  const { window } = props;

  const router = useDemoRouter("/home");

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={[
        {
          segment: "home",
          title: "Home",
          icon: <DescriptionIcon />,
        },
        {
          segment: "profile",
          title: "Profile",
          icon: <DescriptionIcon />,
        },
        {
          segment: "contacts",
          title: "Contacts",
          icon: <DescriptionIcon />,
        },
      ]}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutNavigationLinks.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutNavigationLinks;
