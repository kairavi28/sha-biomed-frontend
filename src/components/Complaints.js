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
} from "@mui/material";
import axios from "axios";
import Link from "@mui/material/Link";

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
    // let apiUrl;
    // if (process.env.NODE_ENV === 'production') {
    //     apiUrl = process.env.REACT_APP_API_URL || 'http://52.60.180.33:5000';
    // } else {
    //     apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    // }

    const [issues, setIssues] = useState([]);
    const [autoReload, setAutoReload] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFormActive] = useState(false);
    const [quoteData, setQuoteData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: 'home',
    });

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
            await axios.post(`http://52.60.180.33:5000/api/issues/add`, formDataToSubmit, {
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
    //         await axios.post("http://localhost:5000/api/issues/add", formDataToSubmit, {
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
        let intervalId;
        if (autoReload && !isDialogOpen && !isFormActive) {
            setLoading(true);
            axios
                .get(`http://52.60.180.33:5000/api/complaints`)
                .then((response) => {
                    setIssues(response.data);
                    console.log('here', response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load issues. Please try again.");
                    setLoading(false);
                });

            intervalId = setInterval(() => {
                window.location.reload();
            }, 10000);
        }
        return () => clearInterval(intervalId);
    }, [autoReload, isDialogOpen, isFormActive]);

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
                background: "#f9f9f9",
            }}
        >
            {/* Hero Section */}
            <Box
                sx={{
                    height: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: "url('/images/complaint.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "center",
                    color: "#fff",
                }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold">
                        Welcome to Our Complaint Portal
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
                        Stay updated with the latest insights, stories, and trends.
                    </Typography>
                    {/* <Button
                                  variant="contained"
                                  sx={{
                                    background: "#00796b",
                                    "&:hover": { background: "#00574b" },
                                  }}
                                >
                                  Learn More
                                </Button> */}
                </Container>
            </Box>

            {/* About Us Section */}
            <Box sx={{ py: 8, background: "#ffffff" }}>
                <Container>
                    <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
                        About Us
                    </Typography>
                    <Typography align="center" sx={{ color: "#555", mb: 4 }}>
                        We are dedicated to providing valuable insights and fostering community engagement through our blog platform. Our mission is to empower individuals and businesses with the information they need to succeed.
                    </Typography>
                </Container>
            </Box>
            <Box sx={{ py: 8 }}>
                <Container>

                    <Typography
                        variant="h5"
                        align="center"
                        fontWeight="bold"
                        sx={{
                            mb: 6,
                            color: "#333"
                        }}
                    >
                        Queries
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
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#666", lineHeight: 1 }}
                                        >
                                            {issue.description.length > 100
                                                ? `${issue.description.slice(0, 100)}...`
                                                : issue.description}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        display="block"
                                        sx={{ mt: 1, color: "#757575" }}
                                    >
                                        {new Date(issue.createdAt).toLocaleString()}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            background: "linear-gradient(to right, #00796b, #48a999)",
                                            color: "#fff",
                                            "&:hover": {
                                                background: "linear-gradient(to right, #00574b, #327e67)",
                                            },
                                        }}
                                        onClick={() => handleViewDetails(issue)}
                                    >
                                        Read More
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
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            background: "linear-gradient(to right, #00796b, #48a999)",
                            color: "#fff",
                            "&:hover": {
                                background: "linear-gradient(to right, #00574b, #327e67)",
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{
                mt: 6,
                py: 4,
                backgroundColor: '#f1f1f1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
                        Report an Issue for Damaged Container (if any)
                    </Typography>

                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Product Type"
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value="Carsons">Carsons</MenuItem>
                                    <MenuItem value="General waste bio box">General Waste Bio Box</MenuItem>
                                    <MenuItem value="Blue bins">Blue Bins</MenuItem>
                                </TextField>
                            </Grid>
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
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" component="label" fullWidth>
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
                                    {formData.photos.map((photo, index) => (
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
                                                onClick={() => handleRemoveImage(index)}
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
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        background: "linear-gradient(to right, #00796b, #48a999)",
                                        color: "#fff",
                                        "&:hover": {
                                            background: "linear-gradient(to right, #00574b, #327e67)",
                                        },
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
            <button onClick={() => setAutoReload(!autoReload)}>
                {autoReload ? "Pause Auto-Reload" : "Resume Auto-Reload"}
            </button>
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
