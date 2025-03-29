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
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton
} from "@mui/material";
import axios from "axios";
import Link from "@mui/material/Link";
import complaint_bg from '../assets/images/complaint_bg.png';
import { motion } from "framer-motion";
import CallToAction from "./CallToAction";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";  // 📷 Upload icon
import SendIcon from "@mui/icons-material/Send";  // 🚀 Submit icon
import CloseIcon from "@mui/icons-material/Close";  // ❌ Remove icon

// Helper function to convert base64 to a File object
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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFormActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        productType: "",
        description: "", photos: []
    });


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

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("productType", formData.productType);
        formDataToSubmit.append("description", formData.description);

        if (formData.photos && formData.photos.length > 0) {
            formData.photos.forEach((photo, index) => {
                // Convert base64 to File if necessary
                const photoFile = photo.file instanceof File
                    ? photo.file
                    : dataURLToFile(photo.preview, `photo-${index}.jpg`);
                formDataToSubmit.append("photos", photoFile);
            });
        }

        // Log FormData contents
        for (let pair of formDataToSubmit.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            setIsSubmitting(true);
            await axios.post(`http://35.182.166.248/api/issues/add`, formDataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Issue submitted successfully.");
            setFormData({ productType: "", description: "", photos: [] });
            localStorage.removeItem("formData");
        } catch (error) {
            console.error("Error submitting issue:", error);
            alert("Failed to submit complaint.");
        } finally {
            setIsSubmitting(false);
        }
    };
    // const handleFormSubmit = async (event) => {
    //     event.preventDefault();
    //     const formDataToSubmit = new FormData();
    //     formDataToSubmit.append("productType", formData.productType);
    //     formDataToSubmit.append("description", formData.description);

    //     console.log('form data', formData);
    //     if (formData.photos) {
    //         console.log(formData.photo);
    //         formDataToSubmit.append("photo", formData.photo);
    //     }
    //     try {
    //         setIsSubmitting(true);
    //         await axios.post("http://35.182.166.248/api/issues/add", formDataToSubmit, {
    //             headers: { "Content-Type": "multipart/form-data" },
    //         });
    //         alert("Complaint submitted successfully.");
    //         setFormData({ productType: "", description: "", photo: null });
    //         localStorage.removeItem("formData"); 
    //     } catch (error) {
    //         console.error("Error submitting complaint:", error);
    //         alert("Failed to submit complaint.");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => {
            const updatedForm = { ...prev, [name]: value };
            localStorage.setItem("formData", JSON.stringify(updatedForm));
            return updatedForm;
        });
    };

    useEffect(() => {
        if (!isDialogOpen && !isFormActive) {
            setLoading(true);
            axios
                .get(`http://35.182.166.248/api/complaints`)
                .then((response) => {
                    setIssues(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load issues. Please try again.");
                    setLoading(false);
                });
            // Removed the auto-reload interval
            // intervalId = setInterval(() => {
            //     window.location.reload();
            // }, 10000);
        }
        // No need to clear interval since it's removed
        return () => { };
    }, [isDialogOpen, isFormActive]);

    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem("formData"));
        if (savedFormData) {
            setFormData(savedFormData);
        }
    }, []);

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedIssue(null);
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background: "#f0f8ff",
            }}
        >
            {/* Hero Section */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                sx={{
                    height: "50vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `url(${complaint_bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "center",
                    color: "#003366",
                }}
            >
                <Container
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        component={motion.div}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    >
                        Welcome to Our Complaint Portal
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ mt: 2, mb: 4 }}
                        component={motion.p}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                    >
                        Stay updated with the latest insights, stories, and trends.
                    </Typography>
                </Container>
            </Box>

            <Box sx={{ py: 8 }}>
                <Container>
                    {/* File a Complaint Section */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            textAlign: "center",
                            mb: 6,
                            p: 4,
                            background: "linear-gradient(135deg, #ffffff, #e3f2fd)",
                            borderRadius: 3,
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" sx={{ color: "#003366", mb: 2 }}>
                            Need to Report an Issue?
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
                            If you have any concerns or complaints, please let us know. Click the button below to file a complaint.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 3,
                                background: "linear-gradient(to right, #BAC400, #E0E721)",
                                color: "#092C74",
                                px: 4,
                                py: 1,
                                borderRadius: "12px",
                                boxShadow: "0px 4px 12px rgba(44, 56, 233, 0.4)",
                                '&:hover': { background: "linear-gradient(135deg,rgb(98, 129, 233),rgb(164, 208, 231))" },
                            }}
                        // onClick={handleFileComplaint}
                        >
                            <b>File a Complaint</b>
                        </Button>
                    </Box>

                    {/* General Guidelines Section */}
                    <Typography variant="h5" align="center" fontWeight="bold" sx={{ mb: 6, color: "#003366" }}>
                        General Guidelines
                    </Typography>
                    <Grid container spacing={4}>
                        {issues.map((issue) => (
                            <Grid item xs={12} sm={6} md={4} key={issue.id}>
                                <Paper
                                    elevation={5}
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
                                        transition: "transform 0.3s, box-shadow 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "200px",
                                            overflow: "hidden",
                                            borderRadius: 2,
                                            mb: 2,
                                        }}
                                    >
                                        <img
                                            src={issue.photos}
                                            alt="Complaint Image"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            loading="lazy"
                                        />
                                    </Box>
                                    <Box sx={{ flexGrow: 0.5 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                mb: 1,
                                                color: "#00796b",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {issue.facility}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1 }}>
                                            {issue.description.length > 100
                                                ? `${issue.description.slice(0, 100)}...`
                                                : issue.description}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" display="block" sx={{ mt: 1, color: "#757575" }}>
                                        {new Date(issue.createdAt).toLocaleString()}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            mt: 3,
                                            background: "linear-gradient(135deg,rgb(98, 129, 233),rgb(164, 208, 231))",
                                            color: "#fff",
                                            px: 4,
                                            py: 1,
                                            borderRadius: "12px",
                                            boxShadow: "0px 4px 12px rgba(44, 56, 233, 0.4)",
                                            "&:hover": { background: "linear-gradient(135deg,rgb(84, 185, 240),rgb(71, 96, 240))" },
                                        }}
                                        onClick={() => handleViewDetails(issue)}
                                    >
                                        <b>Read More</b>
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            {/* Popup Dialog for Viewing Full Complaint */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                {/* <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Details
        </DialogTitle> */}
                <DialogContent>
                    {selectedIssue && (
                        <Box>
                            <img
                                src={selectedIssue.photos}
                                alt={selectedIssue.facility}
                                style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Facility: {selectedIssue.facility}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {selectedIssue.description}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Submitted on:{" "}
                                {new Date(selectedIssue.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            "&:hover": { background: "darkred" },
                        }}
                        onClick={handleCloseDialog}
                    >
                        <CloseIcon />  {/* ❌ Remove image icon */}
                    </IconButton>
                </DialogActions>
            </Dialog>
            {/* Report for damaged containers */}
            <Box sx={{ mt: 6, py: 6, background: "linear-gradient(to bottom, #f9f9f9, #ffffff)" }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#003366",
                                mb: 3,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Report an Issue for Damaged Container
                        </Typography>

                        <form onSubmit={handleFormSubmit}>
                            <Grid container spacing={3}>
                                {/* Product Type Selection */}
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Product Type"
                                        name="productType"
                                        value={formData.productType}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                    >
                                        <MenuItem value="Carsons">Carsons</MenuItem>
                                        <MenuItem value="General waste bio box">General Waste Bio Box</MenuItem>
                                        <MenuItem value="Blue bins">Blue Bins</MenuItem>
                                    </TextField>
                                </Grid>

                                {/* Description Field */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                {/* File Upload Button with Icon */}
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                        startIcon={<PhotoCameraIcon />}  // 📷 Icon added here
                                        sx={{
                                            background: "linear-gradient(135deg,rgb(98, 129, 233),rgb(164, 208, 231))",
                                            color: "white",
                                            fontWeight: "bold",
                                            py: 1.5,
                                            borderRadius: "8px",
                                            "&:hover": { background: "linear-gradient(135deg,rgb(84, 185, 240),rgb(71, 96, 240))" },
                                        }}
                                    >
                                        Upload Photos
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Grid>

                                {/* Image Previews with Remove Icon */}
                                {formData.photos.length > 0 && (
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: "12px",
                                                flexWrap: "wrap",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                p: 2,
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                background: "#f4f4f4",
                                            }}
                                        >
                                            {formData.photos.map((photo, index) => (
                                                <Box key={index} sx={{ position: "relative" }}>
                                                    <img
                                                        src={photo.preview}
                                                        alt={`Preview ${index}`}
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                            border: "2px solid #ddd",
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            position: "absolute",
                                                            top: "-5px",
                                                            right: "-5px",
                                                            background: "red",
                                                            color: "white",
                                                            borderRadius: "50%",
                                                            "&:hover": { background: "darkred" },
                                                        }}
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <CloseIcon />  {/* ❌ Remove image icon */}
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}

                                {/* Submit Button with Send Icon */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        startIcon={<SendIcon />}  // 🚀 Icon added here
                                        sx={{
                                            mt: 3,
                                            background: "linear-gradient(to right, #BAC400, #E0E721)",
                                            color: "#092C74",
                                            px: 4,
                                            py: 1,
                                            borderRadius: "12px",
                                            boxShadow: "0px 4px 12px rgba(44, 56, 233, 0.4)",
                                            '&:hover': { background: "linear-gradient(135deg,rgb(98, 129, 233),rgb(164, 208, 231))" },
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        <b>{isSubmitting ? "Submitting..." : "Submit Report"}</b>
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>

            <CallToAction />
            {/* <button onClick={() => setAutoReload(!autoReload)}>
                {autoReload ? "Pause Auto-Reload" : "Resume Auto-Reload"}
            </button> */}
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
        </Box >
    );
}

export default Complaints;
