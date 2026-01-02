import React, { useRef } from "react";
import Slider from "react-slick";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../assets/images/University_of_Saskatchewan_Logo.jpg";
import image2 from "../assets/images/University_of_Regina_Logo.jpg";
import image3 from "../assets/images/NorthwestCollege_Logo.jpg";
import image4 from "../assets/images/PrinceAlbert_Grand_logo.jpg";
import image5 from "../assets/images/Suncrest-Logo.webp";
import image6 from "../assets/images/saskatchewan_cancer_agency_logo.jpg";
import image7 from "../assets/images/ISC.jpg";
import image8 from "../assets/images/NeighbourlyLogo.png";
import image9 from "../assets/images/Shoppers-Drug-Mart-Logo.png";
import image10 from "../assets/images/Saskatoon_Co-op_Logo.png";

const slides = [
  { title: "Saskatchewan Cancer Agency", industry: "Healthcare", image: image6 },
  { title: "University of Saskatchewan", industry: "Education", image: image1 },
  { title: "Prince Albert Grand Council", industry: "First Nations", image: image4 },
  { title: "Shoppers Drug Mart", industry: "Pharmacy", image: image9 },
  { title: "University of Regina", industry: "Education", image: image2 },
  { title: "Northwest College", industry: "Education", image: image3 },
  { title: "Suncrest College", industry: "Education", image: image5 },
  { title: "Indigenous Services Canada", industry: "Government", image: image7 },
  { title: "Neighbourly Pharmacy", industry: "Pharmacy", image: image8 },
  { title: "Saskatoon Co-op", industry: "Retail", image: image10 },
];

const FeedbackSlider = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    centerMode: false,
    responsive: [
      { 
        breakpoint: 1200, 
        settings: { 
          slidesToShow: 3,
          slidesToScroll: 1,
        } 
      },
      { 
        breakpoint: 900, 
        settings: { 
          slidesToShow: 2,
          slidesToScroll: 1,
        } 
      },
      { 
        breakpoint: 600, 
        settings: { 
          slidesToShow: 1,
          slidesToScroll: 1,
        } 
      },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <Box
      sx={{
        position: "relative",
        px: { xs: 5, md: 6 },
      }}
    >
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: { xs: -5, md: -10 },
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#0D2477",
          border: "3px solid #0D2477",
          color: "#ffffff",
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
          zIndex: 10,
          "&:hover": {
            backgroundColor: "#1a3a8f",
          },
        }}
      >
        <ChevronLeft sx={{ fontSize: { xs: 24, md: 28 } }} />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: { xs: -5, md: -10 },
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#0D2477",
          border: "3px solid #0D2477",
          color: "#ffffff",
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
          zIndex: 10,
          "&:hover": {
            backgroundColor: "#1a3a8f",
          },
        }}
      >
        <ChevronRight sx={{ fontSize: { xs: 24, md: 28 } }} />
      </IconButton>

      <Slider ref={sliderRef} {...settings}>
        {slides.map((item, index) => (
          <Box key={index} sx={{ px: { xs: 1, md: 2 } }}>
            <Card
              sx={{
                textAlign: "center",
                borderRadius: 3,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                p: { xs: 2, md: 3 },
                mx: "auto",
                backgroundColor: "#ffffff",
                height: { xs: 220, md: 260 },
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 100, md: 130 },
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    maxWidth: "80%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              </Box>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  p: 1,
                  "&:last-child": { pb: 1 },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ 
                    fontWeight: 600, 
                    color: "#0D2477", 
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: 1.3,
                    textAlign: "center",
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: "#666666", 
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    textAlign: "center",
                  }}
                >
                  {item.industry}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default FeedbackSlider;
