import React from "react";
import { Box, Button, Heading, Text, Spinner } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { setDownload } from "../../reducers/resumeSlice";

export default function SuccessPayment() {
  const dispatch = useDispatch();
  const content = useSelector((state) => state.resume.content);
  const loading = useSelector((state) => state.resume.loading);

  console.log("Redux Content:", content);

  const downloadResumeAsPDF = () => {
    const opt = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    if (content && content.trim() !== "") {
      const contentElement = document.createElement("div");
      contentElement.innerHTML = content;
      html2pdf().set(opt).from(contentElement).save();
      dispatch(setDownload(false));
    } else {
      console.log("Content is null, undefined, or empty!");
    }
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      {loading ? (
        <Spinner color="blue.500" size="xl" />
      ) : (
        <>
          <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Congratulations, Payment Successful!
          </Heading>
          <Text color={"gray.500"} fontSize={"lg"}>
            Thank you for your purchase! Your payment has been processed
            successfully. You will receive an email confirmation shortly.
          </Text>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <Button onClick={downloadResumeAsPDF} colorScheme="blue" mt={6}>
            Download Resume
          </Button>
        </>
      )}
    </Box>
  );
}
