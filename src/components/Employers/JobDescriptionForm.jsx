import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Text, Spinner, Box } from "@chakra-ui/react";

export function JobDescriptionForm({ formik }) {
  const [isLoading, setIsLoading] = useState(true); // State to control spinner visibility

  return (
    <>
      <Text fontSize={"15px"} color={"red"} mb="8px">
        {formik.touched.description && formik.errors.description}
      </Text>

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
        value={formik.values.description}
        id="description"
        init={{
          height: 300,
          menubar: false,
          plugins:
            "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
          toolbar:
            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
        }}
        onEditorChange={(content) =>
          formik.setFieldValue("description", content)
        }
        onInit={() => setIsLoading(false)}
      />
    </>
  );
}
