import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const useUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let userId = null;
  let email = null;
  let userRole = null;

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      userId = decodedToken.sub;
      email = decodedToken.email;
      userRole = decodedToken.role;
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();

    window.addEventListener("tokenChanged", checkAuthentication);
    window.addEventListener("storage", checkAuthentication);

    return () => {
      window.removeEventListener("tokenChanged", checkAuthentication);
      window.removeEventListener("storage", checkAuthentication);
    };
  }, []);

  return { isAuthenticated, userId, email, userRole };
};

export default useUser;
