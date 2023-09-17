import React from "react";
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

export default function Aboutus() {
  const teamMembers = [
    {
      name: "Alice",
      surname: "Smith",
      position: "Developer",
      imgSrc: "path/to/image",
      description: "Alice loves coding in Python and JavaScript.",
    },
    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },
    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },

    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },
    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },

    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },

    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },
    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },

    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },

    {
      name: "Jane",
      surname: "Doe",
      position: "CTO",
      imgSrc: "path/to/img2.jpg",
    },
  ];
  const [flippedState, setFlippedState] = useState({});
  const toggleFlip = (index) => {
    setFlippedState({ ...flippedState, [index]: !flippedState[index] });
  };
  return (
    <Box p={8}>
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

        <Box
          rounded={"lg"}
          maxWidth={800}
          m="10px auto"
          borderRadius={"12px"}
          p={5}
          bg={"transparent"}
          borderWidth={"1px"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
        >
          <Heading as="h2" size="xl">
            Our Team
          </Heading>
          <Text mt={4}>
            Meet our dedicated team members who make everything possible.
          </Text>
          <SimpleGrid columns={3} spacing={10} mt={6}>
            {teamMembers.map((member, index) => (
              <Box
                key={index}
                onClick={() => toggleFlip(index)}
                className={`${styles.flipCard} ${
                  flippedState[index] ? styles.flipped : ""
                }`}
              >
                <Box className={styles.flipCardInner}>
                  <Box className={styles.flipCardFront}>
                    <Image
                      boxSize="100px"
                      objectFit="cover"
                      src={member.imgSrc}
                      alt={`${member.name} ${member.surname}`}
                      mb={3}
                    />
                    <Text fontWeight="bold">
                      {member.name} {member.surname}
                    </Text>
                    <Text mt={2}>{member.position}</Text>
                  </Box>
                  <Box className={styles.flipCardBack}>
                    <Text mt={5}>{member.description}</Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          <Text mt={6} textAlign="center">
            Do you believe you have what it takes to be part of our team?{" "}
            <Text as="span" fontWeight="bold">
              Message us!
            </Text>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
