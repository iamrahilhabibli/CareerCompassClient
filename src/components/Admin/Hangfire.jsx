import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import backgroundCleaningImg from "../../images/backgroundCleaningImg.png";
import hangfireImg from "../../images/hangfireImg.png";
export default function Hangfire() {
  const [daysToDeleteOldMessages, setDaysToDeleteOldMessages] = useState(null);
  const [daysToDeleteOldNotifications, setDaysToDeleteOldNotifications] =
    useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsData, setSettingsData] = useState([]);
  const [newSettingValue, setNewSettingValue] = useState("");

  const { token } = useUser();
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
  const handleEditClick = (setting) => {
    setSelectedSetting(setting);
    onOpen();
  };
  const handleUpdateSetting = async () => {
    if (selectedSetting) {
      try {
        const updatePayload = {
          settingId: selectedSetting.settingId,
          settingValue: newSettingValue,
        };

        await axios.put(
          "https://localhost:7013/api/AppSettings/UpdateValue",
          updatePayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedSettings = settingsData.map((setting) => {
          if (setting.settingId === selectedSetting.settingId) {
            return { ...setting, settingValue: newSettingValue };
          }
          return setting;
        });

        setSettingsData(updatedSettings);

        toastSuccess("Setting updated successfully");
      } catch (error) {
        toastError("Failed to update setting");
      }
    }
    onClose();
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetSettings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSettingsData(response.data);
      } catch (error) {
        toastError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);
  return (
    <Box width="100%" p={4}>
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        height={"200px"}
        bg={"white"}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgImage={hangfireImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Background Jobs Dashboard
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
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Setting Name</Th>
                <Th>Setting Value</Th>
              </Tr>
            </Thead>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update Setting</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>{selectedSetting?.settingName}</FormLabel>
                    <Input
                      placeholder="Enter new setting value"
                      value={newSettingValue}
                      onChange={(e) => setNewSettingValue(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleUpdateSetting}
                  >
                    Confirm
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

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
                ) : settingsData.length === 0 ? (
                  <Tr fontSize="sm">
                    <Td colSpan="6">No Settings available</Td>
                  </Tr>
                ) : (
                  settingsData.map((setting, index) => (
                    <Tr key={index} fontSize="sm">
                      <Td isNumeric>{index + 1}</Td>
                      <Td>{setting.settingName}</Td>
                      <Td>{setting.settingValue}</Td>
                      <Td>
                        <Flex
                          direction="row"
                          spacing={2}
                          gap={"8px"}
                          alignItems={"center"}
                        >
                          <Button
                            colorScheme="yellow"
                            variant="outline"
                            size="xs"
                            borderRadius="full"
                            onClick={() => handleEditClick(setting)}
                          >
                            <EditIcon />
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
      <Box mt={5}></Box>
      <Box
        as="iframe"
        src="https://localhost:7013/hangfire"
        width="100%"
        height="800px"
        title="Hangfire Dashboard"
        borderRadius="md"
        boxShadow="md"
      ></Box>
    </Box>
  );
}
