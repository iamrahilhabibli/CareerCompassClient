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
  Spinner,
  IconButton,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import paymentsImg from "../../images/paymentsImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
export function Payments() {
  const [payments, setPayments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const maxPage = Math.ceil(totalItems / itemsPerPage);
  const { userId } = useUser();

  const downloadPDF = async () => {
    const table = document.getElementById("my-table");
    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("transaction_history.pdf");
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://localhost:7013/api/Payments/GetPayments/${userId}?currentPage=${currentPage}&pageSize=${itemsPerPage}`
        );
        if (response.data && response.data.items) {
          setPayments(response.data.items);
          setTotalItems(response.data.totalItems || 0);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, currentPage]);
  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
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
            <Table variant="simple" id="my-table">
              <TableCaption>Payments</TableCaption>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Amount</Th>
                  <Th>Type</Th>
                  <Th>Date</Th>
                  <Th>
                    Export
                    <IconButton
                      aria-label="Download PDF"
                      icon={<DownloadIcon />}
                      size="xs"
                      onClick={downloadPDF}
                      ml={2}
                    />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td>
                      <Flex justify="center" align="center">
                        <Spinner />
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
                  payments?.map((payment, index) => {
                    const dateObject = new Date(payment.date);
                    const formattedDate = `${dateObject
                      .getDate()
                      .toString()
                      .padStart(2, "0")}-${(dateObject.getMonth() + 1)
                      .toString()
                      .padStart(
                        2,
                        "0"
                      )}-${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;

                    return (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{payment.amount}</Td>
                        <Td>{payment.paymentType}</Td>
                        <Td>{formattedDate}</Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            colorScheme="blue"
            onClick={handlePrevious}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text fontSize="xl">
            Page {currentPage} of {maxPage}
          </Text>
          <Button
            colorScheme="blue"
            onClick={handleNext}
            isDisabled={currentPage >= maxPage}
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
}
