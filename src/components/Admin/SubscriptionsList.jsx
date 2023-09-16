import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import subscriptionsImg from "../../images/subscriptionsImg.png";
import useUser from "../../customhooks/useUser";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
export default function SubscriptionsList() {
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useUser();
  const [subscriptionPlanName, setSubscriptionPlanName] = useState("");
  const [subscriptionPlanPrice, setSubscriptionPlanPrice] = useState(0.0);
  const [subscriptionPlanPostCount, setSubscriptionPlanPostCount] = useState(0);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      price: "",
      postLimit: "",
    },
    onSubmit: async (values) => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        "https://localhost:7013/api/Dashboards/UpdateSubscription",
        values,
        config
      );

      if (response.status === 200) {
        toastSuccess("Successfully updated");
        setModalOpen(false);
        const index = subscriptionsData.findIndex(
          (sub) => sub.id === values.id
        );

        if (index !== -1) {
          const updatedSubscriptions = [...subscriptionsData];
          updatedSubscriptions[index] = {
            ...updatedSubscriptions[index],
            ...values,
          };
          setSubscriptionsData(updatedSubscriptions);
        }
      }
    },
  });

  const handleEditIconClick = (sub) => {
    setEditingSubscription(sub);
    formik.setValues({
      id: sub.id,
      name: sub.name,
      price: sub.price,
      postLimit: sub.postLimit,
    });
    setModalOpen(true);
  };

  const onClose = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const toast = useToast();
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
  const handleCreateSubscription = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Dashboards/CreateSubscription",
        {
          Name: subscriptionPlanName,
          Price: subscriptionPlanPrice,
          PostLimit: subscriptionPlanPostCount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;
        toastSuccess("Successfully created");
        setSubscriptionsData((subs) => [
          ...subs,
          {
            id: newId,
            name: subscriptionPlanName,
            price: subscriptionPlanPrice,
            postLimit: subscriptionPlanPostCount,
          },
        ]);
        onClose();
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };
  const handleDeleteSubscription = async (subscriptionId) => {
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveSubscription?subscriptionId=${subscriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setSubscriptionsData((prevLevels) =>
          prevLevels.filter((sub) => sub.id !== subscriptionId)
        );
      }
      toastSuccess("Deleted successfully");
    } catch (error) {
      toastError("Something went wrong");
    }
  };

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
                  <Button colorScheme="blue" onClick={openModal}>
                    Create new
                  </Button>
                </Th>
              </Tr>
            </Thead>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a new subscription plan</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Plan Name</FormLabel>
                    <Input
                      placeholder="Enter new subscription name "
                      value={subscriptionPlanName}
                      onChange={(e) => setSubscriptionPlanName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <NumberInput
                      precision={2}
                      step={0.01}
                      value={subscriptionPlanPrice}
                      onChange={(value) => setSubscriptionPlanPrice(value)}
                    >
                      <NumberInputField placeholder="Enter  price" />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Post count</FormLabel>
                    <NumberInput
                      value={subscriptionPlanPostCount}
                      onChange={(value) => setSubscriptionPlanPostCount(value)}
                    >
                      <NumberInputField placeholder="Enter post limit" />
                    </NumberInput>
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleCreateSubscription}
                  >
                    Create
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
                          onClick={() => handleDeleteSubscription(sub.id)}
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          colorScheme="yellow"
                          variant="outline"
                          size="xs"
                          borderRadius="full"
                          onClick={() => handleEditIconClick(sub)}
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
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Subscription</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={formik.handleSubmit}>
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <FormControl id="price" mt={4}>
                  <FormLabel>Price</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <FormControl id="postLimit" mt={4}>
                  <FormLabel>Post Limit</FormLabel>
                  <Input
                    name="postLimit"
                    type="number"
                    value={formik.values.postLimit}
                    onChange={formik.handleChange}
                  />
                </FormControl>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={formik.handleSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
