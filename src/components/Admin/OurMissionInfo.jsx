import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Text, Spinner, Box, Heading, VStack, Button } from "@chakra-ui/react";

export default function OurMissionInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [missionInfo, setMissionInfo] = useState();

  const saveChanges = () => {
    // TODO: Save the mission info to your database here
    setIsEditing(false);
  };

  return (
    <VStack spacing={6}>
      <Box
        rounded={"lg"}
        maxWidth={800}
        m="10px auto"
        borderRadius={"12px"}
        p={4}
        bg={"transparent"}
        borderWidth={"1px"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        {isEditing ? (
          <>
            {isLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <Spinner size="xl" />
              </Box>
            )}
            <Editor
              apiKey="ampk5o36dpm7qqhr2h54evb0g8b4fqptomyoa5ntgpubk2h4"
              value={missionInfo}
              init={{
                height: 300,
                menubar: false,
                plugins:
                  "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={(content) => setMissionInfo(content)}
              onInit={() => setIsLoading(false)}
            />
            <Button mt={4} onClick={saveChanges}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Heading as="h2" size="xl">
              About us page
            </Heading>
            <Button mt={4} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </>
        )}
      </Box>
    </VStack>
  );
}
