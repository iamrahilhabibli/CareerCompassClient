import { Box, Input, Button, Text } from "@chakra-ui/react";

export function Searchbar() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" pt="75px">
      <Box position="relative" mr="10px">
        <Text
          position="absolute"
          fontWeight="700"
          fontSize="14px"
          lineHeight="14px"
          color="#2d2d2d"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
        >
          What
        </Text>
        <Input
          pl="70px"
          border="1px solid #ccc"
          w="400px"
          h="45px"
          borderRadius="10px"
          borderColor="#767676"
          fontSize="14px"
          fontWeight="400"
          color="#2d2d2d"
          _hover={{ borderColor: "#2557a7", outline: "none" }}
          _focus={{ borderColor: "#2557a7", outline: "none" }}
          placeholder="Job title or company name"
        />
      </Box>
      <Box position="relative" mr="10px">
        <Text
          position="absolute"
          fontWeight="700"
          fontSize="14px"
          lineHeight="14px"
          color="#2d2d2d"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
        >
          Where
        </Text>
        <Input
          pl="70px"
          border="1px solid #ccc"
          w="400px"
          h="45px"
          borderRadius="10px"
          borderColor="#767676"
          fontSize="14px"
          fontWeight="400"
          color="#2d2d2d"
          _hover={{ borderColor: "#2557a7", outline: "none" }}
          _focus={{ borderColor: "#2557a7", outline: "none" }}
          placeholder="City"
        />
      </Box>
      <Button
        backgroundColor="#2557a7"
        color="white"
        padding="12px 20px"
        border="none"
        cursor="pointer"
        fontSize="14px"
        fontWeight="500"
        borderRadius="10px"
      >
        Search
      </Button>
    </Box>
  );
}
