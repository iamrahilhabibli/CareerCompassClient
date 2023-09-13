import React from "react";
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

export const Testimonial = (props) => {
  return <Box>{props.children}</Box>;
};

export const TestimonialContent = (props) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
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
  const mockData = [
    {
      name: "John Doe",
      title: "Software Developer",
      text: "This company is amazing! They transformed my business.",
      imgSrc: "path/to/image1.jpg",
    },
    {
      name: "Jane Doe",
      title: "Product Manager",
      text: "Highly recommend them for any of your business needs.",
      imgSrc: "path/to/image2.jpg",
    },
    {
      name: "Jane Doe",
      title: "Product Manager",
      text: "Highly recommend them for any of your business needs.",
      imgSrc: "path/to/image2.jpg",
    },
  ];

  return (
    <Box bg={useColorModeValue("blue.100", "blue.250")}>
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
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          {mockData.map((data, index) => (
            <Testimonial key={index}>
              <TestimonialContent>
                <TestimonialHeading>{data.name}</TestimonialHeading>
                <TestimonialText>{data.text}</TestimonialText>
                <TestimonialAvatar
                  src={data.imgSrc}
                  name={data.name}
                  title={data.title}
                />
              </TestimonialContent>
            </Testimonial>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
