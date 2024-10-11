import React from "react";
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

const services = [
    {
        title: "Improperly Packaged Waste",
        date: "12-June-2024",
        description: "WM's curbside trash and recycling pickup is the best choice for your home, and for the environment.",
        image: "/path-to-your-image/residential-waste.png",
    },
    {
        title: "Commercial Waste Pickup",
        description: "WM's business trash and recycling pickup is the best choice for your organization, and for the environment.",
        image: "/path-to-your-image/commercial-waste.png",
    },
    {
        title: "Roll-Off Dumpster Rental",
        description: "From quick cleanouts to major renovations, WM has a dumpster that's perfect for your project.",
        image: "/path-to-your-image/rolloff-dumpster.png",
    }
];

function Dashboard() {
    return (
        <Box>
            {/* Slider Section */}
            <Box position="relative" sx={{ height: '400px' }}>
                <AwesomeSlider style={{ height: '100%' }}>
                    <div>Image 1</div>
                    <div>Image 2</div>
                    <div>Image 3</div>
                    <div>Image 4</div>
                </AwesomeSlider>

                {/* Overlay with text */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    color="white"
                    textAlign="center"
                >
                    <Typography variant="h3" fontWeight="bold">
                        Building Today, For Tomorrow®
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        We're working toward a future where materials are repurposed, energy is renewable and communities are thriving.
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2, backgroundColor: '#F9C70A' }}>
                        Read the Report
                    </Button>
                </Box>
            </Box>

            {/* Section */}
            <Container sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="Find Waste Management Services"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                label="For home or business?"
                                fullWidth
                                variant="outlined"
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
                </Paper>
            </Container>

            {/* Services Section */}
            <Container sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                                <img src={service.image} alt={service.title} style={{ width: '100%', height: '150px' }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    {service.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {service.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Dashboard;