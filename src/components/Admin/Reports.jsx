import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";

export default function Reports() {
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filters, setFilters] = useState({
    showTotalUsers: true,
    showJobSeekers: true,
    showRecruiters: true,
  });

  const fetchData = () => {
    if (startDate && endDate) {
      const url = `https://localhost:7013/api/Dashboards/GetUserStats?startDate=${startDate}&endDate=${endDate}`;
      axios
        .get(url)
        .then((response) => {
          setChartData(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the data:", error);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div>
      <Box mb="20px" display={"flex"} alignItems="center" gap={4}>
        <FormControl id="startDate">
          <FormLabel>Start Date</FormLabel>
          <Input
            bg="white"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>
        <FormControl id="endDate">
          <FormLabel>End Date</FormLabel>
          <Input
            bg="white"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          leftIcon={<SearchIcon />}
          onClick={fetchData}
          mt={"auto"}
        ></Button>
      </Box>
      <CheckboxGroup colorScheme="blue">
        <Checkbox
          isChecked={filters.showTotalUsers}
          onChange={(e) =>
            setFilters({ ...filters, showTotalUsers: e.target.checked })
          }
        >
          Total Users
        </Checkbox>
        <Checkbox
          isChecked={filters.showJobSeekers}
          onChange={(e) =>
            setFilters({ ...filters, showJobSeekers: e.target.checked })
          }
        >
          Job Seekers
        </Checkbox>
        <Checkbox
          isChecked={filters.showRecruiters}
          onChange={(e) =>
            setFilters({ ...filters, showRecruiters: e.target.checked })
          }
        >
          Recruiters
        </Checkbox>
      </CheckboxGroup>

      <Box bg="white" borderRadius="md" boxShadow="md" p={4} width={650}>
        <LineChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          {filters.showTotalUsers && (
            <Line type="monotone" dataKey="totalUsers" stroke="#8884d8" />
          )}
          {filters.showJobSeekers && (
            <Line type="monotone" dataKey="jobSeekers" stroke="#82ca9d" />
          )}
          {filters.showRecruiters && (
            <Line type="monotone" dataKey="recruiters" stroke="#ffc658" />
          )}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            tickFormatter={(tickItem) => {
              const date = new Date(tickItem);
              return `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
      </Box>
    </div>
  );
}
