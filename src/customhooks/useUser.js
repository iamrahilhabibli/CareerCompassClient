import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import jwt_decode from "jwt-decode";

const useUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    data: tokenResponse,
    error,
    refetch,
  } = useQuery(
    "refreshToken",
    () =>
      axios
        .get("https://localhost:7013/api/Accounts/RefreshToken", {
          params: { token: localStorage.getItem("refreshToken") },
        })
        .then((res) => res.data),
    {
      enabled: false,
    }
  );

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const current_time = new Date().getTime() / 1000;

      if (decodedToken.exp < current_time) {
        setIsTokenExpired(true);
      } else {
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
        setIsTokenExpired(false);
      }
      setLoading(false);
    } else {
      setUserId(null);
      setEmail(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const refreshJWT = () => {
    refetch();
  };

  useEffect(() => {
    checkAuthentication();

    if (isTokenExpired) {
      refreshJWT();
    }

    window.addEventListener("tokenChanged", checkAuthentication);
    window.addEventListener("storage", checkAuthentication);

    return () => {
      window.removeEventListener("tokenChanged", checkAuthentication);
      window.removeEventListener("storage", checkAuthentication);
    };
  }, [isTokenExpired, tokenResponse]);

  useEffect(() => {
    if (tokenResponse) {
      localStorage.setItem("token", tokenResponse.token);
      localStorage.setItem("refreshToken", tokenResponse.refreshToken);
      checkAuthentication();
      setLoading(false);
    }
    if (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUserId(null);
      setEmail(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [tokenResponse, error]);

  return { isAuthenticated, userId, email, userRole, loading };
};

export default useUser;
