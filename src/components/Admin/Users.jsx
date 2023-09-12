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
} from "@chakra-ui/react";
import axios from "axios";
import useUser from "../../customhooks/useUser";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isChangeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { userId, token, userRole } = useUser();
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/GetAllUsers");
        setUsers(data);
      } catch (error) {
        console.error(
          `Error fetching data: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
    </Box>
  );
}
