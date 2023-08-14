import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const useUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.sub);
      setEmail(
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      );
      setUserRole(
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]
      );
      setIsAuthenticated(true);
    } else {
      setUserId(null);
      setEmail(null);
      setUserRole(null);
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
