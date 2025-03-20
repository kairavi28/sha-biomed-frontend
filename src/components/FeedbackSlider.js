import React from "react";
import Slider from "react-slick";
import { Card, CardContent, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const slides = [
  { title: "Slide 1", description: "Description for Slide 1" },
  { title: "Slide 2", description: "Description for Slide 2" },
  { title: "Slide 3", description: "Description for Slide 3" },
  { title: "Slide 4", description: "Description for Slide 4" }
];

const FeedbackSlider = () => {
  const settings = {
    dots: true,         // Show pagination dots
    infinite: true,     // Infinite looping
    speed: 500,        // Animation speed
    slidesToShow: 2,   // Number of slides visible
    slidesToScroll: 1, // Slides to scroll per click
    autoplay: true,    // Auto-slide
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <Slider {...settings}>
      {slides.map((item, index) => (
        <div key={index}>
          <Card sx={{ textAlign: "center", boxShadow: 3, p: 2, m: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  );
};

export default FeedbackSlider;
