import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import styles from "../../Home.module.css";
import welcome1 from "../../images/business-people-having-discussion-dispute-disagreement-meeting-negotiations-ai-generative.jpg";
import welcome2 from "../../images/successful-business-team-smiling-with-confidence-indoors-generated-by-ai.jpg";
import welcome3 from "../../images/one-person-holding-jigsaw-puzzle-solution-success-generated-by-ai.jpg";
import welcomeImg1 from "../../images/WelcomeImg1.jpg";
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
      <Box width="100vw" height="100vh">
        <Slider {...settings}>
          <Box
            p={4}
            bgImage={welcomeImg1}
            bgSize="cover"
            bgRepeat="no-repeat"
            className={styles.slide1}
            height="100vh"
          >
            <Heading as="h3" size="lg" color="blue">
              Connecting Talent
              <br />
              With Opportunity
            </Heading>
          </Box>
          <Box
            p={4}
            bgImage={`url(${welcome2})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            className={styles.slide2}
            height="100vh"
          >
            <Heading as="h3" size="lg" color="white">
              Streamlining Recruitment,
              <br />
              Empowering Growth
            </Heading>
          </Box>
          <Box
            p={4}
            bgImage={`url(${welcome3})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            className={styles.slide3}
            height="100%"
          >
            <Heading as="h3" size="lg" color="white">
              Find Your Perfect Fit,
              <br />
              Faster Than Ever
            </Heading>
          </Box>
        </Slider>
      </Box>
    </>
  );
}
