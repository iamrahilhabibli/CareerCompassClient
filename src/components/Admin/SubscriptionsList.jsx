import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import React from "react";
import subscriptionsImg from "../../images/subscriptionsImg.png";
import useUser from "../../customhooks/useUser";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
export default function SubscriptionsList() {
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useUser();
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetAllSubscriptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setSubscriptionsData(response.data);
      } catch (error) {
        console.log("There was an error fetching the data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptions();
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
        bgImage={subscriptionsImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review Subscriptions
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
            <TableCaption>
              Subscriptions: {subscriptionsData.length}
            </TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Post Limit</Th>
                <Th>Actions</Th>
                <Th>
                  <Button colorScheme="blue">Create new</Button>
                </Th>
              </Tr>
            </Thead>
            {/* <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a new type</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Job Type</FormLabel>
                    <Input
                      placeholder="Enter new job type "
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateJobType}
                  >
                    Create
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal> */}
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
              ) : subscriptionsData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No subscription available</Td>
                </Tr>
              ) : (
                subscriptionsData?.map((sub, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{sub.name}</Td>
                    <Td>{sub.price}</Td>
                    <Td>{sub.postLimit}</Td>
                    <Td>
                      <Flex
                        direction="row"
                        spacing={2}
                        gap={"8px"}
                        alignItems={"center"}
                      >
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          //   onClick={() => handleDeleteJobType(type.id)}
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          colorScheme="yellow"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          //   onClick={() => handleDeleteJobType(type.id)}
                        >
                          <EditIcon />
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
    </Box>
  );
}
