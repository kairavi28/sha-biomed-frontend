import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./ContentSlider.css"; 
import image1  from "../assets/images/saskatoon.jpg";
import image2 from "../assets/images/hazardous.png";
import image3 from "../assets/images/sharps.webp";
import image4 from "../assets/images/terra.png";
import image5 from "../assets/images/transport.png";
import image6 from "../assets/images/medical.jpg";

const slides = [
  {
    id: 1,
    image: `${image1}`, 
    title: "Medical Waste Disposal Across Canada",
    description:
      "We manufacture and distribute sharps containers and medical waste containers across Canada!",
  },
  {
    id: 2,
    image: `${image2}`,
    title: "Biohazardous Waste Processing",
    description:
      "We handle medical, pharmaceutical, anatomical, and cytotoxic waste safely and efficiently.",
  },
  {
    id: 3,
    image: `${image3}`,
    title: "Secure-A-Sharp® Service Program",
    description:
      "All Secure-A-Sharp® products are designed and manufactured by Biomed. An exclusive Biomed Value™ !",
  },
  {
    id: 4,
    image: `${image4}`,
    title: "Terra® Service Program",
    description:
      "Terra™ reusable sharps containers and medical waste containers are designed for clinical use and are available only as part of our reusable service program.",
  },
  {
    id: 5,
    image: `${image6}`,
    title: "Recovery Service Program",
    description:
      "The Biomed RecoveryTM line of biomedical waste containers are designed for bulk biohazardous waste disposal and are safe, efficient and affordable. A great Biomed ValueTM!",
  },
  {
    id: 6,
    image: `${image5}`,
    title: "Transport Services",
    description:
      "Regular routes covering all of Saskatchewan with barcode tracking and special transport insurance.",
  },
];

const ContentSlider = () => {
  return (
    <div className="content-slider">
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        interval={5000}
        showThumbs={false}
        showStatus={false}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="slide">
            <div
              className="slide-background"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <h4>{slide.description}</h4>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ContentSlider;
