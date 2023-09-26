import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Image,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube, BiMailSend } from "react-icons/fa"; // Import your icons
import { useNavigate } from "react-router-dom";
import useUser from "../../customhooks/useUser";
import compassLogo from "../../images/logoBgRemoved.png";
export const Footer = () => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const color = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { userId } = useUser();
  const navigate = useNavigate();
  return (
    <Box bg={bg} color={color} py={10}>
      {" "}
      <Container
        as={Stack}
        maxW={"6xl"}
        spacing={6}
        justify={"center"}
        align={"center"}
      >
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Text
              fontWeight={"700"}
              fontSize={"lg"}
              mb={4}
              onClick={() => navigate("/aboutus")}
              style={{ cursor: "pointer" }}
            >
              About Us
            </Text>
          </Stack>
          <Stack align={"flex-start"}>
            <Text
              fontWeight={"700"}
              fontSize={"lg"}
              mb={4}
              onClick={() => navigate(`/feedback/${userId}`)}
              style={{ cursor: "pointer" }}
            >
              Leave a Feedback
            </Text>
          </Stack>
          <Stack align={"flex-start"}>
            <Text
              fontWeight={"700"}
              fontSize={"lg"}
              mb={4}
              onClick={() => navigate("/contact")}
              style={{ cursor: "pointer" }}
            >
              Contact
            </Text>
          </Stack>
          {/* <Stack direction={"row"} spacing={6}>
            {" "}
            <IconButton
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
            />
          </Stack> */}
        </SimpleGrid>
        <Box
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={borderColor}
          pt={6}
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
            <Text>© 2023 Career Compass. All rights reserved</Text>
            <Image src={compassLogo} alt={"Compass Logo"} boxSize={"100px"} />
            <Stack direction={"row"} spacing={6}></Stack>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};
