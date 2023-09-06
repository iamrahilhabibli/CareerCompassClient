import {
  Box,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import React from "react";
import paymentsImg from "../../images/paymentsImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
export function Payments() {
  const [payments, setPayments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://localhost:7013/api/Payments/GetPayments/${userId}`
        );
        setPayments(response.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [userId]);
  return (
    <>
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
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgRepeat="no-repeat"
          bgImage={paymentsImg}
          bgSize="auto 100%"
          bgPosition="right"
          position="relative"
        >
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Payments
            </Heading>
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
              <TableCaption>Payments</TableCaption>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Amount</Th>
                  <Th>Type</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td>
                      <Flex justify="center" align="center">
                        <Text>Loading...</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ) : isError ? (
                  <Tr>
                    <Td>
                      <Flex justify="center" align="center">
                        <Text color="red.500">Error fetching payments</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ) : (
                  payments?.map((payment, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{payment.amount}</Td>
                      <Td>{payment.paymentType}</Td>
                      <Td>{payment.date}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
