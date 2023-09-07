import {
  Box,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useCombobox } from "downshift";
import workPlaceImg from "../images/workplace.png";
export function Companies() {
  const companyItems = [
    { id: "1", companyName: "Apple" },
    { id: "2", companyName: "Google" },
    { id: "3", companyName: "Microsoft" },
  ];
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: companyItems,
    onSelectedItemChange: ({ selectedItem }) => {
      console.log(selectedItem);
    },
  });
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
            Company
          </Text>
          <Input
            {...getInputProps({
              pl: "70px",
              placeholder: "Search for a company",
            })}
          />
          <List {...getMenuProps()}>
            {isOpen &&
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
      </Box>
    </>
  );
}
