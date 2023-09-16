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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            lacinia malesuada mi vitae tristique. Donec fringilla ullamcorper
            nulla sed gravida. Duis fermentum, sapien et.
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
