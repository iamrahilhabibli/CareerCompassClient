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
import React, { useState } from "react";
import shiftsImg from "../../images/ShiftsImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { useEffect } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function ShiftAndSchedules() {
  const [shiftAndScheduleData, setShiftAndScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useUser();
  const onClose = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newShiftName, setNewShiftName] = useState("");
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
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetAllShifts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShiftAndScheduleData(response.data);
      } catch (error) {
        console.log("There was an error fetching the data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShifts();
  }, []);
  const handleCreateShift = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7013/api/Dashboards/CreateShift",
        {
          shiftName: newShiftName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const newId = response.data;
        toastSuccess("Successfully created");
        setShiftAndScheduleData((prevLevels) => [
          ...prevLevels,
          { id: newId, shiftName: newShiftName },
        ]);
        onClose();
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };
  const handleDeleteShift = async (shiftId) => {
    console.log(shiftId);
    try {
      const response = await axios.delete(
        `https://localhost:7013/api/Dashboards/RemoveShift?shiftId=${shiftId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setShiftAndScheduleData((prevLevels) =>
          prevLevels.filter((shift) => shift.id !== shiftId)
        );
      }
      toastSuccess("Deleted successfully");
    } catch (error) {
      toastError("Something went wrong");
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
        bgImage={shiftsImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review Shifts & Schedules
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
            <TableCaption>Shifts: {shiftAndScheduleData.length}</TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Shift Name</Th>
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
                <ModalHeader>Create a new shift</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Shift & Schedule</FormLabel>
                    <Input
                      placeholder="Enter new shift name "
                      value={newShiftName}
                      onChange={(e) => setNewShiftName(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleCreateShift}>
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
              ) : shiftAndScheduleData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No shifts available</Td>
                </Tr>
              ) : (
                shiftAndScheduleData?.map((shift, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{shift.shiftName}</Td>
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
                          onClick={() => handleDeleteShift(shift.id)}
                        >
                          <DeleteIcon />
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
