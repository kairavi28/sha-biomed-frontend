import React from "react";
import Slider from "react-slick";
import { Card, CardContent, Typography } from "@mui/material";
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

const slides = [
  { title: "University of Saskatchewan", image: image1 },
  { title: "University of Regina", image: image2 },
  { title: "Northwest College", image: image3 },
  { title: "Prince Albert Grand Council", image: image4 },
  { title: "Suncrest College", image: image5 },
  { title: "Saskatchewan Cancer Agency", image: image6 },
  { title: "Indigenous Services Canada", image: image7},
  { title: "Neighbourly Pharmacy", image: image8},
  { title: "Shoppers Drug Mart", image: image9},
];

const FeedbackSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {slides.map((item, index) => (
        <div key={index}>
          <Card
            sx={{
              textAlign: "center",
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
              m: 2,
              width: 260,
              height: 250,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <div
              style={{
                width: "100%",
                height: 150,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "20%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#003366", marginBottom: "0" }}
              >
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  );
};

export default FeedbackSlider;
