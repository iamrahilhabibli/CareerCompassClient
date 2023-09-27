import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";

export function Employers() {
  const { userId, token } = useUser();
  const [recruiterDetails, setRecruiterDetails] = useState(null);

  useEffect(() => {
    if (userId && token) {
      fetchRecruiterDetails(userId, token).then((details) => {
        setRecruiterDetails(details);
      });
    }
  }, [userId, token]);

  return (
    <Box p={8} bgGradient="linear(to-r, gray.100, gray.300)">
      <VStack spacing={6} align="stretch">
        {recruiterDetails ? (
          <>
            <Box
              p={6}
              rounded={"lg"}
              bg="white"
              shadow="md"
              borderWidth={"1px"}
              textAlign="center"
            >
              <Heading as="h1" size="2xl" color="blue.700">
                Welcome, {recruiterDetails.firstName.toUpperCase()}{" "}
                {recruiterDetails.lastName.toUpperCase()}
              </Heading>
              <Text mt={4} fontSize="lg">
                We are delighted to have you on board! Feel free to browse
                through the list of potential candidates and manage your job
                postings.
              </Text>
            </Box>
            <Box
              p={6}
              rounded={"lg"}
              bg="white"
              shadow="md"
              borderWidth={"1px"}
            >
              <Heading as="h2" size="lg" color="blue.700" mb={4}>
                How to Use This Dashboard
              </Heading>
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton
                    _hover={{
                      bg: "blue.200", // Background color on hover
                      color: "white", // Text color on hover
                    }}
                    _expanded={{
                      bg: "blue.400",
                      color: "white",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Step 1: Click Post a Job
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    p={4}
                    bg="gray.100" // Background color for the panel
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text>
                      You can also fill in the details to create a new job post.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton
                    _hover={{
                      bg: "blue.200",
                      color: "white",
                    }}
                    _expanded={{
                      bg: "blue.400",
                      color: "white",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Step 2: Browse Candidates
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    p={4}
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text>
                      Use the "Applicants" tab to browse through potential
                      hires.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton
                    _hover={{
                      bg: "blue.200",
                      color: "white",
                    }}
                    _expanded={{
                      bg: "blue.400",
                      color: "white",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Step 3: Browse Vacancies
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    p={4}
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text>
                      Use the "Jobs" tab to browse through your active
                      vacancies.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton
                    _hover={{
                      bg: "blue.200",
                      color: "white",
                    }}
                    _expanded={{
                      bg: "blue.400",
                      color: "white",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Step 4: Messages Section
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    p={4}
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text>
                      Use the "Messages" section to communicate with your
                      accepted applicants. You can send messages, schedule
                      interviews, and even have video calls to streamline the
                      hiring process.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton
                    _hover={{
                      bg: "blue.200",
                      color: "white",
                    }}
                    _expanded={{
                      bg: "blue.400",
                      color: "white",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Step 5: Planner Section
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    p={4}
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text>
                      Use the "Planner" section to manage tasks and plan your
                      activities. You can create, edit, and organize tasks, set
                      due dates, and keep track of your daily or project-related
                      activities.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton
                    _hover={{
                      bg: "blue.200",
                      color: "white",
                    }}
                    _expanded={{
                      bg: "blue.400",
                      color: "white",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Step 6: Update Company Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    p={4}
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text>
                      Click "Details" to update your company details and upload
                      a logo.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </>
        ) : (
          <Box p={6} rounded={"lg"} bg="white" shadow="md">
            <Spinner size="xl" color="blue.700" />
            <Text mt={4}>Loading...</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
