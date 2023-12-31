import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
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
  useToast,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import registeredCompanies from "../../images/companiesRegistered.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUser from "../../customhooks/useUser";
import { debounce } from "lodash";
export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, token } = useUser();
  const [sortOrders, setSortOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [companyIdToDelete, setcompanyIdToDelete] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const maxPage = Math.ceil(totalItems / pageSize);
  const toastSuccess = (message) => {
    toast({
      title: message,
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };

  const toastError = (message) => {
    toast({
      title: message,
      status: "error",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };
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
  const promptToDelete = (id) => {
    setcompanyIdToDelete(id);
    setAlertDialogOpen(true);
  };
  const executeCompanyDeletion = async () => {
    if (!companyIdToDelete) return;

    try {
      await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveCompany?companyId=${companyIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toastSuccess("Company deleted successfully");
      setCompanies((prevCompanies) =>
        prevCompanies.filter(
          (company) => company.companyId !== companyIdToDelete
        )
      );
    } catch (error) {
      console.error(
        `Something went wrong: ${
          error.response?.data?.message || error.message
        }`
      );
      toastError("Something went wrong");
    } finally {
      setcompanyIdToDelete(null);
      setAlertDialogOpen(false);
    }
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      navigate(`/companymanagement?page=${newPage}`, {
        replace: true,
      });
      return newPage;
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      navigate(`/companymanagement?page=${newPage}`, {
        replace: true,
      });
      return newPage;
    });
  };

  const debouncedFetchCompanies = debounce(async () => {
    const sortOrdersString = Object.keys(sortOrders)
      .map((key) => `${key}_${sortOrders[key]}`)
      .join("|");

    let url = `https://localhost:7013/api/Dashboards/GetAllCompanies?page=${currentPage}&pageSize=${pageSize}`;

    if (sortOrdersString) {
      url += `&sortOrder=${sortOrdersString}`;
    }
    if (searchQuery) {
      url += `&searchQuery=${searchQuery}`;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.get(url, config);

      if (data && data.items) {
        setCompanies(data.items);
        setTotalItems(data.totalItems);
      } else {
        console.warn("Received unexpected data format", data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching", error);
    }
  }, 1000);

  useEffect(() => {
    setIsLoading(true);
    debouncedFetchCompanies();
  }, [sortOrders, searchQuery, currentPage]);
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
            <TableCaption>
              Registered Companies: {companies.length}
            </TableCaption>
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
                ) : (companies?.length ?? 0) === 0 ? (
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
                            onClick={() => promptToDelete(company.companyId)}
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
      <AlertDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this company? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={executeCompanyDeletion} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="blue.50"
        p={4}
        rounded="md"
      >
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        <Text fontSize="xl" color="blue.800">
          Page {currentPage} of {maxPage}
        </Text>
        <Button onClick={handleNext} disabled={currentPage >= maxPage}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
