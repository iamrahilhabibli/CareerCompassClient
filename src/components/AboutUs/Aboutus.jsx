import React, { useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  VStack,
} from "@chakra-ui/react";
import styles from "./Aboutus.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Aboutus() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);

  const [flippedState, setFlippedState] = useState({});

  useEffect(() => {
    axios
      .get("https://localhost:7013/api/TeamMembers/GetMembers")
      .then((response) => {
        console.log(response.data);
        setTeamMembers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching team members: ", error);
      });
  }, []);
  const toggleFlip = (index) => {
    setFlippedState({ ...flippedState, [index]: !flippedState[index] });
  };
  console.log(teamMembers);
  return (
    <Box p={8}>
      <Box
        rounded={"lg"}
        maxWidth={800}
        m="20px auto"
        borderRadius={"15px"}
        p={6}
        bg={"gradient(to-r, blue.800, gray.600)"}
        borderWidth={"1px"}
        shadow="0px 5px 10px rgba(0,0,0,0.2)"
      >
        <Heading as="h2" size="2xl" color="teal.500" fontWeight="bold">
          Our Team
        </Heading>
        <Text mt={4} color="gray.600">
          Meet our dedicated team members who make everything possible.
        </Text>
        <SimpleGrid columns={3} spacing={10} mt={6}>
          {teamMembers.map((member, index) => (
            <Box
              key={member.memberId}
              onClick={() => toggleFlip(index)}
              className={`${styles.flipCard} ${
                flippedState[index] ? styles.flipped : ""
              }`}
              borderRadius="md"
              boxShadow="lg"
              bg="white"
              overflow="hidden"
              borderWidth={1}
              borderColor="gray.300"
              height="300px"
            >
              <Box className={styles.flipCardInner}>
                <Box className={styles.flipCardFront}>
                  <Image
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius={"50%"}
                    src={member.imageUrl}
                    alt={`${member.firstName} ${member.lastName}`}
                    m={(0, 2)}
                    mx="auto"
                    display="block"
                  />
                  <Text fontWeight="bold" textAlign="center">
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text
                    mt={2}
                    color="teal.500"
                    fontWeight="medium"
                    textAlign="center"
                  >
                    {member.position}
                  </Text>
                </Box>
                <Box className={styles.flipCardBack}>
                  <Text fontSize={"13px"} mt={5} textAlign="center">
                    {member.description}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <Text mt={6} textAlign="center" fontWeight="medium" color="gray.700">
          Do you believe you have what it takes to be part of our team?{" "}
          <Text
            onClick={() => navigate("/contact")}
            cursor={"pointer"}
            _hover={{ textDecoration: "underline" }}
            as="span"
            fontWeight="bold"
            color="teal.600"
          >
            Message us!
          </Text>
        </Text>
      </Box>

      <VStack spacing={6}>
        <Box
          rounded={"lg"}
          maxWidth={800}
          m="10px auto"
          borderRadius={"12px"}
          p={4}
          bg={"transparent"}
          borderWidth={"1px"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
        >
          <Heading as="h2" size="xl">
            Our Mission
          </Heading>
          <Text mt={4}>
            Welcome to our platform, where our mission is more than just words;
            it's our driving force. At Career Compass, we are on a quest to
            bridge the gap between talent and opportunity, weaving a tapestry of
            success stories along the way.
          </Text>
          <br />
          <Heading as="h4" size="md">
            Unlocking Potential
          </Heading>
          <Text mt={4}>
            We believe that every individual possesses unique talents and
            potential waiting to be unlocked. Our mission is to empower these
            talents, providing a platform where they can shine and grow.
          </Text>
          <br />
          <Heading as="h4" size="md">
            Creating Synergy
          </Heading>
          <Text mt={4}>
            In a world where opportunities are abundant yet often elusive, we
            serve as the catalyst for synergy. We connect passionate, skilled
            individuals with the organizations and roles that need their
            expertise.
          </Text>
          <br />
          <Heading as="h4" size="md">
            Join Us
          </Heading>
          <Text mt={4}>
            Join us in this mission to unite talents with opportunities.
            Together, we will create a world where individuals flourish,
            organizations thrive, and dreams become reality. Thank you for being
            a part of the Career Compass community. Together, we will shape a
            brighter future.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
