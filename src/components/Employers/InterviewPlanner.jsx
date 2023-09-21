import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Input, Button, useToast } from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import plannerImg from "../../images/plannerImg.png";
import useUser from "../../customhooks/useUser";
import axios from "axios";
const localizer = momentLocalizer(moment);

export default function InterviewPlanner() {
  const { userId } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [events, setEvents] = useState([]);
  const toast = useToast();
  const toastSuccess = (message) => {
    toast({
      title: message,
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };

  const toastError = (message) => {
    toast({
      title: message,
      status: "error",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7013/api/Events/GetEvents?userId=${userId}`
        );
        if (response.data) {
          const fetchedEvents = response.data.map((e) => ({
            title: e.title,
            start: new Date(moment(e.start)),
            end: new Date(moment(e.end)),
            allDay:
              moment(e.end).diff(moment(e.start), "days") > 0 ? true : false,
          }));

          console.log(fetchedEvents);
          setEvents(fetchedEvents);
        }
      } catch (error) {
        toastError("Something went wrong while fetching events");
      }
    };

    fetchEvents();
  }, [userId]);

  const handleAddEvent = async () => {
    try {
      const eventWithUser = {
        userId,
        title: newEvent.title,
        startDate: newEvent.start,
        endDate: newEvent.end,
      };

      const response = await axios.post(
        "https://localhost:7013/api/Events/CreateEvent",
        eventWithUser
      );

      if (response.data) {
        setShowForm(false);
        toastSuccess("Event created successfully");
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newEvent.title,
            start: new Date(moment(newEvent.start)),
            end: new Date(moment(newEvent.end)),
            allDay: false,
          },
        ]);
      }
    } catch (error) {
      toastError("Something went wrong");
    }
  };

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
        bgImage={plannerImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems="center" ml="50px" width="100%" height="100%">
          <Heading color="#2D2D2D" fontSize="28px" as="h5" size="md">
            Plan your upcoming Interviews
          </Heading>
        </Flex>
      </Box>

      <Box my={4}>
        <Button colorScheme="blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Event"}
        </Button>

        {showForm && (
          <Box mt={4} p={4} rounded="md" bg="white" shadow="md">
            <Input
              placeholder="Event Title"
              mb={4}
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <Input
              type="datetime-local"
              placeholder="Start Time"
              mb={4}
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start: e.target.value })
              }
            />
            <Input
              type="datetime-local"
              placeholder="End Time"
              mb={4}
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end: e.target.value })
              }
            />
            <Button colorScheme="teal" onClick={handleAddEvent}>
              Submit
            </Button>
          </Box>
        )}
      </Box>

      <Box
        borderWidth="1px"
        rounded="lg"
        bg="white"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
        />
      </Box>
    </Box>
  );
}
