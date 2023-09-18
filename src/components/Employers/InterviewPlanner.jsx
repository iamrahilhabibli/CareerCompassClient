import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Don't forget to import the CSS for the calendar

const localizer = momentLocalizer(moment);

export default function InterviewPlanner() {
  const myEventsList = [
    {
      start: new Date(),
      end: new Date(moment().add(1, "hour")),
      title: "Interview with Rahil",
    },
  ];

  return (
    <Box
      rounded="lg"
      maxWidth={800}
      m="10px auto"
      borderRadius="12px"
      p={4}
      bg="transparent"
    >
      <Box
        borderWidth="1px"
        rounded="lg"
        height="200px"
        bg="white"
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        // bgImage={educationLevels}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems="center" ml="50px" width="100%" height="100%">
          <Heading color="#2D2D2D" fontSize="28px" as="h5" size="md">
            Plan your upcoming Interviews
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />
      <Box
        borderWidth="1px"
        rounded="lg"
        bg="white"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
        />
      </Box>
    </Box>
  );
}
