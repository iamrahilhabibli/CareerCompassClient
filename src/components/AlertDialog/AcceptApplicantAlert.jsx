import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
export function AcceptApplicantAlert({ isOpen, onClose, id }) {
  const cancelRef = React.useRef();
  const updateApplicationStatus = async (id, status) => {
    await axios.put(`https://localhost:7013/api/JobApplications/UpdateStatus`, {
      id,
      newStatus: status,
    });
  };

  function handleAccept() {
    updateApplicationStatus(id, 2);
    onClose();
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
