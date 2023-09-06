import {
  Box,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import paymentsImg from "../../images/paymentsImg.png";
export function Payments() {
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
              {/* <Tbody>
              {isLoading ? (
                <Tr>
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
              ) : isError ? (
                <Tr>
                  <Td colSpan="6">An error occurred</Td>
                </Tr>
              ) : (
                applicants?.map((applicant, index) => (
                  <Tr key={index}>
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{applicant.firstName}</Td>
                    <Td>{applicant.lastName}</Td>
                    <Td>{applicant.jobTitle}</Td>
                    <Td>
                      <a href={applicant.Resume} download>
                        <FaDownload
                          size={"24px"}
                          style={{ cursor: "pointer" }}
                        />
                      </a>
                    </Td>
                    <Td>
                      <Flex>
                        {applicant.status === 1 ? (
                          <>
                            <IoCheckmarkSharp
                              color="green"
                              size={"24px"}
                              style={{ cursor: "pointer", marginRight: "10px" }}
                              onClick={() => {
                                setSelectedApplicationId(
                                  applicant.applicationid
                                );
                                onOpenCheck();
                              }}
                            />
                            <AcceptApplicantAlert
                              isOpen={isOpenCheck}
                              onClose={onCloseCheck}
                              applicationId={selectedApplicationId}
                            />
                            <IoCloseSharp
                              size={"24px"}
                              color="red"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedApplicationId(
                                  applicant.applicationid
                                );
                                onOpenClose();
                              }}
                            />
                            <RejectApplicantAlert
                              isOpen={isOpenClose}
                              onClose={onCloseClose}
                              applicationId={selectedApplicationId}
                            />
                          </>
                        ) : (
                          <span>{mapEnumToString(applicant.status)}</span>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody> */}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
