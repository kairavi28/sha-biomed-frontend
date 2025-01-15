import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
    TextField,
    MenuItem,
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

function Dashboard() {
    const [autoReload, setAutoReload] = useState(true);

    return (
        <Box sx={{ background: "linear-gradient(to bottom, white, #b3e0ff)", minHeight: "100vh" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: "relative",
                    textAlign: "center",
                    pt: 4,
                    background: "linear-gradient(to bottom, white, #b3e0ff)",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", md: "70%" },
                        height: { xs: "300px", md: "550px" }, // Adjust height for mobile devices
                        margin: "0 auto",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 3,
                        backgroundColor: "transparent",
                    }}
                >
                    <AwesomeSlider
                        style={{
                            height: "100%",
                            borderRadius: "10px",
                            backgroundColor: "transparent",
                        }}
                        bullets={false}
                    >
                        {[image1, image3].map((img, index) => (
                            <div key={index}>
                                <img
                                    src={img}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        objectFit: "cover", // Ensure the image covers the entire slider area
                                        display: "block",
                                    }}
                                />
                            </div>
                        ))}
                    </AwesomeSlider>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold", color: "#003366" }}>
                    Leading Biohazard Waste Disposal
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        backgroundColor: "#00796b",
                        color: "white",
                        px: 4,
                        py: 1,
                        "&:hover": { backgroundColor: "#00574b" },
                    }}
                >
                    Register Issue
                </Button>
            </Box>



            {/* Services Section */}
            <Container sx={{ mt: 6 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
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
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Detailed description of Service {index + 1}.
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Updates Section */}
            <Box sx={{ mt: 6, backgroundColor: "#f4f4f4", py: 4 }}>
                <Container>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
                        Latest Updates
                    </Typography>
                    <Grid container spacing={4}>
                        {updates.map((update, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                        {update.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {update.description}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {update.date}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ backgroundColor: "#333", color: "#fff", textAlign: "center", py: 4 }}>
                <Typography variant="body2">© 2025 Biomed Waste Communication Channel. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}

export default Dashboard;
