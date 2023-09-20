import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Text, Spinner } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { setDownload } from "../../reducers/resumeSlice";
import axios from "axios";

export default function SuccessPayment() {
  const dispatch = useDispatch();
  const content = useSelector((state) => state.resume.content);
  const loading = useSelector((state) => state.resume.loading);
  const [localContent, setLocalContent] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [resumeStructure, setResumeStructure] = useState(null);

  useEffect(() => {
    if (!content) {
      const localStoredContent = JSON.parse(
        localStorage.getItem("resumeContent")
      );
      setLocalContent(localStoredContent);
    }
  }, [content]);
  useEffect(() => {
    const selectedPlanId = sessionStorage.getItem("selectedPlanId");
    if (selectedPlanId) {
      fetchSelectedResume(selectedPlanId);
    }
  }, []);
  const fetchSelectedResume = async (planId) => {
    try {
      const response = await axios.get(
        `https://localhost:7013/api/Resumes/GetResumeById?id=${planId}`
      );
      const textArea = document.createElement("textarea");
      textArea.innerHTML = response.data.structure;
      const decodedHTML = textArea.value;
      setResumeStructure(decodedHTML);
    } catch (error) {
      console.error("Failed to fetch resume details:", error);
    }
  };
  console.log(resumeStructure);
  const downloadResumeAsPDF = () => {
    const contentToUse = content || localContent;

    if (!contentToUse || JSON.stringify(contentToUse).trim() === "{}") {
      console.error("Content is null, undefined, or empty!");
      return;
    }

    let formattedContent =
      resumeStructure ||
      `
      <div style="font-family: Arial, sans-serif;">
        <h1>${contentToUse.firstName} ${contentToUse.lastName}</h1>
        <hr/>
        <div style="display: flex; justify-content: space-between;">
          <p><strong>Email:</strong> ${contentToUse.email}</p>
          <p><strong>Phone:</strong> ${contentToUse.phoneNumber}</p>
        </div>
        <h2><strong>Experience:</strong> ${contentToUse.experience} years</h2>
        <h2><strong>Education:</strong> ${contentToUse.education}</h2>
        <div>${contentToUse.description}</div>
      </div>
    `;

    if (resumeStructure) {
      formattedContent = formattedContent
        .replace(/{{firstName}}/g, contentToUse.firstName)
        .replace(/{{lastName}}/g, contentToUse.lastName)
        .replace(/{{email}}/g, contentToUse.email)
        .replace(/{{phoneNumber}}/g, contentToUse.phoneNumber)
        .replace(/{{experience}}/g, contentToUse.experience)
        .replace(/{{education}}/g, contentToUse.education)
        .replace(/{{description}}/g, contentToUse.description);
    }

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
    <Box width={"100%"} height={"100vh"} textAlign="center" py={10} px={6}>
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
          {localContent && (
            <Button onClick={downloadResumeAsPDF} colorScheme="blue" mt={6}>
              Download Resume
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
