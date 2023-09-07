export const fetchCompanyDetails = async (companyName) => {
  try {
    const endpoint = `https://localhost:7013/api/Companies/GetCompanyDetails?companyName=${encodeURIComponent(
      companyName
    )}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
