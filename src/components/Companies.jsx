import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useCombobox } from "downshift";
import workPlaceImg from "../images/workplace.png";
import { fetchCompanyDetails } from "../services/getCompanies";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
export function Companies() {
  const [companyItems, setCompanyItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
  const debouncedFetchCompanyDetails = debounce(async (input) => {
    if (input) {
      const results = await fetchCompanyDetails(input);
      setCompanyItems(results || []);
    } else {
      setCompanyItems([]);
    }
  }, 300);
  const handleSearch = async (selectedItem) => {
    if (selectedItem) {
      const details = await fetchCompanyDetails(selectedItem.companyName);
      setSelectedCompanyDetails(details);
      navigate(`?company=${encodeURIComponent(selectedItem.companyName)}`);
    }
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: companyItems || [],
    onSelectedItemChange: ({ selectedItem }) => {
      handleSearch(selectedItem);
    },
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue);
      debouncedFetchCompanyDetails(inputValue);
    },
    itemToString: (item) => (item ? item.companyName : ""),
  });
  console.log(selectedCompanyDetails);
  return (
    <>
      <Box
        rounded={"lg"}
        maxWidth={800}
        m="10px auto"
        borderRadius={"12px"}
        p={4}
        bg={"transparent"}
      >
        <Box
          borderWidth={"1px"}
          rounded={"lg"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgImage={workPlaceImg}
          bgPosition="right"
          position="relative"
        >
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Find great places to work
            </Heading>
          </Flex>
        </Box>

        <Box position="relative" mr="10px" w="100%">
          <Flex position="relative" alignItems="center">
            <Input
              {...getInputProps({
                border: "1px solid #ccc",
                w: "100%",
                h: "45px",
                borderTopRightRadius: "0",
                borderTopLeftRadius: "10px",
                borderBottomRightRadius: isOpen ? "0" : "0",
                borderBottomLeftRadius: isOpen ? "0" : "10px",
                borderColor: "#767676",
                fontSize: "14px",
                fontWeight: "400",
                color: "#2d2d2d",
                _hover: { borderColor: "#2557a7", outline: "none" },
                _focus: { borderColor: "#2557a7", outline: "none" },
                placeholder: "Enter Company Name",
              })}
              flex={1}
            />
            <Button
              h="45px"
              w="80px"
              borderTopLeftRadius="0"
              borderBottomLeftRadius="0"
              borderTopRightRadius="10px"
              borderBottomRightRadius="10px"
              colorScheme="blue"
            >
              Search
            </Button>
          </Flex>
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
              companyItems &&
              companyItems.map((item, index) => (
                <ListItem
                  key={item.id}
                  {...getItemProps({ item, index })}
                  padding="8px"
                  bgColor={highlightedIndex === index ? "blue.100" : "white"}
                >
                  {item.companyName}
                </ListItem>
              ))}
          </List>
        </Box>
        {selectedCompanyDetails && selectedCompanyDetails.length > 0 && (
          <Box mt={4}>
            {selectedCompanyDetails.map((company, index) => (
              <Box key={index} mt={4}>
                <Text>Name: {company.companyName}</Text>
                <Text>Location: {company.location}</Text>
                <Text>Description: {company.description}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
