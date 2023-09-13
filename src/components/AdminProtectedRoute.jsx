import { Box, Center, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../customhooks/useUser";

export const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (
        !isAuthenticated ||
        !(userRole === "Master" || userRole === "Admin")
      ) {
        navigate("/forbidden");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  if (
    loading ||
    !isAuthenticated ||
    !(userRole === "Master" || userRole === "Admin")
  ) {
    return (
      <Box minH="100vh">
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Box>
    );
  }

  return <>{children}</>;
};
