import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
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
import React, { useEffect, useState } from "react";
import paymentsImg from "../../images/paymentsDashboardImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
export default function PaymentsList() {
  const [paymentsData, setPaymentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useUser();
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Dashboards/GetAllPayments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaymentsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("There was an error fetching the data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
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
        bgImage={paymentsImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Review Payments
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
            <TableCaption>Payments: {paymentsData.length}</TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Payer ID</Th>
                <Th>Payment Type</Th>
                <Th>Amount</Th>
                <Th>Date</Th>
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
              ) : paymentsData.length === 0 ? (
                <Tr fontSize="sm">
                  <Td colSpan="6">No payments available</Td>
                </Tr>
              ) : (
                paymentsData?.map((payment, index) => (
                  <Tr key={index} fontSize="sm">
                    <Td>{payment.paymentId}</Td>
                    <Td>{payment.payersId}</Td>
                    <Td>{payment.paymentType}</Td>
                    <Td>{payment.paymentAmount}</Td>
                    <Td>{payment.dateCreated}</Td>
                    {/* <Td>
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
                    </Td> */}
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
