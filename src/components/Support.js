import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { keyframes } from '@emotion/react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

const cardHoverAnimation = keyframes`
    from {
        transform: scale(1) rotateY(0deg);
    }
    to {
        transform: scale(1.05) rotateY(10deg);
    }
`;

function Support() {
    const [slackData, setSlackData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/messages/images')
            .then(response => response.json())
            .then(data => {
                console.log('here is the data');
                console.log(data[0].images[0].imageUrl);
                setSlackData(data);
            })
            .catch(error => console.error("Error fetching Slack data:", error));
    }, []);

    return (
        <Box sx={{
            background: 'linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)',
            minHeight: '100vh',
            pb: 4,
            overflowX: 'hidden'
        }}>
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
                        transform: 'translateY(-10px)'
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <AwesomeSlider style={{ height: '100%', borderRadius: 2 }} animation="cubeAnimation">
                            {slackData.map((item, index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <p><strong>{item.username}</strong>: {item.text}</p>
                                    <p><small>{new Date(item.timestamp).toLocaleString()}</small></p>
                                    {item.images.map((image, imgIndex) => (
                                        // <img
                                        //     src={image.imageUrl}
                                        //     key={imgIndex}
                                        //     alt={image.title}
                                        //     style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        // />
                                        <img
                                            src="https://files.slack.com/files-pri/T07LNU99Q1F-F081NL52NDS/ss-web4.png"
                                            alt="Slack Image"
                                            crossOrigin="use-credentials"
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        />
                                    ))}
                                </div>
                            ))}
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
                            Slack Data
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Latest updates from Slack.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Display Slack Data in Cards */}
            <Container sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    {slackData.map((item, index) => (
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
                                    {/* {item.images.map((image, index) => (
                                        <img key={index} src={image.imageUrl} alt={item.text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ))} */}
                                    <img src={item.images[0].imageUrl} alt={item.text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    {item.text}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Support;
