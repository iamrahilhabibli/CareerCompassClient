import { Box, List, ListItem, Text, Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { removeSearch } from "../../reducers/searchHistorySlice";
import { FaTimes } from "react-icons/fa";
export function RecentSearches({ searchHistory }) {
  const dispatch = useDispatch();

  const deleteSearch = (index) => {
    const updatedSearchHistory = [...searchHistory];
    updatedSearchHistory.splice(index, 1);
    dispatch(removeSearch(updatedSearchHistory));
  };

  return (
    <Box mt="20px">
      <List spacing={3}>
        {searchHistory.map((search, index) => (
          <ListItem key={index} display="flex" alignItems="center">
            {search}
            <Button
              onClick={() => deleteSearch(index)}
              size="sm"
              ml="10px"
              colorScheme="gray"
            >
              <FaTimes />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
