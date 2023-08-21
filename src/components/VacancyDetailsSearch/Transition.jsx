function TransitionExample() {
  return (
    <>
      <Modal
        isCentered
        onClose={onModalClose}
        isOpen={isModalOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Lorem count={2} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
return (
  <>
    <SearchResultCards searchResults={searchResults} />
    <TransitionExample />
  </>
);
