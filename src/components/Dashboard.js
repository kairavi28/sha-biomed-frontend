import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import image1 from '../assets/images/biomed_team_1.jpg';
import image_1 from '../assets/images/1.jpg';
import image_2 from '../assets/images/2.jpg';
import image_3 from '../assets/images/3.jpg';
import Link from "@mui/material/Link";

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
    {
        title: "Sunrise health region - Melville",
        description: "WM's curbside trash and recycling pickup is the best choice for your home, and for the environment.",
        image: image_1,
    },
    {
        title: "Commercial Waste Pickup",
        description: "WM's business trash and recycling pickup is the best choice for your organization, and for the environment.",
        image: image_2,
    },
    {
        title: "Roll-Off Dumpster Rental",
        description: "From quick cleanouts to major renovations, WM has a dumpster that's perfect for your project.",
        image: image_3
    }
];

function Dashboard() {
    const [serviceType, setServiceType] = useState('home');
    const handleSelectChange = (event) => {
        setServiceType(event.target.value);
    };

    return (
        <Box sx={{
            background: 'linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)',
            minHeight: '100vh',
            pb: 4
        }}>
            {/* Slider Section */}
            <Box display="flex" justifyContent="center" sx={{ pt: 4 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                        width: { xs: '90%', md: '80%' },
                        height: '400px',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3,
                        background: 'linear-gradient(to bottom, #ffffff, #a7d8e8, #d4f7d1)',
                    }}
                >
                    <Box sx={{ flex: 2 }}>
                        <AwesomeSlider style={{ height: '100%', borderRadius: 2 }}>
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
                            bgcolor: 'rgba(255, 255, 255, 0.8)',  // White background with opacity
                            textAlign: 'center',
                            color: 'black',
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            Welcome to Biomed Waste Management
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Our mission is to create sustainable waste management solutions for all.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Learn More
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Service Finder Section */}
            <Container sx={{ mt: 4, backgroundColor: 'white', borderRadius: 2, p: 3, boxShadow: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Find Waste Management Services"
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#f9f9f9' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            select
                            label="For home or business?"
                            fullWidth
                            variant="outlined"
                            value={serviceType}
                            onChange={handleSelectChange}
                            sx={{ backgroundColor: '#f9f9f9' }}
                        >
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="business">Business</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="contained" color="success" fullWidth>
                            Get Started
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            {/* Services Section */}
            <Container sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
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

            <Box sx={{ mt: 4, py: 2, textAlign: 'center', backgroundColor: '#f1f1f1' }}>
                <Copyright />
            </Box>
        </Box>
    );
}

export default Dashboard;
