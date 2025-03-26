import React from "react";
import Slider from "react-slick";
import { Card, CardContent, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const slides = [
  { title: "Sales and Service", description: "Ph: 306-253-4476" },
  { title: "Accounting", description: "Ph: 306-253-4474" },
  { title: "Reception", description: "Ph: 306-253-4476" },
  { title: "Toll Free", description: "Toll Free: 1-866-288-3298" }
];

const ContactSlider = () => {
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
              <Typography variant="body1" sx={{ mt: 2, color: "#555" }}>
                <b>{item.description}</b>
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  );
};

export default ContactSlider;
