import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Verify } from "../pages/Verify";
import { DashboardLayoutNavigationLinks } from "./Dashboard";
import { AuthProvider } from "../contexts/AuthContext";

export const App = () => {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route
              path="/dashboard/*"
              element={<DashboardLayoutNavigationLinks />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};
