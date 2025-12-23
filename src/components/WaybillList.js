import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    IconButton,
    Dialog,
    Container,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Collapse,
    Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PersonPinCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

const WaybillList = () => {
    const navigate = useNavigate();
    const [groupedWaybills, setGroupedWaybills] = useState({});
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [openPreview, setOpenPreview] = useState(false);
    const [currentWaybill, setCurrentWaybill] = useState(null);
    const [expandedFacility, setExpandedFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
            const currentUserId = currentUserSession?.id ? currentUserSession.id : currentUserSession?._id;

            if (!currentUserId) {
                console.error("User ID is undefined");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/user/${currentUserId}`);
                const approvedFacilities = response.data?.facilities
                    .filter(facility => facility.approved)
                    .map(facility => facility.name) || [];
                setSelectedFacilities(approvedFacilities);
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (selectedFacilities.length === 0) {
            console.warn("selectedFacilities is empty, skipping waybill fetch");
            return;
        }

        const fetchWaybills = async () => {
            try {
                const requests = selectedFacilities.map(facility =>
                    axios.get(`${API_BASE_URL}/waybill/${facility}`)
                        .then(res => ({ facility, data: res.data }))
                        .catch(err => {
                            console.error(`Error fetching data for facility: ${facility}`, err);
                            return { facility, data: [] };
                        })
                );
                const results = await Promise.all(requests);
                const waybillData = results.reduce((acc, { facility, data }) => {
                    acc[facility] = data;
                    return acc;
                }, {});
                setGroupedWaybills(waybillData);
            } catch (error) {
                console.error("Error fetching waybills:", error);
            }
        };
        fetchWaybills();
    }, [selectedFacilities]);

    const handlePreviewOpen = (waybill) => {
        setCurrentWaybill(waybill);
        setOpenPreview(true);
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
    };

    const toggleFacility = (facility) => {
        setExpandedFacility(expandedFacility === facility ? null : facility);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f5f5f5" }}>
            <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: { xs: 6, md: 8 }, flex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #e0e0e0",
                            p: { xs: 3, md: 4 },
                            background: "#fff",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "#0D2477",
                                mb: 3,
                                fontSize: { xs: "1.5rem", md: "1.75rem" }
                            }}
                        >
                            Waybills
                        </Typography>

                        {loading ? (
                            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                                Loading waybills...
                            </Typography>
                        ) : selectedFacilities.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 6 }}>
                                <PersonPinCircle sx={{ fontSize: 60, color: "#0D2477", mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a2744", mb: 1 }}>
                                    No Facilities Selected
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666", mb: 3, maxWidth: 400, mx: "auto" }}>
                                    No facility has been selected. Please navigate to your profile section to add facilities.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#0D2477",
                                        "&:hover": { backgroundColor: "#092058" },
                                        textTransform: "none",
                                        px: 4,
                                        py: 1,
                                        borderRadius: "25px",
                                        fontWeight: 600,
                                    }}
                                    onClick={() => navigate("/profile")}
                                >
                                    Go to Profile
                                </Button>
                            </Box>
                        ) : (
                            selectedFacilities.map((facility, index) => (
                                <motion.div
                                    key={facility}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Box sx={{ mb: 2 }}>
                                        <Box
                                            onClick={() => toggleFacility(facility)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                py: 1.5,
                                                "&:hover": { opacity: 0.8 },
                                            }}
                                        >
                                            <ExpandMoreIcon
                                                sx={{
                                                    color: "#1a2744",
                                                    transform: expandedFacility === facility ? "rotate(180deg)" : "rotate(0deg)",
                                                    transition: "transform 0.3s ease",
                                                    mr: 1,
                                                }}
                                            />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: "#1a2744",
                                                    fontSize: { xs: "0.95rem", md: "1rem" }
                                                }}
                                            >
                                                {facility}
                                            </Typography>
                                        </Box>

                                        <Collapse in={expandedFacility === facility} timeout="auto" unmountOnExit>
                                            <TableContainer sx={{ mt: 1 }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
                                                            <TableCell sx={{ fontWeight: 600, color: "#0D2477", fontSize: "0.9rem", py: 2 }}>
                                                                Waybill Number
                                                            </TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 600, color: "#0D2477", fontSize: "0.9rem", py: 2 }}>
                                                                Preview
                                                            </TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 600, color: "#0D2477", fontSize: "0.9rem", py: 2 }}>
                                                                Download
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 600, color: "#0D2477", fontSize: "0.9rem", py: 2 }}>
                                                                Uploaded At
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {groupedWaybills[facility]?.length > 0 ? (
                                                            groupedWaybills[facility].map((waybill) => (
                                                                <TableRow
                                                                    key={waybill._id}
                                                                    sx={{
                                                                        borderBottom: "1px solid #f0f0f0",
                                                                        "&:hover": { backgroundColor: "#fafafa" },
                                                                    }}
                                                                >
                                                                    <TableCell sx={{ py: 2.5 }}>
                                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                                            <DescriptionOutlinedIcon sx={{ color: "#999", fontSize: 20 }} />
                                                                            <Typography variant="body2" sx={{ color: "#1a2744", fontWeight: 500 }}>
                                                                                {waybill.fileName}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ py: 2.5 }}>
                                                                        <IconButton
                                                                            onClick={() => handlePreviewOpen(waybill)}
                                                                            sx={{
                                                                                color: "#0D2477",
                                                                                "&:hover": { backgroundColor: "rgba(13, 36, 119, 0.08)" }
                                                                            }}
                                                                        >
                                                                            <VisibilityIcon sx={{ fontSize: 22 }} />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ py: 2.5 }}>
                                                                        <IconButton
                                                                            component="a"
                                                                            href={`${API_BASE_URL}/waybills/${waybill.fileName}`}
                                                                            download
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            sx={{
                                                                                color: "#2E7D32",
                                                                                "&:hover": { backgroundColor: "rgba(46, 125, 50, 0.08)" }
                                                                            }}
                                                                        >
                                                                            <DownloadIcon sx={{ fontSize: 22 }} />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell align="right" sx={{ py: 2.5 }}>
                                                                        <Typography variant="body2" sx={{ color: "#666" }}>
                                                                            {new Date(waybill.uploadedAt).toLocaleString()}
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        No Waybills available.
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Collapse>
                                    </Box>
                                </motion.div>
                            ))
                        )}
                    </Paper>
                </motion.div>

                <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: 600, color: "#1a2744" }}>Waybill Preview</DialogTitle>
                    <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                        {currentWaybill && (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer fileUrl={`${API_BASE_URL}/waybills/${currentWaybill.fileName}`} />
                            </Worker>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handlePreviewClose}
                            sx={{ color: "#0D2477", fontWeight: 600, textTransform: "none" }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

            <Footer />
        </Box>
    );
};

export default WaybillList;
