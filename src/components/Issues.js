import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    CardMedia,
    CardActions,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import axios from "axios";

function Issues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newIssue, setNewIssue] = useState({
        facility: "",
        description: "",
        image: "",
    });
    const [formData, setFormData] = useState({
        productType: "",
        description: "",
        photo: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            photo: event.target.files[0],
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formDataToSubmit = new FormData();
        alert(formData.productType);
        formDataToSubmit.append("productType", formData.productType);
        formDataToSubmit.append("description", formData.description);
        if (formData.photo) {
            formDataToSubmit.append("photo", formData.photo);
        }

        try {
            setIsSubmitting(true);
            await axios.post("http://localhost:5000/api/complaints", formDataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Complaint submitted successfully.");
            setFormData({ productType: "", description: "", photo: null });
        } catch (error) {
            console.error("Error submitting complaint:", error);
            alert("Failed to submit complaint.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = () => {
        setLoading(true);
        axios
            .get("http://localhost:5000/api/complaints")
            .then((response) => {
                setIssues(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load issues. Please try again.");
                setLoading(false);
            });
    };

    useEffect(() => {
        let intervalId;

        // Auto-reload only if autoReload is true and dialog is closed
        if (autoReload && !isDialogOpen) {
            setLoading(true);
            axios
                .get("http://localhost:5000/api/complaints")
                .then((response) => {
                    setIssues(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load blogs. Please try again.");
                    setLoading(false);
                });

            intervalId = setInterval(() => {
                window.location.reload();
            }, 10000);
        }

        // Clear the interval on cleanup
        return () => clearInterval(intervalId);
    }, [autoReload, isDialogOpen]);

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setImageFile(null);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedIssue(null);
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedIssue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditImageChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };

    const handleSaveEdit = async () => {
        if (!selectedIssue.facility || !selectedIssue.description) {
            alert("Please fill in all required fields.");
            return;
        }

        let imageUrl = selectedIssue.image;

        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);

            try {
                const uploadResponse = await axios.post(
                    "http://localhost:5000/api/complaint/upload",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                imageUrl = uploadResponse.data.imageUrl;
            } catch (err) {
                alert("Error uploading image. Please try again.");
                return;
            }
        }

        const updatedIssue = { ...selectedIssue, image: imageUrl };
        axios
            .put(`http://localhost:5000/api/complaints/${selectedIssue._id}`, updatedIssue)
            .then(() => {
                alert("Issue updated successfully!");
                fetchIssues();
                handleCloseEditDialog();
            })
            .catch(() => {
                alert("Error updating the issue. Please try again.");
            });
    };

    const handleRemoveIssue = () => {
        axios
            .delete(`http://localhost:5000/api/complaints/remove/${deleteIssueId}`)
            .then(() => {
                alert("Issue deleted successfully!");
                fetchIssues();
                handleCloseDeleteDialog();
            })
            .catch(() => {
                alert("Error deleting the issue. Please try again.");
            });
    };

    // Handle add new issue
    const handleOpenAddDialog = () => {
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
        setNewIssue({ facility: "", description: "", image: "" });
        setNewImageFile(null);
    };

    const handleAddInputChange = (event) => {
        const { name, value } = event.target;
        setNewIssue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddImageChange = (event) => {
        const file = event.target.files[0];
        setNewImageFile(file);
    };
    // Handle remove functionality
    const handleOpenDeleteDialog = (id) => {
        setDeleteIssueId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setDeleteIssueId(null);
    };

    const handleAddNewIssue = async () => {
        if (!newIssue.facility || !newIssue.description) {
            alert("Please fill in all required fields.");
            return;
        }
        let imageUrl = "";
        if (newImageFile) {
            const formData = new FormData();
            formData.append("image", newImageFile);
            try {
                const uploadResponse = await axios.post(
                    "http://localhost:5000/api/complaints/upload",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                imageUrl = uploadResponse.data.imageUrl;
            } catch (err) {
                alert("Error uploading image. Please try again.");
                return;
            }
        }
        const newIssueData = { ...newIssue, image: imageUrl };
        console.log(newIssueData);
        axios
            .post("http://localhost:5000/api/complaints/add", newIssueData)
            .then(() => {
                alert("New issue added successfully!");
                fetchIssues();
                handleCloseAddDialog();
            })
            .catch(() => {
                alert("Error adding new issue. Please try again.");
            });
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
                background: "linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)",
                minHeight: "100vh",
                pb: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    // background: "",
                    borderRadius: 4,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    py: 4,
                    px: 4,
                }}
            >

                <Typography
                    variant="h5"
                    align="center"
                    fontWeight="bold"
                    sx={{
                        mb: 6,
                        color: "#333",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                    }}
                >
                    Issues Dashboard
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleOpenAddDialog}
                    sx={{ mb: 4 }}
                >
                    Add New Issue
                </Button>
                <Grid container spacing={4}>
                    {issues.map((issue, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={issue.image}
                                    alt="Issue Image"
                                />
                                <CardContent>
                                    <Typography variant="h6">{issue.facility}</Typography>
                                    <Typography>{issue.description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleEdit(issue)}>
                                        Edit
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleOpenDeleteDialog(issue._id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogContent>
                        {selectedIssue && (
                            <>
                                <TextField
                                    label="Facility"
                                    fullWidth
                                    name="facility"
                                    value={selectedIssue.facility}
                                    onChange={handleEditInputChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Description"
                                    fullWidth
                                    name="description"
                                    value={selectedIssue.description}
                                    onChange={handleEditInputChange}
                                    sx={{ mb: 2 }}
                                />
                                <Typography sx={{ mb: 1 }}>Upload New Image:</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditDialog}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save</Button>
                    </DialogActions>
                </Dialog>

                {/* Add Dialog */}
                <Dialog
                    open={isAddDialogOpen}
                    onClose={handleCloseAddDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogContent>
                        <TextField
                            label="Facility"
                            fullWidth
                            name="facility"
                            value={newIssue.facility}
                            onChange={handleAddInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            name="description"
                            value={newIssue.description}
                            onChange={handleAddInputChange}
                            sx={{ mb: 2 }}
                        />
                        <Typography sx={{ mb: 1 }}>Upload Image:</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAddImageChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog}>Cancel</Button>
                        <Button onClick={handleAddNewIssue}>Add</Button>
                    </DialogActions>
                </Dialog>

                
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                >
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this issue?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                        <Button color="error" onClick={handleRemoveIssue}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

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
                                src={selectedIssue.image}
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
                            <Typography variant="caption" color="text.secondary">
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
            <Box sx={{ py: 4, px: 4 }}>
                <Container maxWidth="md">
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        File a Complaint for Damaged Products
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
                                    <MenuItem value="General waste bio box">
                                        General waste bio box
                                    </MenuItem>
                                    <MenuItem value="Blue bins">Blue bins</MenuItem>
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
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    Upload Photo (Optional)
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
            {/* Footer with Get a Free Quote Section */}
            <Box sx={{
                mt: 6,
                py: 4,
                backgroundColor: '#f1f1f1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Get a Free Quote
                </Typography>
                <Container sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, boxShadow: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={quoteData.name}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                variant="outlined"
                                name="email"
                                value={quoteData.email}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                variant="outlined"
                                name="phone"
                                value={quoteData.phone}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Service Type"
                                fullWidth
                                variant="outlined"
                                name="serviceType"
                                value={quoteData.serviceType}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            >
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="business">Business</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                                sx={{
                                    background: "linear-gradient(to right, #00796b, #48a999)",
                                    color: "#fff",
                                    "&:hover": {
                                        background: "linear-gradient(to right, #00574b, #327e67)",
                                    },
                                }}
                            >
                                Get Free Quote
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <Box sx={{ mt: 4 }}>
                    <Copyright />
                </Box>
            </Box>
            <button onClick={() => setAutoReload(!autoReload)}>
                {autoReload ? "Pause Auto-Reload" : "Resume Auto-Reload"}
            </button>
        </Box >
    );
}

export default Issues;
