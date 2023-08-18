import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FormControl, FormLabel } from "@chakra-ui/react";

export function JobDescriptionForm({ formik }) {
  return (
    <Editor
      apiKey="ampk5o36dpm7qqhr2h54evb0g8b4fqptomyoa5ntgpubk2h4"
      value={formik.values.jobDescription}
      id="jobDescription"
      init={{
        height: 300,
        menubar: false,
        plugins:
          "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
        toolbar:
          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={(content) =>
        formik.setFieldValue("jobDescription", content)
      }
    />
  );
}
