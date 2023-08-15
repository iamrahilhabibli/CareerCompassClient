import { useMutation } from "react-query";

export const registerCompany = async (data) => {
  const response = await fetch("https://localhost:7013/api/Companies/Create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
