import { createContext, useContext } from "react";

const DownloadContext = createContext();

export const useDownload = () => {
  return useContext(DownloadContext);
};

export default DownloadContext;
