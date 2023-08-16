import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
// import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
// import { BiMailSend } from "react-icons/bi";

export const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              About Us
            </Text>
            {/* Put your content here for "About Us" section */}
          </Stack>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Products
            </Text>
            {/* Put your content here for "Products" section */}
          </Stack>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Useful Links
            </Text>
            {/* Put your content here for "Useful Links" section */}
          </Stack>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Contact
            </Text>
            <Stack direction={"row"} spacing={1}>
              {/* <IconButton
                as={"a"}
                href={"#"}
                aria-label={"Instagram"}
                icon={<FaInstagram fontSize={"20px"} />}
                variant={"ghost"}
              />
              <IconButton
                as={"a"}
                href={"#"}
                aria-label={"Twitter"}
                icon={<FaTwitter fontSize={"20px"} />}
                variant={"ghost"}
              />
              <IconButton
                as={"a"}
                href={"#"}
                aria-label={"YouTube"}
                icon={<FaYoutube fontSize={"20px"} />}
                variant={"ghost"}
              /> */}
              {/* <IconButton
                as={"a"}
                href={"#"}
                aria-label={"Email"}
                icon={<BiMailSend fontSize={"20px"} />}
                variant={"ghost"}
              /> */}
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text>© 2023 Brand. All rights reserved</Text>
          <Stack direction={"row"} spacing={6}>
            {/* Insert any additional links if you have here */}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
