import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { loginUser } from "../services/authUser";
import { getCurrentUser } from "../services/userService";
import { AuthContext } from "../hooks/useAuth";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setCurrentUser({
          name: userData.user.name,
          email: userData.user.email,
          image: userData.user.profile_image_url || "https://i.pravatar.cc/300",
          id: userData.user.id,
        });
      } catch (error) {
        console.error("Error verificando estado de autenticación:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.token);

      const userData = await getCurrentUser();
      setCurrentUser({
        name: userData.user.name,
        email: userData.user.email,
        image: userData.user.profile_image_url || "https://i.pravatar.cc/300",
        id: userData.user.id,
      });

      navigate("/dashboard");
      return true;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      setError(error.response?.data?.message || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
