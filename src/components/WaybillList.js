import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
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
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const WaybillList = () => {
    const [groupedWaybills, setGroupedWaybills] = useState({});
    const [facilityDetails, setFacilityDetails] = useState({});
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [openPreview, setOpenPreview] = useState(false);
    const [currentWaybill, setCurrentWaybill] = useState(null);
    const [expandedFacility, setExpandedFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
            const currentUserId = currentUserSession.id ? currentUserSession.id : currentUserSession._id;

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
                const waybillData = {};
                for (const facility of selectedFacilities) {
                    try {
                        const waybillResponse = await axios.get(`${API_BASE_URL}/waybill/${facility}`)
                        waybillData[facility] = waybillResponse.data;
                    } catch (error) {
                        console.error(`Error fetching data for facility: ${facility}`, error);
                    }
                }
                setGroupedWaybills(waybillData);
            } catch (error) {
                console.error("Error fetching waybills or facilities:", error);
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
        <Box sx={{
            background: "linear-gradient(to right,rgb(226, 237, 240),rgb(222, 233, 247))",
            minHeight: "100vh",
            py: 5,
            display: "flex",
            flexDirection: "column",
        }}>
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
                    <CardHeader
                        title={<Typography variant="h5" color="#092C74" sx={{ fontWeight: "bold" }}>Waybills</Typography>}
                    />
                    <CardContent>
                        {loading ? (
                            <Typography variant="body2" color="textSecondary" align="center">Loading waybills...</Typography>
                        ) : selectedFacilities.length > 0 ? (
                            selectedFacilities.map((facility) => (
                                <Paper key={facility} sx={{ mb: 2, p: 2, boxShadow: 3 }}>
                                    <Typography
                                        variant="h6"
                                        color="#092C74"
                                        onClick={() => toggleFacility(facility)}
                                        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                    >
                                        <ExpandMoreIcon sx={{ transform: expandedFacility === facility ? "rotate(180deg)" : "rotate(0deg)" }} />
                                        {facilityDetails[facility]?.name || facility}
                                    </Typography>
                                    <Collapse in={expandedFacility === facility} timeout="auto" unmountOnExit>
                                        <TableContainer component={Paper} sx={{ boxShadow: 2, mt: 1 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                                        <TableCell><strong>File Name</strong></TableCell>
                                                        <TableCell><strong>Preview</strong></TableCell>
                                                        <TableCell><strong>Download</strong></TableCell>
                                                        <TableCell><strong>Uploaded At</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {groupedWaybills[facility]?.length > 0 ? (
                                                        groupedWaybills[facility].map((waybill) => (
                                                            <TableRow key={waybill._id} hover>
                                                                <TableCell>{waybill.fileName}</TableCell>
                                                                <TableCell>
                                                                    <IconButton color="primary" onClick={() => handlePreviewOpen(waybill)}>
                                                                        <VisibilityIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IconButton
                                                                        color="success"
                                                                        component="a"
                                                                        href={`${API_BASE_URL}/waybills/${waybill.fileName}`}
                                                                        download
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <DownloadIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell>{new Date(waybill.uploadedAt).toLocaleString()}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="center">
                                                                <Typography variant="body2" color="textSecondary">No Waybills available.</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Collapse>
                                </Paper>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary" align="center">No waybills available.</Typography>
                        )}
                    </CardContent>

                    {/* Dialog for PDF Preview */}
                    <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
                        <DialogTitle>Waybill Preview</DialogTitle>
                        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                            {currentWaybill && (
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={`${API_BASE_URL}/waybills/${currentWaybill.fileName}`} />
                                </Worker>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePreviewClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Card>
            </Container>
        </Box>
    );
};

export default WaybillList;
