import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

export const Testimonial = (props) => {
  return (
    <Flex
      w={"full"}
      maxW={"350px"}
      mx={"auto"}
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {props.children}
    </Flex>
  );
};

export const TestimonialContent = (props) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      borderRadius={"md"}
      p={8}
      w={"full"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {props.children}
    </Stack>
  );
};

const TestimonialHeading = (props) => {
  return (
    <Heading as={"h3"} fontSize={"xl"}>
      {props.children}
    </Heading>
  );
};

const TestimonialText = (props) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
    >
      {props.children}
    </Text>
  );
};

const TestimonialAvatar = (props) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar src={props.src} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text fontWeight={600}>{props.name}</Text>
        <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.400")}>
          {props.title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function WithSpeechBubbles() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    axios
      .get("https://localhost:7013/api/Feedbacks/GetTestimonials")
      .then((response) => {
        setTestimonials(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the testimonials:", error);
      });
  }, []);
  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-b, gray.100, gray.300)",
        "linear(to-b, gray.100, black)"
      )}
    >
      <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
        <Stack spacing={4} align={"center"}>
          <Box
            borderBottom="2px"
            borderBottomColor="gray.300"
            width="fit-content"
          >
            <Heading
              as={"h1"}
              fontSize={["xl", "2xl"]}
              textTransform="uppercase"
              fontWeight="bold"
              color={"#2557A7"}
            >
              Our Clients Speak
            </Heading>
          </Box>
          <Text
            as={"p"}
            fontSize={["md", "lg"]}
            fontStyle="italic"
            textAlign="center"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            We Have Been Assisting Jobseekers in Securing Their Dream Jobs
            Globally
          </Text>
        </Stack>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          {testimonials.map((data, index) => (
            <Testimonial key={index}>
              <TestimonialContent>
                <TestimonialHeading>
                  {data.firstName} {data.lastName}
                </TestimonialHeading>
                <TestimonialText>{data.feedback}</TestimonialText>
                <TestimonialAvatar
                  src={data.imageUrl}
                  name={`${data.firstName} ${data.lastName}`}
                  title={data.jobTitle}
                />
              </TestimonialContent>
            </Testimonial>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}
