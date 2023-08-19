import { useNavigate } from "react-router-dom";
import axios from "axios";
export function useAxiosInterceptor() {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
  });

  const errorHandlers = {
    400: () => {},
    401: () => {
      console.log("401 handler executed");
      navigate("/forbidden");
    },
    404: () => {},
    default: () => {},
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const handler =
          errorHandlers[error.response.status] || errorHandlers.default;
        handler(error.response);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
