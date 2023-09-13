import { Box, Center, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../customhooks/useUser";

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== "Recruiter") {
        navigate("/forbidden");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  // If it's still loading, or conditions are not met, show the spinner
  if (loading || !isAuthenticated || userRole !== "Recruiter") {
    return (
      <Box minH="100vh">
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Box>
    );
  }

  // Once everything is verified, render children
  return <>{children}</>;
};
