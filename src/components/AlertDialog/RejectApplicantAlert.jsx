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
export function RejectApplicantAlert({ isOpen, onClose, id }) {
  const cancelRef = React.useRef();
  const updateApplicationStatus = async (id, status) => {
    await axios.put(`https://localhost:7013/api/JobApplications/UpdateStatus`, {
      id,
      newStatus: status,
    });
  };

  function handleReject() {
    updateApplicationStatus(id, 0);
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
            Reject Applicant
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to reject this applicant?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleReject} ml={3}>
              Reject
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
