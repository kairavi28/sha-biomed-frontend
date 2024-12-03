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
    const [imageFile, setImageFile] = useState(null); // For image file in edit
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newIssue, setNewIssue] = useState({
        facility: "",
        description: "",
        image: "",
    });
    const [newImageFile, setNewImageFile] = useState(null); // For image file in add

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

    // Handle edit dialog open/close
    const handleEdit = (issue) => {
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
                    "http://localhost:5000/api/upload",
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
                    "http://localhost:5000/api/upload",
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
        axios
            .post("http://localhost:5000/api/complaints", newIssueData)
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
            >
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ background: "#f3f4f6", minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" align="center" sx={{ mb: 4 }}>
                    Admin Issues Dashboard
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
            </Container>
        </Box>
    );
}

export default Issues;
