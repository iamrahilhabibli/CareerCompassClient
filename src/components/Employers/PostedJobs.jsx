import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useTable } from "react-table";
import axios from "axios";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";
import useUser from "../../customhooks/useUser";
import { Spinner } from "@chakra-ui/react";

const fetchVacancies = async (id, token) => {
  const url = `https://localhost:7013/api/Vacancies/GetVacanciesById?id=${id}`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export function PostedJobs() {
  const { userId, token, isAuthenticated } = useUser();

  const { data: recruiterDetails } = useQuery(
    ["recruiterDetails", userId],
    () => fetchRecruiterDetails(userId, token),
    {
      enabled: Boolean(userId) && isAuthenticated,
    }
  );

  const {
    data: vacancies,
    isLoading,
    error: vacanciesError,
  } = useQuery(
    ["vacancies", recruiterDetails?.id],
    () => fetchVacancies(recruiterDetails?.id, token),
    {
      enabled: Boolean(recruiterDetails?.id) && isAuthenticated,
    }
  );

  if (vacanciesError) {
    console.error("Error fetching vacancies:", vacanciesError);
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Job Title",
        accessor: "jobTitle",
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: vacancies || [] });

  if (isLoading) {
    return (
      <Spinner
        size="xl"
        thickness="4px"
        speed="0.5s"
        emptyColor="gray.200"
        color="blue.500"
      />
    );
  }
  return (
    <div>
      <h1>Posted Jobs</h1>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
