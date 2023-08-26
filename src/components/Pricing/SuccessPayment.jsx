import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Text, Spinner } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { setDownload } from "../../reducers/resumeSlice";

export default function SuccessPayment() {
  const dispatch = useDispatch();
  const content = useSelector((state) => state.resume.content);
  const loading = useSelector((state) => state.resume.loading);
  const [localContent, setLocalContent] = useState(null);

  useEffect(() => {
    if (!content) {
      const localStoredContent = JSON.parse(
        localStorage.getItem("resumeContent")
      );
      setLocalContent(localStoredContent);
    }
  }, [content]);

  const downloadResumeAsPDF = () => {
    const contentToUse = content || localContent;

    if (!contentToUse || JSON.stringify(contentToUse).trim() === "{}") {
      console.error("Content is null, undefined, or empty!");
      return;
    }

    const formattedContent = Object.keys(contentToUse)
      .map((key) => `<p><strong>${key}:</strong> ${contentToUse[key]}</p>`)
      .join("");

    const opt = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const contentElement = document.createElement("div");
    contentElement.innerHTML = formattedContent;

    html2pdf()
      .set(opt)
      .from(contentElement)
      .save()
      .catch((error) => console.error("PDF generation failed:", error));
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
            Thank you for your purchase!
          </Text>
          <div
            dangerouslySetInnerHTML={{
              __html:
                content || localContent
                  ? content || localContent.description
                  : "Loading content...",
            }}
          />
          <Button onClick={downloadResumeAsPDF} colorScheme="blue" mt={6}>
            Download Resume
          </Button>
        </>
      )}
    </Box>
  );
}
