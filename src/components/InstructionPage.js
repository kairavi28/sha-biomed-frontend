import React from "react";
import YouTube from "react-youtube";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InventoryIcon from "@mui/icons-material/Inventory";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { motion } from "framer-motion";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import Footer from "./Footer";

const heroFeatures = [
    { icon: <InventoryIcon sx={{ fontSize: 30, color: "#D9DE38" }} />, title: "Proper Containers", subtitle: "Select appropriate waste containers" },
    { icon: <VerifiedUserIcon sx={{ fontSize: 30, color: "#D9DE38" }} />, title: "Compliance", subtitle: "Meet regulatory requirements" },
    { icon: <SecurityIcon sx={{ fontSize: 30, color: "#D9DE38" }} />, title: "Safety First", subtitle: "Protect your team and environment" },
    { icon: <LocalShippingIcon sx={{ fontSize: 30, color: "#D9DE38" }} />, title: "Easy Disposal", subtitle: "Streamlined pickup process" },
];

const steps = [
    {
        number: "1",
        title: "Choose the Right Container",
        description: "Select a sturdy container suitable for the type of waste you are disposing of. Consider the container material and size.",
        icon: <InventoryIcon sx={{ fontSize: 28, color: "#ccc" }} />
    },
    {
        number: "2",
        title: "Secure the Waste Properly",
        description: "Wrap waste material in plastic or other suitable materials to prevent leakage. Ensure all items are securely packed for added protection.",
        icon: <LockOutlinedIcon sx={{ fontSize: 28, color: "#ccc" }} />
    },
    {
        number: "3",
        title: "Label the Container",
        description: "Clearly label containers with appropriate waste type, biohazard, biohazard label or contents and handling advice. Ensure all labels are securely attached.",
        icon: <SellOutlinedIcon sx={{ fontSize: 28, color: "#ccc" }} />
    },
];

const products = [
    {
        title: "TERRA",
        subtitle: "TYSC4 | TYSC8 || TCTL8 |TCLL8",
        videoId: "3n-CkW5SDE0",
        description: "Our Terra Program provides a range of containers specifically designed for the safe disposal of sharps. Ideal for:",
        features: ["Healthcare facilities", "Veterinary clinics", "Medical and dental practices"],
        warning: "Avoid placing large quantities of liquid, large knives, anatomical waste, batteries, and drug paraphernalia in Terra containers."
    },
    {
        title: "BioBoxes",
        subtitle: "76-Litre BioBox™ Fibreboard General Waste Container (RWBW76)",
        videoId: "45g5oPvlmq8",
        description: "Our Bioboxes Program offers safe storage and transportation of biomedical waste, designed for various healthcare institutions.",
        features: ["Healthcare facilities", "Pharmacies", "Research laboratories"],
        warning: "Do not dispose of non-medical waste, chemical waste, or radioactive materials in Bioboxes."
    },
    {
        title: "SHARPS",
        subtitle: "SHARPS | Secure-A-Sharp®",
        videoId: "UJ5bVZ8x3O8",
        description: "Our Secure-A-Sharp Program offers safe storage and transportation of biomedical waste, designed for various healthcare institutions.",
        features: ["Hospitals", "Pharmacies", "Research laboratories"],
        warning: "Dispose of used sharps (needles, syringes, lancets, etc.) only in the designated puncture-resistant sharps container."
    },
    {
        title: "TERRA",
        subtitle: "TYSC40 | TYSC68",
        videoId: "_YvEAe0FZgM",
        description: "Our Terra Program provides a range of containers specifically designed for the safe disposal of sharps. Ideal for:",
        features: ["Hospitals", "Pharmacies", "Research laboratories"],
        warning: "Avoid placing large quantities of liquid, large knives, anatomical waste, batteries, and drug paraphernalia in Terra containers."
    }
];

