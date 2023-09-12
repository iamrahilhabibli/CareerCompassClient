import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import registeredCompanies from "../../images/companiesRegistered.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUser from "../../customhooks/useUser";
export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, token } = useUser();
  const [sortOrders, setSortOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const updateSortOrders = (field, direction) => {
    setSortOrders((prevSortOrders) => {
      const newSortOrders = {
        ...prevSortOrders,
        [field]: direction,
      };

      const sortOrdersString = Object.keys(newSortOrders)
        .map((key) => `${key}_${newSortOrders[key]}`)
        .join("|");

      navigate(
        `/companymanagement?sortOrder=${sortOrdersString}&searchQuery=${searchQuery}`
      );
      return newSortOrders;
    });
  };

  useEffect(() => {
    const sortOrdersString = Object.keys(sortOrders)
      .map((key) => `${key}_${sortOrders[key]}`)
      .join("|");

    const fetchCompanies = async () => {
      try {
        let url = "https://localhost:7013/api/Dashboards/GetAllCompanies";
        if (sortOrdersString) {
          url += `?sortOrder=${sortOrdersString}`;
        }
        if (searchQuery) {
          const separator = sortOrdersString ? "&" : "?";
          url += `${separator}searchQuery=${searchQuery}`;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(url, config);
        setCompanies(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching", error);
      }
    };

    fetchCompanies();
  }, [sortOrders, searchQuery]);

  return (
    <Box
      rounded={"lg"}
      maxWidth={800}
      m="10px auto"
      borderRadius={"12px"}
      p={4}
      bg={"transparent"}
    >
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        height={"200px"}
        bg={"white"}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgImage={registeredCompanies}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review registered Companies
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />
      <Box mb={4}>
        <Flex align="center" justify="space-between">
          <Input
            bgColor={"white"}
            placeholder="Search by location or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            padding={2}
            width={"300px"}
            borderRadius="md"
            fontSize="sm"
            boxShadow="sm"
          />
          <Button
            onClick={() => setSearchQuery(searchQuery)}
            colorScheme="blue"
            ml={4}
          >
            Search
          </Button>
        </Flex>
      </Box>

      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        bg={"white"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Registered Companies</TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Company Name</Th>
                <Th>
                  Reviews Count
                  <ArrowUpIcon
                    boxSize={4}
                    cursor={"pointer"}
                    onClick={() => updateSortOrders("reviews", "asc")}
                  />
                  <ArrowDownIcon
                    boxSize={4}
                    cursor={"pointer"}
                    onClick={() => updateSortOrders("reviews", "desc")}
                  />
                </Th>
                <Th>
                  Followers Count
                  <ArrowUpIcon
                    boxSize={4}
                    cursor={"pointer"}
                    onClick={() => updateSortOrders("followers", "asc")}
                  />
                  <ArrowDownIcon
                    boxSize={4}
                    cursor={"pointer"}
                    onClick={() => updateSortOrders("followers", "desc")}
                  />
                </Th>

                <Th>Location</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            {
              <Tbody>
                {isLoading ? (
                  <Tr fontSize="sm">
                    <Td colSpan="6">
                      <Flex
                        justify="center"
                        align="center"
                        height="100px"
                        width="100%"
                      >
                        <Spinner />
                      </Flex>
                    </Td>
                  </Tr>
                ) : companies.length === 0 ? (
                  <Tr fontSize="sm">
                    <Td colSpan="6">No companies available</Td>
                  </Tr>
                ) : (
                  companies.map((company, index) => (
                    <Tr key={index} fontSize="sm">
                      <Td isNumeric>
                        <Tooltip
                          label={company.companyId}
                          aria-label="A tooltip"
                        >
                          <span>{company.companyId.substring(0, 8)}...</span>
                        </Tooltip>
                      </Td>
                      <Td>{company.companyName}</Td>
                      <Td>{company.reviewsCount}</Td>
                      <Td>{company.followersCount}</Td>
                      <Td>{company.location}</Td>
                      <Td>
                        <Flex direction="row" spacing={2} gap={"8px"}>
                          <Button
                            colorScheme="red"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            // onClick={() => promptToDelete(user.appUserId)}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            }
          </Table>
        </TableContainer>
      </Box>
      {/* <AlertDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={executeUserDeletion} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog> */}
    </Box>
  );
}
