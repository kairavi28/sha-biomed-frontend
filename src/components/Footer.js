import React from "react";
import { Box, Container, Grid, Typography, Button, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import biomedLogo from "../assets/images/logo.png";

function Footer() {
    return (
        <Box sx={{ backgroundColor: "#0D2477", py: { xs: 4, md: 6 }, mt: "auto" }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ mb: 2 }}>
                            <img src={biomedLogo} alt="Biomed Logo" style={{ height: 50 }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                            Address:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, fontSize: "0.85rem" }}>
                            105 Industrial Drive
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, fontSize: "0.85rem" }}>
                            P.O. Box 334
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, fontSize: "0.85rem" }}>
                            Aberdeen, SK, CANADA
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2, fontSize: "0.85rem" }}>
                            S0K 0A0
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                            Contact:
                        </Typography>
                        <Link href="tel:1-866-288-3298" sx={{ color: "#D9DE38", textDecoration: "underline", display: "block", mb: 0.5, fontSize: "0.85rem" }}>
                            1-866-288-3298
                        </Link>
                        <Link href="mailto:support@biomedwaste.com" sx={{ color: "#D9DE38", textDecoration: "underline", display: "block", mb: 2, fontSize: "0.85rem" }}>
                            support@biomedwaste.com
                        </Link>
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Link href="#" sx={{ color: "#D9DE38" }}><FacebookIcon sx={{ fontSize: 20 }} /></Link>
                            <Link href="#" sx={{ color: "#D9DE38" }}><InstagramIcon sx={{ fontSize: 20 }} /></Link>
                            <Link href="#" sx={{ color: "#D9DE38" }}><XIcon sx={{ fontSize: 20 }} /></Link>
                            <Link href="#" sx={{ color: "#D9DE38" }}><LinkedInIcon sx={{ fontSize: 20 }} /></Link>
                            <Link href="#" sx={{ color: "#D9DE38" }}><YouTubeIcon sx={{ fontSize: 20 }} /></Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 2, textDecoration: "underline" }}>
                            Complaint Services
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 2, textDecoration: "underline" }}>
                            Waste Packing Guide
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 3, textDecoration: "underline" }}>
                            Resources
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#D9DE38",
                                color: "#D9DE38",
                                borderRadius: "25px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                "&:hover": {
                                    borderColor: "#D9DE38",
                                    background: "rgba(217,222,56,0.1)",
                                },
                            }}
                        >
                            Request Free Quote
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Biomed Plant Operations / Reception
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                        306-253-4476
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Biomed Accounting
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                        306-253-4474 ( Ex: 110)
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Sales and Services
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                        306-253-4479 ( Ex: 108)
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Toll Free
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                        1-866-288-3298
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        mt: 4,
                        pt: 3,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "center", md: "center" },
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
                        © 2025 Biomed Waste Recovery and Disposal Ltd. All rights reserved.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3 }}>
                        <Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.8rem", "&:hover": { color: "#D9DE38" } }}>
                            Privacy Policy
                        </Link>
                        <Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.8rem", "&:hover": { color: "#D9DE38" } }}>
                            Terms of Service
                        </Link>
                        <Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.8rem", "&:hover": { color: "#D9DE38" } }}>
                            Cookies Settings
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
