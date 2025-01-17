import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link,
} from "@mui/material";
import axios from "axios";
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
            .get("http://localhost:5000/api/blogs") // Adjust API as needed
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
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
                        Use of Biomed Products
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            {
                                title: "The Terra Program",
                                description:
                                    "TYSC4, TYSC8, TYTL8, TYLL8",
                            },
                            {
                                title: "Secure A Sharp Program",
                                description:
                                    "",
                            },
                            {
                                title: "Barcode Scanner",
                                description:
                                    "",
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
