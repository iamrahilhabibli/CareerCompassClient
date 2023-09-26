import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import styles from "../../Home.module.css";
import welcome1 from "../../images/business-people-having-discussion-dispute-disagreement-meeting-negotiations-ai-generative.jpg";
import welcome2 from "../../images/successful-business-team-smiling-with-confidence-indoors-generated-by-ai.jpg";
import welcome3 from "../../images/one-person-holding-jigsaw-puzzle-solution-success-generated-by-ai.jpg";
import welcomeImg1 from "../../images/WelcomeImg1.jpg";
import welcomeImg2 from "../../images/Welcomepage2.jpg";
import welcomeImg3 from "../../images/welcomeimg3.jpg";
export function WelcomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    swipeToSlide: true,
  };

  return (
    <>
      <Box width="100%" height="100vh" overflow={"hidden"}>
        <Slider {...settings}>
          <Box
            p={4}
            bgImage={welcomeImg1}
            bgSize="cover"
            bgRepeat="no-repeat"
            className={styles.slide1}
            height="100vh"
          >
            <Heading
              as="h3"
              size="lg"
              color="#2557a7"
              style={{
                marginLeft: "20%",
                textAlign: "left",
                fontSize: "2.5em",
              }}
            >
              <span> Connecting Talent</span>
              <br />
              <span style={{ marginLeft: "10%" }}> With Opportunity</span>
            </Heading>
          </Box>
          <Box
            p={4}
            bgImage={welcomeImg2}
            bgSize="cover"
            bgRepeat="no-repeat"
            className={styles.slide2}
            height="100vh"
          >
            <Heading
              as="h3"
              size="lg"
              color="#2557a7"
              style={{
                marginLeft: "20%",
                textAlign: "left",
                fontSize: "2.5em",
              }}
            >
              <span>Streamlining Recruitment,</span>
              <br />
              <span style={{ marginLeft: "10%" }}>Empowering Growth</span>
            </Heading>
          </Box>
          <Box
            p={4}
            bgImage={welcomeImg3}
            bgSize="cover"
            bgRepeat="no-repeat"
            className={styles.slide3}
            height="100vh"
          >
            <Heading
              as="h3"
              size="lg"
              color="#2557a7"
              style={{
                marginLeft: "20%",
                textAlign: "left",
                fontSize: "2.5em",
              }}
            >
              <span>Find Your Perfect Fit,</span>
              <br />
              <span style={{ marginLeft: "10%" }}>Faster Than Ever</span>
            </Heading>
          </Box>
        </Slider>
      </Box>
    </>
  );
}
