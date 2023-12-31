import React, { useEffect, useState } from "react";
import dashboardUsers from "../../images/dashboardUsers.png";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Radio,
  Stack,
  RadioGroup,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import useUser from "../../customhooks/useUser";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isChangeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { userId, token, userRole } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const debouncedSave = debounce(async () => {
    let url = `https://localhost:7013/api/Dashboards/GetAllUsers?pageNumber=${currentPage}&pageSize=${pageSize}`;
    if (searchQuery) {
      url += `&searchQuery=${searchQuery}`;
    }
    setIsLoading(true);

    try {
      const { data } = await api.get(url);
      if (data && data.items && typeof data.totalItems === "number") {
        setUsers(data.items);
        setMaxPage(Math.ceil(data.totalItems / pageSize));
      }
    } catch (error) {
      console.error(
        `Error fetching data: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  }, 1000);

  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      navigate(`/usermanagement?page=${newPage}`, { replace: true });
      return newPage;
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      navigate(`/usermanagement?page=${newPage}`, { replace: true });
      return newPage;
    });
  };

  useEffect(() => {
    debouncedSave();
  }, [searchQuery, currentPage]);

  const promptToDelete = (id) => {
    setUserIdToDelete(id);
    setAlertDialogOpen(true);
  };
  const api = axios.create({
    baseURL: "https://localhost:7013/api/Dashboards",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const executeUserDeletion = async () => {
    if (!userIdToDelete) return;

    try {
      await api.delete(`/RemoveUser?appUserId=${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toastSuccess("User deleted successfully");
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.appUserId !== userIdToDelete)
      );
    } catch (error) {
      console.error(
        `Something went wrong: ${
          error.response?.data?.message || error.message
        }`
      );
      toastError("Something went wrong");
    } finally {
      setUserIdToDelete(null);
      setAlertDialogOpen(false);
    }
  };

  const promptToChangeRole = (id) => {
    setUserIdToDelete(id);
    setChangeRoleDialogOpen(true);
  };

  const executeRoleChange = async () => {
    if (!userIdToDelete || !selectedRole) return;

    try {
      await api.put("/ChangeUserRole", {
        appUserId: userIdToDelete,
        newRole: selectedRole,
      });
      toastSuccess("Role changed successfully");
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.appUserId === userIdToDelete) {
            user.role = selectedRole;
          }
          return user;
        });
      });
    } catch (error) {
      console.error(
        `Something went wrong: ${
          error.response?.data?.message || error.message
        }`
      );
      toastError("Something went wrong");
    } finally {
      setChangeRoleDialogOpen(false);
      setSelectedRole(null);
      setUserIdToDelete(null);
    }
  };

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
        bgImage={dashboardUsers}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review registered Users
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />
      <Box mb={4}>
        <Flex align="center" justify="space-between">
          <Input
            bgColor={"white"}
            placeholder="Search user by Id, email, username, or phone number..."
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
            <TableCaption>Registered Users</TableCaption>

            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>User Name</Th>
                <Th>Email</Th>
                <Th>Phone Number</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
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
              ) : users.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No users available</Td>
                </Tr>
              ) : (
                users.map((user, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>
                      <Tooltip label={user.appUserId} aria-label="A tooltip">
                        <span>{user.appUserId.substring(0, 8)}...</span>
                      </Tooltip>
                    </Td>
                    <Td>{user.userName}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phoneNumber}</Td>
                    <Td>{user.role}</Td>
                    <Td>
                      <Flex direction="row" spacing={2} gap={"8px"}>
                        {user.role !== "Master" && (
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
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
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
      </AlertDialog>
      <AlertDialog
        isOpen={isChangeRoleDialogOpen}
        onClose={() => setChangeRoleDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Role
            </AlertDialogHeader>
            <AlertDialogBody>
              <RadioGroup onChange={setSelectedRole} value={selectedRole}>
                <Stack direction="column">
                  <Radio value="Admin">Admin</Radio>
                  <Radio value="Master">Master</Radio>
                </Stack>
              </RadioGroup>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setChangeRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={executeRoleChange} ml={3}>
                Confirm
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
