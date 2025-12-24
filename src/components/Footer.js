import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import biomedLogo from "../assets/images/logo.png";

function Footer() {
    return (
        <Box sx={{ backgroundColor: "#0D2477", mt: "auto" }}>
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <img src={biomedLogo} alt="Biomed Logo" style={{ height: 55 }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                            Address:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.25, fontSize: "0.85rem" }}>
                            105 Industrial Drive
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.25, fontSize: "0.85rem" }}>
                            P.O. Box 334
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.25, fontSize: "0.85rem" }}>
                            Aberdeen, SK, CANADA
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2.5, fontSize: "0.85rem" }}>
                            S0K 0A0
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                            Contact:
                        </Typography>
                        <Link href="tel:1-866-288-3298" sx={{ color: "#D9DE38", textDecoration: "underline", display: "block", mb: 0.5, fontSize: "0.85rem" }}>
                            1-866-288-3298
                        </Link>
                        <Link href="mailto:support@biomedwaste.com" sx={{ color: "#D9DE38", textDecoration: "underline", display: "block", mb: 3, fontSize: "0.85rem" }}>
                            support@biomedwaste.com
                        </Link>
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Link href="https://ca.linkedin.com/company/biomed-recovery-disposal-ltd" sx={{ color: "#fff", "&:hover": { color: "#D9DE38" } }}><LinkedInIcon sx={{ fontSize: 22 }} /></Link>
                            <Link href="https://www.youtube.com/@Biomed-Recovery-and-Disposal" sx={{ color: "#fff", "&:hover": { color: "#D9DE38" } }}><YouTubeIcon sx={{ fontSize: 22 }} /></Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "center" } }}>
                        <Box>
                            <Link href="/services" sx={{ color: "#fff", textDecoration: "underline", display: "block", mb: 2, fontSize: "0.9rem", fontWeight: 500 }}>
                                Complaint Services
                            </Link>
                            <Link href="/instruction" sx={{ color: "#fff", textDecoration: "underline", display: "block", mb: 2, fontSize: "0.9rem", fontWeight: 500 }}>
                                Waste Packing Guide
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.25 }} />
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
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.25 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Biomed Accounting
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                        306-253-4476 ( Ex: 110)
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.25 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Sales and Services
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                        306-253-4476 ( Ex: 108)
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                <PhoneIcon sx={{ color: "#D9DE38", fontSize: 20, mt: 0.25 }} />
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
            </Container>

            <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            py: 2.5,
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", textAlign: { xs: "center", md: "left" } }}>
                            © 2025 Biomed Recovery and Disposal Ltd. All rights reserved.
                        </Typography>
                        <Box sx={{ display: "flex", gap: { xs: 2, md: 4 }, flexWrap: "wrap", justifyContent: "center" }}>
                            <Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", fontSize: "0.8rem", "&:hover": { color: "#D9DE38" } }}>
                                Privacy Policy
                            </Link>
                            <Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", fontSize: "0.8rem", "&:hover": { color: "#D9DE38" } }}>
                                Terms of Service
                            </Link>
                            <Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", fontSize: "0.8rem", "&:hover": { color: "#D9DE38" } }}>
                                Cookies Settings
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default Footer;
