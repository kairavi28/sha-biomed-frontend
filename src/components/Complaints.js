import React, { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import { useMemo } from "react";
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
    Modal,
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
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null); // Store selected complaint
    const [isFormActive] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const handleFormClose = () => setFormOpen(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        productType: "",
        description: "",
        photos: []
    });

    const [formDataComplaint, setFormDataComplaint] = useState({
        contactNumber: "",
        description: "",
        photos: [],
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Fetch user data once on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!userData) {
                    console.error("User data is missing.");
                    setLoading(false);
                    return;
                }

                const currentUserId = userData?.id || userData?._id;
                if (!currentUserId) {
                    console.error("User ID is undefined.");
                    setLoading(false);
                    return;
                }

                const userResponse = await axios.get(`${API_BASE_URL}/user/${currentUserId}`);
                const userDataFromDB = userResponse.data;
                setUserData(userDataFromDB); // ✅ Update state with user data from DB

                // Fetch complaints
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

                    // ✅ Use `complaintsResponse.data.facilities` instead of `userData`
                    const filteredComplaints = complaintsResponse.data.filter(
                        (complaint) => userFacilityNames.includes(complaint.facility)
                    );

                    console.log("Filtered Complaints:", filteredComplaints);
                    setIssues(filteredComplaints);
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
    }, [userData]); // ✅ Depend on userData to fetch user details on state update

    // File a complaint box
    const handleFormSubmitComplaint = async (event) => {
        event.preventDefault();
        setLoading(true);
        setIsSubmitting(true);
        if (!formDataComplaint.contactNumber || !formDataComplaint.description) {
            setError("Please fill out all required fields.");
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Use userData from state for user information
            if (userData) {
                formDataToSend.append("firstname", userData.firstname);
                formDataToSend.append("lastname", userData.lastname);
                formDataToSend.append("email", userData.email);

                // Append facility names as comma-separated string
                const facilityNames = userData.facilities.map(f => f.name).join(", ");
                formDataToSend.append("facilities", facilityNames);
            }

            // Append complaint form data
            formDataToSend.append("contactNumber", formDataComplaint.contactNumber);
            formDataToSend.append("description", formDataComplaint.description);

            // Append photos
            formDataComplaint.photos.forEach((photo) => {
                formDataToSend.append("photos", photo.file);
            });

            const response = await axios.post(
                `${API_BASE_URL}/client-complaint/add`,
                formDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setSnackbar({
                open: true,
                message: "New complaint submitted successfully!",
                severity: "success",
            });

            setFormDataComplaint({ contactNumber: "", description: "", photos: [] });
            localStorage.removeItem("formDataComplaint");
            setLoading(false);
            handleFormClose();

        } catch (err) {
            setSnackbar({
                open: true,
                message: "Error submitting the request. Please try again.",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Snackbar close
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
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

    {/* Complaint Pop up */ }
    const handleFileChangeComplaint = (event) => {
        const files = Array.from(event.target.files);
        const previews = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve({ file, preview: reader.result });
            });
        });

        Promise.all(previews).then((uploadedImages) => {
            setFormDataComplaint((prev) => {
                const updatedForm = {
                    ...prev,
                    photos: [...(prev.photos || []), ...uploadedImages],
                };
                localStorage.setItem("formDataComplaint", JSON.stringify(updatedForm));
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


    const handleRemoveImageComplaint = (index) => {
        setFormDataComplaint((prev) => {
            const updatedPhotos = [...prev.photos];
            updatedPhotos.splice(index, 1);
            const updatedForm = { ...prev, photos: updatedPhotos };
            localStorage.setItem("formDataComplaint", JSON.stringify(updatedForm));
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
        // for (let pair of formDataToSubmit.entries()) {
        //     console.log(`${pair[0]}:`, pair[1]);
        // }

        try {
            setIsSubmitting(true);
            await axios.post(`${API_BASE_URL}/issues/add`, formDataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSnackbar({
                open: true,
                message: `Issue has been successfully submitted!`,
                severity: "success",
            });
            setFormData({ productType: "", description: "", photos: [] });
            localStorage.removeItem("formData");
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Error submitting the issue. Please try again.`,
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

    const handleInputChangeComplaint = (e) => {
        const { name, value } = e.target;
        setFormDataComplaint((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem("formData"));
        if (savedFormData) {
            setFormData(savedFormData);
        }
    }, []);

    const handleViewDetails = (issue) => {
        if (!issue) return;
        setSelectedIssue({
            ...issue,
            photos: Array.isArray(issue.photos) ? issue.photos : [issue.photos], // Ensure it's an array
        });
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
                            onClick={() => setFormOpen(true)}
                        >
                            <b>File a Complaint</b>
                        </Button>
                    </Box>

                    {/* General Guidelines Section */}
                    {/* General Guidelines Section */}
                    <Typography variant="h5" align="center" fontWeight="bold" sx={{ mb: 6, color: "#003366" }}>
                        General Guidelines
                    </Typography>

                    {issues.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                p: 4,
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #f8f9fa, #e0e7ff)",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" sx={{ color: "#374151" }}>
                                No complaints reported in this section.
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#6b7280", mt: 1 }}>
                                If you have any concerns, please file a complaint using the form.
                            </Typography>
                        </Box>
                    ) : (
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
                                        {/* Image container with conditional styles */}
                                        <Box
                                            sx={{
                                                height: "200px",
                                                overflowX: issue.photos?.length > 1 ? "auto" : "hidden",
                                                whiteSpace: "nowrap",
                                                borderRadius: 2,
                                                mb: 2,
                                                display: "flex",
                                                gap: 1,
                                                justifyContent: issue.photos?.length === 1 ? "center" : "flex-start",
                                            }}
                                        >
                                            {issue.photos?.length > 0 ? (
                                                issue.photos.map((photo, i) => (
                                                    <img
                                                        key={i}
                                                        src={photo}
                                                        alt={`Issue Image ${i + 1}`}
                                                        style={{
                                                            height: issue.photos?.length === 1 ? "100%" : "auto",
                                                            width: issue.photos?.length === 1 ? "100%" : "auto",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                        loading="lazy"
                                                    />
                                                ))
                                            ) : (
                                                <img
                                                    src="/placeholder.jpg"
                                                    alt="No image available"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                                                    loading="lazy"
                                                />
                                            )}
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
                                                {issue.title}
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
                    )}
                </Container>
            </Box>
            {/* Popup Dialog for Viewing Full Complaint */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedIssue?.facility || "Complaint Details"}</DialogTitle>
                <DialogContent>
                    {selectedIssue?.photos?.length > 0 ? (
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                            {selectedIssue.photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`Complaint Image ${index + 1}`}
                                    style={{
                                        width: "300px", // Set a larger width
                                        height: "auto", // Keep aspect ratio
                                        borderRadius: "8px", // Rounded corners for a smoother look
                                        objectFit: "cover", // Ensure image fits within the dimensions
                                        maxHeight: "300px", // Set max height if needed
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Optional: Add shadow for better visuals
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography>No images available</Typography>
                    )}

                    <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
                        {selectedIssue?.description}
                    </Typography>

                    <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#757575" }}>
                        {new Date(selectedIssue?.createdAt).toLocaleString()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* File a complaint modal popup*/}
            <Modal
                open={formOpen}
                onClose={handleFormClose}
                aria-labelledby="complaint-form-title"
                aria-describedby="complaint-form-description"
            >
                <form onSubmit={handleFormSubmitComplaint}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "90%",
                            maxWidth: 500,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 3,
                            outline: "none",
                        }}
                    >
                        {/* Modal Title */}
                        <Typography
                            id="complaint-form-title"
                            variant="h5"
                            component="h2"
                            sx={{
                                mb: 3,
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "primary.main",
                            }}
                        >
                            File a Complaint
                        </Typography>
                        {/* Phone Input */}
                        <PhoneInput
                            label="Contact"
                            name="contactNumber"
                            defaultCountry="ca"
                            placeholder="Enter your phone number"
                            value={formDataComplaint.contactNumber || ""}
                            onChange={(value) =>
                                setFormDataComplaint((prev) => ({
                                    ...prev,
                                    contactNumber: value,
                                }))
                            }
                            style={{
                                width: "95%",
                                marginBottom: "16px",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                            }}
                        />

                        {/* Complaint Description */}
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description of Problem"
                            name="description"
                            variant="outlined"
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                },
                            }}
                            value={formDataComplaint.description || ""}
                            onChange={handleInputChangeComplaint}
                        />

                        {/* File Upload */}
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{
                                mb: 3,
                                borderRadius: "8px",
                                borderColor: "primary.main",
                                textTransform: "none",
                            }}
                        >
                            Upload Attachment (Optional)
                            <input hidden accept="image/*" type="file" multiple onChange={handleFileChangeComplaint} />
                        </Button>
                        <Grid item xs={12}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {formDataComplaint.photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: "relative",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={photo.preview}
                                            alt={`Preview ${index}`}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <button
                                            onClick={() => handleRemoveImageComplaint(index)}
                                            style={{
                                                position: "absolute",
                                                top: "-5px",
                                                right: "-5px",
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                            }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                        {/* Action Buttons */}
                        <Box sx={{ textAlign: "center", display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    flex: 1,
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    backgroundColor: "primary.main",
                                    "&:hover": { backgroundColor: "primary.dark" },
                                }}
                                onClick={handleFormSubmitComplaint}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    borderColor: "grey.500",
                                }}
                                onClick={handleFormClose}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Modal>
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
            {/* Snackbar for Feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box >
    );
}

export default Complaints;
