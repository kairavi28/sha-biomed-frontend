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
import bgWaste from '../assets/images/bg-waste.png';
import CallToAction from "./CallToAction";

const products = [
    {
        title: "TERRA",
        videoId: "3n-CkW5SDE0",
        description: [
            "TYSC4 | TYSC8 | TCTL8 | TCLL8",
            "Our Terra Program provides a range of containers specifically designed for the safe disposal of sharps. Ideal for:",
        ],
        features: ["Healthcare facilities", "Veterinary clinics", "Medical and dental practices"],
        warning: "Avoid placing large quantities of liquid, large knives, anatomical waste, batteries, and drug paraphernalia in Terra containers."
    },
    {
        title: "BioBoxes",
        videoId: "45g5oPvlmq8",
        description: [
            "76-Litre BioBox™ Fibreboard General Waste Container (RWBW76)",
            "Our Bioboxes Program offers safe storage and transportation of biomedical waste, designed for various healthcare institutions.",
        ],
        features: ["Hospitals", "Pharmacies", "Research laboratories"],
        warning: "Do not dispose of non-medical waste, chemical waste, or radioactive materials in Bioboxes."
    },
    {
        title: "SHARPS",
        videoId: "UJ5bVZ8x3O8",
        description: [
            "SHARPS | Secure-A-Sharp®",
            "Our Bioboxes Program offers safe storage and transportation of biomedical waste, designed for various healthcare institutions.",
        ],
        features: ["Hospitals", "Pharmacies", "Research laboratories"],
        warning: "Do not dispose of non-medical waste, chemical waste, or radioactive materials in Bioboxes."
    },
    {
        title: "TERRA",
        videoId: "_YvEAe0FZgM",
        description: [
            "TYSC40 | TYSC68",
            "Our Bioboxes Program offers safe storage and transportation of biomedical waste, designed for various healthcare institutions.",
        ],
        features: ["Hospitals", "Pharmacies", "Research laboratories"],
        warning: "Do not dispose of non-medical waste, chemical waste, or radioactive materials in Bioboxes."
    }

];

function InstructionPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/blogs`)
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
                component={motion.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                sx={{
                    height: "50vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `url(${bgWaste})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "center",
                    color: "#003366",
                }}
            >
                <Container
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                >
                    <Typography variant="h3" fontWeight="bold">
                        Waste Packaging Guide
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ mt: 2, mb: 4 }}
                        component={motion.p}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        Proper waste packaging ensures a safer and more efficient disposal process.
                    </Typography>
                </Container>
            </Box>

            {/* Steps to Package Waste Properly */}
            <Box sx={{ py: 8, backgroundColor: "#f9f9f9" }}>
                <Container>
                    <Typography variant="h4" align="center" color="#003366" fontWeight="bold" sx={{ mb: 4 }}>
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

            <Box sx={{ py: 6, backgroundColor: "#f9f9f9" }}>
                <Container>
                    <Typography
                        variant="h4"
                        align="center"
                        fontWeight="bold"
                        color="#003366"
                        sx={{ mb: 4, textTransform: "uppercase", letterSpacing: 1 }}
                    >
                        Use of Biomed Products
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {products.map((product, index) => (
                            <Grid item xs={12} sm={6} md={6} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Paper
                                        elevation={6}
                                        sx={{
                                            p: 4,
                                            textAlign: "center",
                                            borderRadius: 3,
                                            background: "linear-gradient(135deg, #ffffff, #e3eaf5)",
                                            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                                boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.25)",
                                            },
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#002147" }}>
                                            {product.title}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }}>
                                            {product.description.map((text, i) => (
                                                <Typography key={i} variant="body1" paragraph sx={{ color: "#444" }}>
                                                    {text}
                                                </Typography>
                                            ))}
                                            <Box component="ul" sx={{ listStyle: "none", pl: 0, textAlign: "left", mt: 2 }}>
                                                {product.features.map((feature, i) => (
                                                    <li key={i}>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{ display: "flex", alignItems: "center", gap: 1, color: "#003366" }}
                                                        >
                                                            <CheckCircleIcon color="primary" />
                                                            {feature}
                                                        </Typography>
                                                    </li>
                                                ))}
                                            </Box>
                                        </Box>
                                        <Box sx={{ mt: 3, p: 2, border: "1px solid #d32f2f", borderRadius: 2, backgroundColor: "#ffebee" }}>
                                            <Typography variant="body1" sx={{ color: "error.main", fontWeight: "bold" }}>
                                                Important Reminder
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#a00" }}>
                                                {product.warning}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", borderRadius: 2, overflow: "hidden" }}>
                                            <YouTube
                                                videoId={product.videoId}
                                                opts={{
                                                    height: "200",
                                                    width: "100%",
                                                    playerVars: { autoplay: 0 },
                                                }}
                                            />
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>



            {/* Waste Management Tips Section */}
            {/* <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
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
            </Box> */}

            {/* FAQ Section */}
            <CallToAction />

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
