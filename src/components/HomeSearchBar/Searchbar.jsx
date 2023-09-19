import {
  Box,
  Input,
  Button,
  Text,
  List,
  ListItem,
  Flex,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useCombobox } from "downshift";
import { useEffect, useState } from "react";
import useGetByLocation from "../../services/getByLocation";
import useGetByJobTitle from "../../services/getByJobTitle";
import { useVacancies } from "../../services/getVacancies";
import { Link, useNavigate } from "react-router-dom";
import { RecentSearches } from "./RecentSearches";
import { useDispatch, useSelector } from "react-redux";
import { addSearch } from "../../reducers/searchHistorySlice";
import useUser from "../../customhooks/useUser";

export function Searchbar() {
  const [searchResults, setSearchResults] = useState([]);
  const searchHistory = useSelector(
    (state) => state.searchHistory.searchHistory
  );

  const dispatch = useDispatch();
  const [locationInputValue, setLocationInputValue] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const { data: locations } = useGetByLocation(locationInputValue);
  const locationItems = locations || [];
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [jobTitleInputValue, setJobTitleInputValue] = useState("");
  const { data: jobTitles } = useGetByJobTitle(jobTitleInputValue);
  const jobTitleItems = jobTitles || [];
  const navigate = useNavigate();
  const toast = useToast();
  const { userId, isAuthenticated, userRole } = useUser();
  const linkTo =
    isAuthenticated && userRole === "JobSeeker"
      ? `/resumebuild/${userId}`
      : "/signin";
  const { data: vacancies } = useVacancies(
    jobTitleInputValue,
    selectedLocationId
  );
  const toggleRecentSearches = () => {
    setShowRecentSearches(!showRecentSearches);
  };
  const handleSearch = () => {
    setSearchResults(vacancies);
    dispatch(addSearch(`${jobTitleInputValue}  ${locationInputValue}`));

    const encodedJobTitle = jobTitleInputValue
      ? encodeURIComponent(jobTitleInputValue)
      : "";
    let encodedLocationId = selectedLocationId
      ? encodeURIComponent(selectedLocationId)
      : "";
    if (encodedLocationId === "null" || encodedLocationId === "") {
      encodedLocationId = "";
    }
    const queryString =
      `?jobTitle=${encodedJobTitle}` +
      (encodedLocationId ? `&locationId=${encodedLocationId}` : "");
    navigate(`/search${queryString}`);
  };

  const locationCombobox = useCombobox({
    items: locationItems,
    onInputValueChange: ({ inputValue }) => {
      setLocationInputValue(inputValue || "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedLocationId(selectedItem ? selectedItem.id : null);
    },
    itemToString: (item) => (item ? item.location : ""),
  });

  const jobTitleCombobox = useCombobox({
    items: jobTitleItems,
    onInputValueChange: ({ inputValue }) => {
      setJobTitleInputValue(inputValue || "");
    },
    itemToString: (item) => (item ? item.jobTitle : ""),
  });

  const inputWidth = useBreakpointValue({ base: "100%", md: "400px" });
  const buttonWidth = useBreakpointValue({ base: "100%", md: "auto" });
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });
  return (
    <>
      <Box
        display="flex"
        flexDirection={flexDirection}
        justifyContent="center"
        alignItems="center"
        pt="75px"
      >
        <Box
          position="relative"
          mr={{ base: "0", md: "10px" }}
          mt={{ base: "10px", md: "0" }}
        >
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
            {...jobTitleCombobox.getInputProps({
              pl: "70px",
              border: "1px solid #ccc",
              w: "400px",
              h: "45px",
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              borderBottomRightRadius: jobTitleCombobox.isOpen ? "0" : "10px",
              borderBottomLeftRadius: jobTitleCombobox.isOpen ? "0" : "10px",
              borderColor: "#767676",
              fontSize: "14px",
              fontWeight: "400",
              color: "#2d2d2d",
              _hover: { borderColor: "#2557a7", outline: "none" },
              _focus: { borderColor: "#2557a7", outline: "none" },
              placeholder: "Job title",
            })}
          />
          <List
            {...jobTitleCombobox.getMenuProps()}
            position="absolute"
            fontSize={"13px"}
            w="400px"
            _hover={"blue.200"}
            maxH="200px"
            overflowY="auto"
            border="1px solid #ccc"
            borderTop={jobTitleCombobox.isOpen ? "0" : "1px solid #ccc"}
            borderBottomLeftRadius="10px"
            borderBottomRightRadius="10px"
            bgColor="white"
            zIndex={2}
            listStyleType="none"
            padding="0"
            margin="0"
          >
            {jobTitleCombobox.isOpen &&
              jobTitleItems.map((item, index) => (
                <ListItem
                  key={item.id}
                  {...jobTitleCombobox.getItemProps({ item, index })}
                  padding="8px"
                  bgColor={
                    jobTitleCombobox.highlightedIndex === index
                      ? "blue.100"
                      : "white"
                  }
                >
                  {item.jobTitle}
                </ListItem>
              ))}
          </List>
        </Box>

        <Box
          position="relative"
          mr={{ base: "0", md: "10px" }}
          mt={{ base: "10px", md: "0" }}
        >
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
            {...locationCombobox.getInputProps({
              pl: "70px",
              border: "1px solid #ccc",
              w: "400px",
              h: "45px",
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              borderBottomRightRadius: locationCombobox.isOpen ? "0" : "10px",
              borderBottomLeftRadius: locationCombobox.isOpen ? "0" : "10px",
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
            {...locationCombobox.getMenuProps()}
            position="absolute"
            fontSize={"13px"}
            w="400px"
            _hover={"blue.200"}
            maxH="200px"
            overflowY="auto"
            border="1px solid #ccc"
            borderTop={locationCombobox.isOpen ? "0" : "1px solid #ccc"}
            borderBottomLeftRadius="10px"
            borderBottomRightRadius="10px"
            bgColor="white"
            zIndex={2}
            listStyleType="none"
            padding="0"
            margin="0"
          >
            {locationCombobox.isOpen &&
              locationItems.map((item, index) => (
                <ListItem
                  key={item.id}
                  {...locationCombobox.getItemProps({ item, index })}
                  padding="8px"
                  bgColor={
                    locationCombobox.highlightedIndex === index
                      ? "blue.100"
                      : "white"
                  }
                >
                  {item.location}
                </ListItem>
              ))}
          </List>
        </Box>
        <Button
          onClick={handleSearch}
          backgroundColor="#2557a7"
          color="white"
          padding="12px 20px"
          border="none"
          cursor="pointer"
          fontSize="14px"
          fontWeight="500"
          borderRadius="10px"
          w={buttonWidth}
          mt={{ base: "10px", md: "0" }}
        >
          Search
        </Button>
      </Box>
      <Box mt={4} textAlign="center">
        <Text>
          <Link
            to={linkTo}
            style={{
              marginRight: "20px",
              color: "#2557A7",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Build your resume
          </Link>
          - It only takes a few seconds
        </Text>
        <Text>
          Employers:{" "}
          <Link
            to="/employerscareercompass"
            style={{
              color: "#2557A7",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={(e) => {
              if (!isAuthenticated || userRole !== "Recruiter") {
                e.preventDefault();
                toast({
                  title: "You must be signed in as a recruiter",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            Post a job
          </Link>
        </Text>
      </Box>

      <Flex flexDirection="column" alignItems="center" pt="75px">
        <Text
          onClick={toggleRecentSearches}
          mb={4}
          cursor="pointer"
          textDecoration={showRecentSearches ? "underline" : "none"}
          color={showRecentSearches ? "blue.500" : "inherit"}
          transition="textDecoration 0.3s ease-in-out"
        >
          {showRecentSearches ? "Hide Recent Searches" : "Show Recent Searches"}
        </Text>

        {showRecentSearches && (
          <Box
            width="80%"
            p={4}
            borderRadius="md"
            boxShadow="md"
            backgroundColor="gray.100"
          >
            <Text fontWeight="bold" mb={2}>
              Recent Searches
            </Text>
            <RecentSearches searchHistory={searchHistory} />
          </Box>
        )}
      </Flex>
    </>
  );
}
