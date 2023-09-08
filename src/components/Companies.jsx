import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Image,
  List,
  ListItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCombobox } from "downshift";
import workPlaceImg from "../images/workplace.png";
import { fetchCompanyDetails } from "../services/getCompanies";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import useUser from "../customhooks/useUser";
import axios from "axios";

export function Companies() {
  const { userId } = useUser();
  const [followingCompanies, setFollowingCompanies] = useState([]);
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [companyItems, setCompanyItems] = useState([]);
  const toast = useToast();
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
    } else {
      setSelectedCompanyDetails(null);
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
  const followCompany = async (companyId, userId) => {
    try {
      const followCreateDto = {
        appUserId: userId,
        companyId: companyId,
      };

      const response = await axios.post(
        "https://localhost:7013/api/Followers/Follow",
        followCreateDto
      );

      if (response.status === 200) {
        toast({
          title: "Successfully followed!",
          description:
            "You will be notified of any posts and updates by the company.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFollowingCompanies([...followingCompanies, companyId]);
      }
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const unFollowCompany = async (companyId, userId) => {
    try {
      const followRemoveDto = {
        appUserId: userId,
        companyId: companyId,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        data: followRemoveDto,
      };

      const response = await axios.delete(
        "https://localhost:7013/api/Followers/Unfollow",
        config
      );

      if (response.status === 200) {
        toast({
          title: "Successfully Unfollowed!",
          description:
            "You will be no longer be notified of any posts and updates by the company.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        const updatedFollowingCompanies = followingCompanies.filter(
          (id) => id !== companyId
        );
        setFollowingCompanies(updatedFollowingCompanies);
      }
    } catch (error) {
      console.error("Error details:", error);

      toast({
        title: "Something went wrong!",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const getFollowedCompanies = async (userId) => {
    try {
      const url = `https://localhost:7013/api/Followers/GetFollowedCompanies?appUserId=${userId}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data.map((company) => company.companyId);
      }
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    const fetchFollowedCompanies = async () => {
      const followedCompanyIds = await getFollowedCompanies(userId);
      if (followedCompanyIds) {
        setFollowingCompanies(followedCompanyIds);
      }
    };
    if (userId) {
      fetchFollowedCompanies();
    }
  }, [userId]);
  const isFollowing = (companyId) => followingCompanies.includes(companyId);
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
              w="max-content"
              borderTopLeftRadius="0"
              borderBottomLeftRadius="0"
              borderTopRightRadius="10px"
              borderBottomRightRadius="10px"
              bgColor={"#2557a7"}
              color={"white"}
            >
              Find Companies
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
              <React.Fragment key={index}>
                <Box
                  mt={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="8px"
                      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
                      src={company.logoUrl}
                      alt={`${company.companyName} logo`}
                      mr={4}
                      cursor={"pointer"}
                    />
                    <Box>
                      <Text
                        fontSize={"16px"}
                        color={"#2557a7"}
                        fontWeight={"700"}
                        _hover={{ textDecoration: "underline" }}
                        cursor={"pointer"}
                      >
                        {company.companyName}
                      </Text>
                      <Text fontSize={"12px"}>{company.industryName}</Text>
                    </Box>
                  </Box>
                  <Box>
                    <Button mr={2} colorScheme="blue">
                      Write a review
                    </Button>
                    <Button mr={2} colorScheme="green">
                      See All Reviews
                    </Button>
                    <Button
                      colorScheme={
                        isFollowing(company.companyId) ? "red" : "teal"
                      }
                      onClick={() =>
                        isFollowing(company.companyId)
                          ? unFollowCompany(company.companyId, userId)
                          : followCompany(company.companyId, userId)
                      }
                    >
                      {isFollowing(company.companyId) ? "Unfollow" : "Follow"}
                    </Button>
                  </Box>
                </Box>
                {index < selectedCompanyDetails.length - 1 && (
                  <Divider mt={4} />
                )}
              </React.Fragment>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
