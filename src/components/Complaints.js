import React, { useState, useEffect } from "react";
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
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Card,
    CardContent,
    IconButton
} from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Footer from "./Footer";
import ComplaintModal from "./ComplaintModal";

const dataURLToFile = (dataURL, filename) => {
    const [header, base64String] = dataURL.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64String);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new File([new Uint8Array(array)], filename, { type: mime });
};

function Complaints() {
    const [issues, setIssues] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [complaintModalOpen, setComplaintModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));

    const [formData, setFormData] = useState({
        productType: "",
        description: "",
        photos: []
    });

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const productTypes = [
        "Carson Sharps Container(s)",
        "Needle Drop-Box(s)",
        "Terra Container(s)",
        "Red Anatomical Pail(s)",
        "Blue Plastic Drum(s)",
        "Yello Biohazard Pail(s)",
        "While Glass Only Pail(s)",
        "Biobox Fibreboard Container(s)",
        "Lid(s)",
        "Other"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const currentUserId = currentUserSession?.id || currentUserSession?._id;
                if (!currentUserId) {
                    console.error("User ID is undefined.");
                    setLoading(false);
                    return;
                }

                const userResponse = await axios.get(`${API_BASE_URL}/user/${currentUserId}`);
                const userDataFromDB = userResponse.data;
                setUserData(userDataFromDB);

                const complaintsResponse = await axios.get(`${API_BASE_URL}/complaints`);

                if (Array.isArray(userDataFromDB?.facilities) && userDataFromDB.facilities.length > 0) {
                    const userFacilityNames = userDataFromDB.facilities
                        .filter(facility => facility.approved)
                        .map(facility => facility.name);

                    if (userFacilityNames.length === 0) {
                        console.warn("No approved facilities found.");
                        setIssues([]);
                        setLoading(false);
                        return;
                    }

                    const filteredComplaints = complaintsResponse.data.filter(
                        (complaint) => userFacilityNames.includes(complaint.facility)
                    );

                    setIssues(filteredComplaints);

                    const pending = filteredComplaints.filter(c => c.status === 'pending').length;
                    const resolved = filteredComplaints.filter(c => c.status === 'resolved').length;
                    setStats({
                        total: filteredComplaints.length,
                        pending: pending,
                        resolved: resolved
                    });
                } else {
                    console.warn("User has no assigned facilities.");
                    setIssues([]);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load issues. Please try again.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!formData.productType || !formData.description) {
            setSnackbar({
                open: true,
                message: "Please fill out all required fields.",
                severity: "error",
            });
            return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("productType", formData.productType);
        formDataToSubmit.append("description", formData.description);

        if (formData.photos && formData.photos.length > 0) {
            formData.photos.forEach((photo, index) => {
                const photoFile = photo.file instanceof File
                    ? photo.file
                    : dataURLToFile(photo.preview, `photo-${index}.jpg`);
                formDataToSubmit.append("photos", photoFile);
            });
        }

        try {
            setIsSubmitting(true);
            await axios.post(`${API_BASE_URL}/issues/add`, formDataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSnackbar({
                open: true,
                message: "Issue has been successfully submitted!",
                severity: "success",
            });
            setFormData({ productType: "", description: "", photos: [] });
            localStorage.removeItem("formData");
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error submitting the issue. Please try again.",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => {
            const updatedForm = { ...prev, [name]: value };
            localStorage.setItem("formData", JSON.stringify(updatedForm));
            return updatedForm;
        });
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const previews = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve({ file, preview: reader.result });
            });
        });

        Promise.all(previews).then((uploadedImages) => {
            setFormData((prev) => {
                const updatedForm = {
                    ...prev,
                    photos: [...(prev.photos || []), ...uploadedImages],
                };
                localStorage.setItem("formData", JSON.stringify(updatedForm));
                return updatedForm;
            });
        });
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const updatedPhotos = [...prev.photos];
            updatedPhotos.splice(index, 1);
            const updatedForm = { ...prev, photos: updatedPhotos };
            localStorage.setItem("formData", JSON.stringify(updatedForm));
            return updatedForm;
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleViewDetails = (issue) => {
        if (!issue) return;
        setSelectedIssue({
            ...issue,
            photos: Array.isArray(issue.photos) ? issue.photos : [issue.photos],
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedIssue(null);
    };

    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem("formData"));
        if (savedFormData) {
            setFormData(savedFormData);
        }
    }, []);

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

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#fff" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "#0D2477",
                    mt: { xs: "100px", md: "110px" },
                    py: { xs: 10, md: 12 },
                    px: { xs: 2, md: 4 },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        sx={{ maxWidth: { xs: "100%", md: "50%" } }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: { xs: "1.75rem", sm: "1.7rem", md: "2.2rem" },
                                mb: 2,
                            }}
                        >
                            Welcome to Our Complaint Portal
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                fontSize: { xs: "0.9rem", md: "1rem" },
                                mb: 3,
                                maxWidth: "400px",
                            }}
                        >
                            If you have any concerns or complaints, please let us know. Click the button below to file a complaint.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                background: "#D9DE38",
                                color: "#1a2744",
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: "25px",
                                textTransform: "none",
                                fontSize: "0.9rem",
                                "&:hover": {
                                    background: "#c5ca2e",
                                },
                            }}
                            onClick={() => setComplaintModalOpen(true)}
                        >
                            File a Complaint
                        </Button>
                    </Box>
                </Container>
            </Box>

              {/* Stats Section */}
            <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: { xs: 2, md: 3 },
                        p: { xs: 2, sm: 2.5, md: 3 },
                        background: "#fff",
                        border: { xs: "2px solid #D9DE38", md: "none" },
                    }}
                >
                    <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: { xs: "flex-start", md: "flex-start" }, 
                                gap: { xs: 2, md: 2 },
                            }}>
                                <Box
                                    sx={{
                                        width: { xs: 50, md: 50 },
                                        height: { xs: 50, md: 50 },
                                        borderRadius: { xs: "12px", md: "50%" },
                                        background: "#1a2744",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <DescriptionIcon sx={{ color: "#fff", fontSize: { xs: 24, md: 24 } }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#666", fontSize: { xs: "0.85rem", md: "0.85rem" } }}>
                                        Total Complaints
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a2744", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                                        {stats.total}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: { xs: "flex-start", md: "flex-start" }, 
                                gap: { xs: 2, md: 2 },
                            }}>
                                <Box
                                    sx={{
                                        width: { xs: 50, md: 50 },
                                        height: { xs: 50, md: 50 },
                                        borderRadius: { xs: "12px", md: "50%" },
                                        background: "#D9DE38",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <AccessTimeIcon sx={{ color: "#1a2744", fontSize: { xs: 24, md: 24 } }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#666", fontSize: { xs: "0.85rem", md: "0.85rem" } }}>
                                        Pending
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a2744", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                                        {stats.pending}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: { xs: "flex-start", md: "flex-start" }, 
                                gap: { xs: 2, md: 2 },
                            }}>
                                <Box
                                    sx={{
                                        width: { xs: 50, md: 50 },
                                        height: { xs: 50, md: 50 },
                                        borderRadius: { xs: "12px", md: "50%" },
                                        background: "#4CAF50",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <CheckCircleIcon sx={{ color: "#fff", fontSize: { xs: 24, md: 24 } }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#666", fontSize: { xs: "0.85rem", md: "0.85rem" } }}>
                                        Resolved
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a2744", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                                        {stats.resolved}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* Report Form Section */}
            <Container maxWidth="lg" sx={{ py: 6 }} id="report-form">
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#1a2744",
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            mb: 1,
                        }}
                    >
                        Report an Issue for Damaged Container
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        Help us track and resolve container damage issues
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: 600,
                        mx: "auto",
                        p: { xs: 3, md: 4 },
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#1a2744" }}>
                                    Product Type <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleInputChange}
                                    placeholder="Select product type"
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            background: "#f9f9f9",
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select product type
                                    </MenuItem>
                                    {productTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#1a2744" }}>
                                    Description <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the damage..."
                                    size="small"
                                    multiline
                                    rows={1}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            background: "#f9f9f9",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#1a2744" }}>
                                    Upload Photos
                                </Typography>
                                <Box
                                    sx={{
                                        border: "2px dashed #e0e0e0",
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        background: "#fafafa",
                                        transition: "border-color 0.3s",
                                        "&:hover": {
                                            borderColor: "#ABB738",
                                        },
                                    }}
                                    onClick={() => document.getElementById("photo-upload").click()}
                                >
                                    <input
                                        type="file"
                                        id="photo-upload"
                                        multiple
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                    <CloudUploadIcon sx={{ fontSize: 32, color: "#999", mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                        Click to upload photos
                                    </Typography>
                                </Box>

                                {formData.photos && formData.photos.length > 0 && (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                                        {formData.photos.map((photo, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: "relative",
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <img
                                                    src={photo.preview}
                                                    alt={`Preview ${index}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 2,
                                                        right: 2,
                                                        background: "rgba(0,0,0,0.5)",
                                                        color: "#fff",
                                                        p: 0.5,
                                                        "&:hover": { background: "rgba(0,0,0,0.7)" },
                                                    }}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <CloseIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{
                                        background: "#D9DE38",
                                        color: "#1a2744",
                                        fontWeight: 600,
                                        py: 1.5,
                                        borderRadius: "25px",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        "&:hover": {
                                            background: "#c5ca2e",
                                        },
                                        "&:disabled": {
                                            background: "#e0e0e0",
                                        },
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} sx={{ color: "#1a2744" }} />
                                    ) : (
                                        <>
                                            File a Complaint <ChevronRightIcon sx={{ ml: 0.5 }} />
                                        </>
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>

            {/* Complaints List / Empty State */}
            <Container maxWidth="lg" sx={{ pb: 8 }}>
                {issues.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: "center",
                            borderRadius: 3,
                            background: "#f8f9fa",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <ErrorOutlineIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a2744", mb: 1 }}>
                            No complaints reported
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", maxWidth: 400, mx: "auto" }}>
                            All systems are running smoothly. If you encounter any issues, please don't hesitate to file a complaint using the button above.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {issues.map((issue) => (
                            <Grid item xs={12} sm={6} md={4} key={issue.id || issue._id}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                        transition: "transform 0.3s, box-shadow 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 160,
                                            overflow: "hidden",
                                            background: "#f0f0f0",
                                        }}
                                    >
                                        {issue.photos?.length > 0 ? (
                                            <img
                                                src={issue.photos[0]}
                                                alt="Issue"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <DescriptionIcon sx={{ fontSize: 48, color: "#ccc" }} />
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1a2744", mb: 1 }}>
                                            {issue.productType || "Container Issue"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                mb: 2,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {issue.description}
                                        </Typography>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box
                                                sx={{
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: "12px",
                                                    background: issue.status === "resolved" ? "#E8F5E9" : "#FFF3E0",
                                                    color: issue.status === "resolved" ? "#2E7D32" : "#E65100",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {issue.status || "Pending"}
                                            </Box>
                                            <Button
                                                size="small"
                                                sx={{
                                                    color: "#1a2744",
                                                    fontWeight: 600,
                                                    textTransform: "none",
                                                }}
                                                onClick={() => handleViewDetails(issue)}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Issue Details Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, color: "#1a2744" }}>
                    Issue Details
                </DialogTitle>
                <DialogContent>
                    {selectedIssue && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                {selectedIssue.productType || "Container Issue"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                                {selectedIssue.description}
                            </Typography>
                            {selectedIssue.photos?.length > 0 && (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {selectedIssue.photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo}
                                            alt={`Issue ${index + 1}`}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: "#1a2744" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Complaint Modal */}
            <ComplaintModal
                open={complaintModalOpen}
                onClose={() => setComplaintModalOpen(false)}
                onSuccess={(message) => {
                    setSnackbar({ open: true, message, severity: "success" });
                }}
                onError={(message) => {
                    setSnackbar({ open: true, message, severity: "error" });
                }}
            />

            {/* Footer */}
            <Footer />
        </Box>
    );
}

export default Complaints;
