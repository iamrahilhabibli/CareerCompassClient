import { Box, Input, Button, Text, List, ListItem } from "@chakra-ui/react";
import { useCombobox } from "downshift";
import { useState } from "react";
import useGetByLocation from "../../services/getByLocation";

export function Searchbar() {
  const [inputValue, setInputValue] = useState("");
  const { data: locations } = useGetByLocation(inputValue);
  const items = locations || [];

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || "");
    },
    itemToString: (item) => (item ? item.location : ""),
  });

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
          {...getInputProps({
            pl: "70px",
            border: "1px solid #ccc",
            w: "400px",
            h: "45px",
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
            borderBottomRightRadius: isOpen ? "0" : "10px",
            borderBottomLeftRadius: isOpen ? "0" : "10px",
            borderColor: "#767676",
            fontSize: "14px",
            fontWeight: "400",
            color: "#2d2d2d",
            _hover: { borderColor: "#2557a7", outline: "none" },
            _focus: { borderColor: "#2557a7", outline: "none" },
            placeholder: "City,Country",
          })}
        />
        <List
          {...getMenuProps()}
          position="absolute"
          fontSize={"13px"}
          w="400px"
          _hover={"blue.200"}
          maxH="200px"
          overflowY="auto"
          border="1px solid #ccc"
          borderTop={isOpen ? "0" : "1px solid #ccc"}
          borderBottomLeftRadius="10px"
          borderBottomRightRadius="10px"
          bgColor="white"
          zIndex={2}
          listStyleType="none"
          padding="0"
          margin="0"
        >
          {isOpen &&
            items.map((item, index) => (
              <ListItem
                key={item.id}
                {...getItemProps({ item, index })}
                padding="8px"
                bgColor={highlightedIndex === index ? "blue.100" : "white"}
              >
                {item.location}
              </ListItem>
            ))}
        </List>
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
