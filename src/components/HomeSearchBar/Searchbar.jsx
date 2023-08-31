import { Box, Input, Button, Text, List, ListItem } from "@chakra-ui/react";
import { useCombobox } from "downshift";
import { useEffect, useState } from "react";
import useGetByLocation from "../../services/getByLocation";
import useGetByJobTitle from "../../services/getByJobTitle";
import { useVacancies } from "../../services/getVacancies";
import { useNavigate } from "react-router-dom";
import { RecentSearches } from "./RecentSearches";
import { useDispatch, useSelector } from "react-redux";
import { addSearch } from "../../reducers/searchHistorySlice";

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
  return (
    <>
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
              placeholder: "Job title or Company name",
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
        >
          Search
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" pt="75px">
        <Button onClick={toggleRecentSearches}>
          {showRecentSearches ? "Hide Recent Searches" : "Show Recent Searches"}
        </Button>
        {showRecentSearches && <RecentSearches searchHistory={searchHistory} />}
      </Box>
    </>
  );
}
