import {
  Box,
  Flex,
  Heading,
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
import React, { useEffect, useState } from "react";
import registeredCompanies from "../../images/companiesRegistered.png";
import axios from "axios";
export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(
        "https://localhost:7013/api/Dashboards/GetAllCompanies"
      );
      setCompanies(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);
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
                <Th>Reviews Count</Th>
                <Th>Followers Count</Th>
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
                      <Td>{company.followersCount}</Td>
                      <Td>{company.reviewsCount}</Td>
                      <Td>{company.location}</Td>
                      <Td>
                        {/* <Flex direction="row" spacing={2} gap={"8px"}>
                          {user.role !== "Admin" && (
                            <Button
                              colorScheme="teal"
                              variant="solid"
                              size="xs"
                              borderRadius="full"
                              onClick={() => promptToChangeRole(user.appUserId)}
                            >
                              Change Role
                            </Button>
                          )}
                          <Button
                            colorScheme="red"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            onClick={() => promptToDelete(user.appUserId)}
                          >
                            Delete
                          </Button>
                        </Flex> */}
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
