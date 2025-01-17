import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Modal,
  Card,
  CardContent,
  CardMedia,
  Link
} from "@mui/material";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { keyframes } from "@emotion/react";
import image1 from "../assets/images/bg_full_2.png";
import image3 from "../assets/images/bg_full_4.png";
import image_1 from "../assets/images/1.jpg";
import image_2 from "../assets/images/2.jpg";
import image_3 from "../assets/images/3.jpg";

const newCardHoverAnimation = keyframes`
  from {
    transform: scale(1) rotateY(0deg);
  }
  to {
    transform: scale(1.1) rotateY(15deg);
  }
`;

const updates = [
  { title: "New Waste Guidelines", description: "Updated policies for 2025.", date: "Jan 10, 2025" },
  { title: "Expanded Services", description: "Now operating in additional locations!", date: "Jan 5, 2025" },
];

const testimonials = [
  { name: "John Doe", feedback: "Biomed’s services exceeded our expectations!" },
  { name: "Jane Smith", feedback: "Highly reliable and professional team!" },
];

function Dashboard() {
  const [formOpen, setFormOpen] = useState(false);

  const handleFormOpen = () => setFormOpen(true);
  const handleFormClose = () => setFormOpen(false);

  return (
    <Box sx={{ background: "linear-gradient(to bottom, white, #f0f8ff)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          background: "linear-gradient(to bottom, #003366, rgba(0, 51, 102, 0.8))",
          color: "white",
          pb: 6,
          pt: 4,
        }}
      >
        <AwesomeSlider
          style={{
            height: "500px",
            borderRadius: "10px",
          }}
          bullets={false}
          play={true}
          interval={4000}
        >
          {[image1, image3].map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </AwesomeSlider>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
          Leading Biohazard Waste Disposal
        </Typography>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "#A9AC2B", color: "white", fontSize: "bold" },
          }}
        >
          Make a complaint
        </Button>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "#A9AC2B", color: "white", fontSize: "bold" },
          }}
        >
          Read a blog
        </Button>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "#A9AC2B", color: "white", fontSize: "bold" },
          }}
        >
          Ask a Question
        </Button>
      </Box>

      {/* About Section */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          About Biomed 
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "30+ Years of Expertise",
              description: "Trusted leaders in biohazard waste recovery since 1992.",
            },
            {
              title: "Certified & Compliant",
              description: "Fully licensed to handle all types of biohazardous waste.",
            },
            {
              title: "Sustainable Solutions",
              description: "Innovative systems that prioritize the environment.",
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: "center", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Improperly Packaged Waste Section */}
      <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
      <Container sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          Importance of Proper Waste Packaging
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 4 }}>
          Improperly packaged waste can lead to contamination, legal issues, and harm to the environment. This portal is
          designed to educate users on the best practices for properly packaging waste to ensure safety and compliance
          with regulations.
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2, textAlign: "center" }}
              >
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "{testimonial.feedback}"
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  - {testimonial.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container></Box>

      {/* Services Section */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {[image_1, image_2, image_3].map((image, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  "&:hover": { animation: `${newCardHoverAnimation} 0.5s ease-in-out forwards` },
                }}
              >
                <img src={image} alt={`Service ${index}`} style={{ width: "100%", borderRadius: "8px" }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  Service {index + 1}
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Learn More
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          What Our Clients Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2, textAlign: "center" }}
              >
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "{testimonial.feedback}"
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  - {testimonial.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#333", color: "#fff", textAlign: "center", py: 4 }}>
        <Typography variant="body2">
          © 2025 Biomed Waste Recovery and Disposal Ltd. All rights reserved.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link href="/privacy-policy" color="inherit" sx={{ mx: 2 }}>
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" color="inherit" sx={{ mx: 2 }}>
            Terms & Conditions
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