function InstructionPage() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#fff" }}>
            {/* Hero Section */}
            <Box component={motion.div} sx={{
                backgroundColor: "#0D2477",
                mt: { xs: "100px", md: "110px" },
                py: { xs: 10, md: 12 },
                px: { xs: 2, md: 4 }
            }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: "#fff",
                                    mb: 2,
                                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" }
                                }}
                            >
                                Waste Packaging Guide
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "rgba(255,255,255,0.7)",
                                    mb: 3,
                                    fontSize: { xs: "0.9rem", md: "1rem" },
                                    maxWidth: 400,
                                    lineHeight: 1.6
                                }}
                            >
                                Proper waste packaging ensures a safer and more efficient disposal process.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#D9DE38",
                                    color: "#1a2744",
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    borderRadius: "25px",
                                    textTransform: "none",
                                    fontSize: "0.9rem",
                                    "&:hover": {
                                        backgroundColor: "#c5ca2e",
                                    },
                                }}
                            >
                                Download Guide
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={{ xs: 2, md: 3 }}>
                                {heroFeatures.map((feature, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ 
                                                duration: 0.6, 
                                                delay: 0.3 + index * 0.15,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                            style={{ height: "85%" }}
                                        >
                                            <Box
                                                sx={{
                                                    backgroundColor: "#1a3a8f",
                                                    borderRadius: "16px",
                                                    p: { xs: 1, md: 3 },
                                                    height: "85%",
                                                    minHeight: { xs: "auto", md: 80 },
                                                    display: "flex",
                                                    flexDirection: { xs: "row", md: "column" },
                                                    alignItems: { xs: "center", md: "flex-start" },
                                                    gap: { xs: 2, md: 0 },
                                                    mt: { 
                                                        xs: 0, 
                                                        md: index % 2 === 1 ? 3 : 0 
                                                    },
                                                }}
                                            >
                                                <Box sx={{ mb: { xs: 0, md: 1 }, flexShrink: 0 }}>
                                                    {feature.icon}
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600, color: "#fff", fontSize: { xs: "0.9rem", md: "0.95rem" }, lineHeight: 1.3 }}
                                                    >
                                                        {feature.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: "0.75rem", md: "0.75rem" }, lineHeight: 1.4, display: "block" }}
                                                    >
                                                        {feature.subtitle}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Steps Section */}
            <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: "#FDFBF5" }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1a2744",
                                    mb: 1,
                                    fontSize: { xs: "1.5rem", md: "2rem" }
                                }}
                            >
                                Steps for Proper Waste Packaging
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#1A1A1A",
                                    mt: 2,
                                    maxWidth: 650,
                                    mx: "auto",
                                    px: { xs: 1, md: 0 },
                                    fontSize: { xs: "0.9rem", md: "1.0rem" },
                                    fontWeight: "bold"
                                }}
                            >
                                Follow these three essential steps to ensure safe and compliant waste disposal
                            </Typography>
                        </Box>
                    </motion.div>

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{ height: "100%" }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 3, md: 3 },
                                            borderRadius: 10,
                                            border: "2px solid #D9DE38",
                                            height: "90%",
                                            background: "#fff",
                                            position: "relative",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                                            <Box
                                                sx={{
                                                    width: { xs: 45, md: 50 },
                                                    height: { xs: 45, md: 50 },
                                                    borderRadius: "2em",
                                                    background: "#D9DE38",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{ color: "#0D2477", fontWeight: 700, fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                                                >
                                                    {step.number}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ color: "#ccc" }}>
                                                {step.icon}
                                            </Box>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#0D2477",
                                                mb: 1.5,
                                                fontSize: { xs: "1rem", md: "1.1rem" }
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#666", lineHeight: 1.7, fontSize: { xs: "0.85rem", md: "0.9rem" } }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>


            {/* Biomed Product Solutions Section */}
            <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#fff" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "#1a2744",
                                mb: 2,
                                fontSize: { xs: "1.5rem", md: "2rem" }
                            }}
                        >
                            Biomed Product Solutions
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#1A1A1A",
                                mt: 2,
                                maxWidth: 750,
                                mx: "auto",
                                px: { xs: 1, md: 0 },
                                fontSize: { xs: "0.9rem", md: "1.0rem" },
                                fontWeight: "bold"
                            }}
                        >
                            Comprehensive range of waste disposal products designed for safety and efficiency
                        </Typography>
                    </Box>

                    <Grid container spacing={{ xs: 2, md: 2 }}>
                        {products.map((product, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{ height: "90%" }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2.5, md: 3 },
                                            borderRadius: 3,
                                            border: "2px solid #D9DE38",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, color: "#1a2744", mb: 0.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                                        >
                                            {product.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#666", mb: 2, fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                                        >
                                            {product.subtitle}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#444", mb: 2, fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                                        >
                                            {product.description}
                                        </Typography>

                                        <Box sx={{ mb: 2 }}>
                                            {product.features.map((feature, i) => (
                                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                    <CheckCircleIcon sx={{ color: "#D9DE38", fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: "#1a2744", fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        {/* Video Placeholder */}
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: { xs: 150, md: 180 },
                                                backgroundColor: "#1a2744",
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: 2,
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(255,255,255,0.2)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255,255,255,0.3)",
                                                    },
                                                }}
                                            >
                                                <PlayArrowIcon sx={{ color: "#fff", fontSize: 30 }} />
                                            </Box>
                                        </Box>

                                        {/* Warning Box */}
                                        {/* Warning Box */}
                                        <Box
                                            sx={{
                                                p: { xs: 2, md: 2.5 },
                                                backgroundColor: "#FFF5F5",
                                                borderRadius: 3,
                                                mt: "auto",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                                <WarningAmberIcon sx={{ color: "#DC2626", fontSize: 22, mt: 0.3 }} />
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600, color: "#DC2626", fontSize: { xs: "0.85rem", md: "0.9rem" }, mb: 0.5 }}
                                                    >
                                                        Important Reminder
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: "#444", fontSize: { xs: "0.8rem", md: "0.85rem" }, lineHeight: 1.6 }}
                                                    >
                                                        {product.warning}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Footer />
        </Box>
    );
}

export default InstructionPage;
