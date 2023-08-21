import { Box, List, ListItem, Text } from "@chakra-ui/react";

export function RecentSearches({ searchHistory }) {
  console.log(searchHistory);
  return (
    <Box mt="20px">
      <Text fontWeight="600">Recent Searches:</Text>
      <List spacing={3}>
        {searchHistory.map((search, index) => (
          <ListItem key={index}>{search}</ListItem>
        ))}
      </List>
    </Box>
  );
}
