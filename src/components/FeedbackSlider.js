import React from "react";
import Slider from "react-slick";
import { Box, Card, CardContent, Typography } from "@mui/material";
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
  { title: "University of Saskatchewan", image: image1 },
  { title: "University of Regina", image: image2 },
  { title: "Northwest College", image: image3 },
  { title: "Prince Albert Grand Council", image: image4 },
  { title: "Suncrest College", image: image5 },
  { title: "Saskatchewan Cancer Agency", image: image6 },
  { title: "Indigenous Services Canada", image: image7 },
  { title: "Neighbourly Pharmacy", image: image8 },
  { title: "Shoppers Drug Mart", image: image9 },
  { title: "Co-op Pharmacy", image: image10 },
];

const FeedbackSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    centerMode: false,
    responsive: [
      { 
        breakpoint: 1536, 
        settings: { 
          slidesToShow: 4,
          slidesToScroll: 1,
        } 
      },
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

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
        pb: 0,
        "& .slick-slide": {
          px: { xs: 0.5, md: 1, lg: 1.5 },
        },
        "& .slick-list": {
          pb: 0,
          mb: 0,
        },
        "& .slick-dots": {
          position: "relative",
          bottom: 30,
          mt: -30,
          "& li": {
            margin: "0 3px",
          },
          "& li button:before": {
            fontSize: "10px",
            color: "#1a2744",
          },
          "& li.slick-active button:before": {
            color: "#D9DE38",
          },
        },
      }}
    >
      <Slider {...settings}>
        {slides.map((item, index) => (
          <Box key={index} sx={{ px: { xs: 0.5, md: 1 } }}>
            <Card
              sx={{
                textAlign: "center",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                p: { xs: 1.5, sm: 2, lg: 2.5 },
                mx: "auto",
                maxWidth: { xs: 280, sm: 260, lg: 280, xl: 300 },
                height: { xs: 220, sm: 240, lg: 260, xl: 280 },
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 120, sm: 140, lg: 160, xl: 180 },
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    transition: "transform 0.3s ease",
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
                  p: { xs: 1, sm: 1.5, lg: 2 },
                  "&:last-child": { pb: { xs: 1, sm: 1.5, lg: 2 } },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ 
                    fontWeight: 600, 
                    color: "#1a2744", 
                    fontSize: { xs: "0.85rem", sm: "0.95rem", lg: "1rem", xl: "1.1rem" },
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  {item.title}
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
