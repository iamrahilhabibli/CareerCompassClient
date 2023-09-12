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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import dasboardUsers from "../../images/dashboardUsers.png";
import axios from "axios";
import useUser from "../../customhooks/useUser";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, token, userRole } = useUser();
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const toast = useToast();
  useEffect(() => {
    const fetchUsers = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetAllUsers",
          config
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const promptDeleteUser = (id) => {
    setUserIdToDelete(id);
    setAlertDialogOpen(true);
  };

  const executeDeleteUser = async () => {
    if (!userIdToDelete) return;
    try {
      await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveUser?appUserId=${userIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "User deleted successfully",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
      setUsers(users.filter((user) => user.appUserId !== userIdToDelete));
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setUserIdToDelete(null);
      setAlertDialogOpen(false);
    }
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
        bgImage={dasboardUsers}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review your Users
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
            <TableCaption>Job Posts</TableCaption>
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
                            // onClick={() => handleMakeAdmin(user.appUserId)}
                          >
                            Admin
                          </Button>
                        )}
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          onClick={() => promptDeleteUser(user.appUserId)}
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
              <Button colorScheme="red" onClick={executeDeleteUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
