import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { updateStatusAsync } from "../../reducers/applicantSlice";
export function AcceptApplicantAlert({ isOpen, onClose, applicationId }) {
  const dispatch = useDispatch();
  const cancelRef = React.useRef();
  const toast = useToast();
  const updateApplicationStatus = async (applicationId, status) => {
    await axios.put(`https://localhost:7013/api/JobApplications/UpdateStatus`, {
      ApplicationId: applicationId,
      NewStatus: status,
    });
  };

  function handleAccept() {
    updateApplicationStatus(applicationId, 2)
      .then(() => {
        toast({
          title: "Application Accepted.",
          description: "You have successfully accepted the application.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        toast({
          title: "An error occurred.",
          description: "Unable to accept the application.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Accept Applicant
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to accept this applicant?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAccept} ml={3}>
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
