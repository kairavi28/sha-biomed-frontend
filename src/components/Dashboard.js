import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    CircularProgress,
    Button,
    TextField,
    MenuItem
} from "@mui/material";
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { keyframes } from '@emotion/react';
import image1 from '../assets/images/biomed_team_1.jpg';
import image_1 from '../assets/images/1.jpg';
import image_2 from '../assets/images/2.jpg';
import image_3 from '../assets/images/3.jpg';
import Link from "@mui/material/Link";
import axios from "axios";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Biomed Waste Communication Channel
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const services = [
    { title: "Sunrise health region - Melville", description: "WM's curbside trash and recycling pickup is the best choice for your home, and for the environment.", image: image_1 },
    { title: "Commercial Waste Pickup", description: "WM's business trash and recycling pickup is the best choice for your organization, and for the environment.", image: image_2 },
    { title: "Roll-Off Dumpster Rental", description: "From quick cleanouts to major renovations, WM has a dumpster that's perfect for your project.", image: image_3 }
];

// 3D Hover Effect Animation for Services Cards
const cardHoverAnimation = keyframes`
    from {
        transform: scale(1) rotateY(0deg);
    }
    to {
        transform: scale(1.05) rotateY(10deg);
    }
`;

function Dashboard() {
    const [quoteData, setQuoteData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: 'home'
    });
    const [loading, setLoading] = useState(true);  // eslint-disable-line no-unused-vars
    const [autoReload, setAutoReload] = useState(true);

    const [error, setError] = useState("");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setQuoteData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!quoteData.name || !quoteData.email || !quoteData.phone) {
            alert("Please fill in all fields.");
            return;
        }

        axios.post("http://localhost:5000/api/quotes", quoteData)
            .then(() => {
                alert(`Thank you, ${quoteData.name}! We will contact you soon.`);
                setQuoteData({ name: '', email: '', phone: '', serviceType: 'home' });
            })
            .catch(() => {
                alert("There was an error submitting your quote. Please try again.");
            });
    };

    useEffect(() => {
        let intervalId;
        if (autoReload) {
            setLoading(true);
            axios
                .get("http://localhost:5000/api/blogs")
                .then((response) => {
                    //setBlogs(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load blogs. Please try again.");
                    setLoading(false);
                });

            intervalId = setInterval(() => {
                window.location.reload();
            }, 10000);
        }

        return () => clearInterval(intervalId);
    }, [autoReload]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                sx={{ background: "#f3f4f6" }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                sx={{ background: "#f8d7da" }}
            >
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            background: 'linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)',
            minHeight: '100vh',
            pb: 1,
            overflowX: 'hidden'
        }}>
            {/* Slider Section with Animation */}
            <Box display="flex" justifyContent="center" sx={{ pt: 4 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                        width: { xs: '90%', md: '60%' },
                        height: '380px',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3,
                        background: 'linear-gradient(to bottom, #ffffff, #a7d8e8, #d4f7d1)',
                        transform: 'translateY(-10px)',
                        animation: `${keyframes`from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); }`} 1s ease-out`
                    }}
                >
                    <Box sx={{ flex: 2 }}>
                        <AwesomeSlider style={{ height: '100%', borderRadius: 2 }} animation="cubeAnimation">
                            <div><img src={image1} alt="team member 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                        </AwesomeSlider>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.85)',
                            textAlign: 'center',
                            color: 'black',
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            Welcome to Biomed Recovery & Disposal Ltd.
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            We are the Biohazard Professionals! Serving Saskatchewan, Canada.
                        </Typography>
                        <Button variant="outlined" color="primary" sx={{
                            background: "linear-gradient(to right, #00796b, #48a999)",
                            color: "#fff",
                            "&:hover": {
                                background: "linear-gradient(to right, #00574b, #327e67)",
                            },
                        }}>
                            Learn More
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Services Section with 3D Animation */}
            <Container sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        animation: `${cardHoverAnimation} 0.6s ease-in-out forwards`,
                                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)'
                                    }
                                }}
                            >
                                <Box sx={{ height: '200px', overflow: 'hidden', borderRadius: 2 }}>
                                    <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    {service.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>
                                    {service.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer with Get a Free Quote Section */}
            <Box sx={{
                mt: 6,
                py: 4,
                backgroundColor: '#f1f1f1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Get a Free Quote
                </Typography>
                <Container sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, boxShadow: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={quoteData.name}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                variant="outlined"
                                name="email"
                                value={quoteData.email}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                variant="outlined"
                                name="phone"
                                value={quoteData.phone}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Service Type"
                                fullWidth
                                variant="outlined"
                                name="serviceType"
                                value={quoteData.serviceType}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            >
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="business">Business</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                                sx={{
                                    background: "linear-gradient(to right, #00796b, #48a999)",
                                    color: "#fff",
                                    "&:hover": {
                                        background: "linear-gradient(to right, #00574b, #327e67)",
                                    },
                                }}
                            >
                                Get Free Quote
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <Box sx={{ mt: 4 } }>
                    <Copyright />
                </Box>
            </Box>
            <button onClick={() => setAutoReload(!autoReload)}>
                {autoReload ? "Pause Auto-Reload" : "Resume Auto-Reload"}
            </button>
        </Box>
    );
}

export default Dashboard;
