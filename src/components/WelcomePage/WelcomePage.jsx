import React from "react";
import WithSpeechBubbles from "../Testimonials/Testimonials";
import { Box, Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import styles from "../../Home.module.css";
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
      <WithSpeechBubbles />;
      <Box width="100vw">
        <Slider {...settings}>
          <Box p={4} className={styles.slide1}>
            <Heading as="h3" size="md">
              SLIDE 1
            </Heading>
          </Box>
          <Box p={4} className={styles.slide2}>
            <Heading as="h3" size="md">
              SLIDE 2
            </Heading>
          </Box>
          <Box p={4} className={styles.slide3}>
            <Heading as="h3" size="md">
              SLIDE 3
            </Heading>
          </Box>
          <Box p={4} className={styles.slide4}>
            <Heading as="h3" size="md">
              SLIDE 4
            </Heading>
          </Box>
          <Box p={4} className={styles.slide5}>
            <Heading as="h3" size="md">
              SLIDE 5
            </Heading>
          </Box>
          <Box p={4} className={styles.slide6}>
            <Heading as="h3" size="md">
              SLIDE 6
            </Heading>
          </Box>
        </Slider>
      </Box>
    </>
  );
}
