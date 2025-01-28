import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    CircularProgress,
    Link,
} from "@mui/material";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { motion } from "framer-motion";

function InstructionPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://52.60.180.33:5000/api/blogs") 
            .then((response) => {
                setBlogs(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load blogs. Please try again.");
                setLoading(false);
            });
    }, []);

    const handleOpen = (blog) => {
        setSelectedBlog(blog);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBlog(null);
    };

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
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    height: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: "url('/images/waste-packaging.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "center",
                    color: "black",
                    zIndex: 0.5,
                }}
            >
                <Container>
                    <Typography variant="h3" fontWeight="bold">
                        Waste Packaging Guide
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
                        Proper waste packaging ensures a safer and more efficient disposal process.
                    </Typography>
                </Container>
            </Box>

            {/* Steps to Package Waste Properly */}
            <Box sx={{ py: 8, backgroundColor: "#f9f9f9" }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
                        Steps for Proper Waste Packaging
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Step 1 */}
                        {[
                            {
                                title: "Step 1: Choose the Right Container",
                                description:
                                    "Select a sturdy container suitable for the type of waste you are disposing of. Ensure it is leak-proof and easy to seal.",
                            },
                            {
                                title: "Step 2: Secure the Waste Properly",
                                description:
                                    "Wrap waste material in plastic or other suitable materials to prevent contamination. Use double bags if necessary for added protection.",
                            },
                            {
                                title: "Step 3: Label the Container",
                                description:
                                    "Clearly label the container with waste details (e.g., hazardous, biological, etc.) to ensure safe handling during disposal.",
                            },
                        ].map((step, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ mb: 2, fontWeight: "bold" }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {step.description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Waste Management Tips Section */}
            <Box sx={{ py: 4, backgroundColor: "#ffffff" }}>
                <Container>
                    <Typography
                        variant="h4"
                        align="center"
                        fontWeight="bold"
                        sx={{ mb: 4 }}
                    >
                        Use of Biomed Products
                    </Typography>
                    <Grid container spacing={4} direction="column">
                        {[
                            {
                                title: "THE TERRA",
                                description: (
                                    <>
                                        <Typography variant="h6" align="center"  sx={{ mb: 2 }}>
                                            TYSC4 | TYSC8 | TCTL8 | TCLL8
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            Our Terra Program provides a range of containers specifically designed for the safe disposal of sharps. This program is ideal for:
                                        </Typography>
                                        <Box component="ul" sx={{ listStyle: "none", paddingLeft: 0 }}>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <CheckCircleIcon color="primary" />
                                                    Healthcare facilities
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <CheckCircleIcon color="primary" />
                                                    Veterinary clinics
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <CheckCircleIcon color="primary" />
                                                    Medical and dental practices
                                                </Typography>
                                            </li>
                                        </Box>
                                        <Typography variant="body1" paragraph>
                                            Members benefit from a convenient monthly flat-rate fee that covers both products and services. In compliance with the Transportation of Dangerous Goods Act, Terra container lids are secured with pins for safe transport.
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "error.main" }}>
                                            Important Reminder
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            Please avoid placing the following items in Terra containers:
                                        </Typography>
                                        <Box component="ul" sx={{ listStyle: "none", paddingLeft: 0 }}>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <WarningAmberIcon color="error" />
                                                    Large quantities of liquid
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <WarningAmberIcon color="error" />
                                                    Large knives
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <WarningAmberIcon color="error" />
                                                    Anatomical waste
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <WarningAmberIcon color="error" />
                                                    Batteries
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <WarningAmberIcon color="error" />
                                                    Drug paraphernalia
                                                </Typography>
                                            </li>

                                            {/* YouTube Video Section */}
                                            <Box sx={{ py: 8, backgroundColor: "#f9f9f9" }}>
                                                <Container>
                                                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
                                                        Instructional Video
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            border: "2px solid #ddd",
                                                            borderRadius: 2,
                                                            boxShadow: 3,
                                                            padding: 2,
                                                            backgroundColor: "#fff",
                                                        }}
                                                    >

                                                        <YouTube
                                                            videoId="3n-CkW5SDE0" 
                                                            opts={{
                                                                height: "490",
                                                                width: "740",
                                                                playerVars: {
                                                                    autoplay: 0,
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                </Container>
                                            </Box>
                                        </Box>
                                    </>
                                ),
                            },
                        ].map((step, index) => (
                            <Grid item xs={12} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 4,
                                            textAlign: "left",
                                            borderRadius: 2,
                                            width: "100%",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
                                        >
                                            {step.title}
                                        </Typography>
                                        {step.description || (
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                No description provided.
                                            </Typography>
                                        )}
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>


            {/* Waste Management Tips Section */}
            <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
                        Waste Management Tips
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            {
                                title: "Step 1: Choose the Right Container",
                                description:
                                    "Select a sturdy container suitable for the type of waste you are disposing of. Ensure it is leak-proof and easy to seal.",
                            },
                            {
                                title: "Step 2: Secure the Waste Properly",
                                description:
                                    "Wrap waste material in plastic or other suitable materials to prevent contamination. Use double bags if necessary for added protection.",
                            },
                            {
                                title: "Step 3: Label the Container",
                                description:
                                    "Clearly label the container with waste details (e.g., hazardous, biological, etc.) to ensure safe handling during disposal.",
                            },
                        ].map((step, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ mb: 2, fontWeight: "bold" }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {step.description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Box sx={{ py: 8, backgroundColor: "#f9f9f9" }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Q: How do I dispose of medical waste safely?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        A: Medical waste should be disposed of in specialized containers marked for biohazardous materials to avoid contamination.
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Q: Can I use regular trash bags for waste disposal?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        A: No. Only use approved containers for waste that could be hazardous. Regular trash bags are not suitable for hazardous materials.
                    </Typography>
                </Container>
            </Box>

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

export default InstructionPage;
