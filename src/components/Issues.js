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

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = () => {
        setLoading(true);
        axios
            .get("http://localhost:5000/api/complaints")
            .then((response) => {
                setIssues(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load issues. Please try again.");
                setLoading(false);
            });
    };

    const handleEdit = (issue) => {
        setSelectedIssue(issue);
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

    const handleSaveEdit = () => {
        if (!selectedIssue.facility || !selectedIssue.description) {
            alert("Please fill in all required fields.");
            return;
        }
        axios
            .put(`http://localhost:5000/api/complaints/${selectedIssue._id}`, selectedIssue)
            .then(() => {
                alert("Issue updated successfully!");
                fetchIssues();
                handleCloseEditDialog();
            })
            .catch(() => {
                alert("There was an error updating the issue. Please try again.");
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
            }}
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography
                    variant="h5"
                    align="center"
                    fontWeight="bold"
                    sx={{ mb: 6, color: "#333" }}
                >
                    Admin Issues Dashboard
                </Typography>
                <Grid container spacing={4}>
                    {issues.map((issue, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ maxWidth: 345, borderRadius: 4 }}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={issue.image}
                                    alt="Issue Image"
                                />
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        fontWeight="bold"
                                    >
                                        {issue.facility}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {issue.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleEdit(issue)}
                                        sx={{
                                            background: "linear-gradient(to right, #00796b, #48a999)",
                                            color: "#fff",
                                            "&:hover": {
                                                background:
                                                    "linear-gradient(to right, #00574b, #327e67)",
                                            },
                                        }}
                                    >
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
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "bold", mb: 2 }}
                                >
                                    Edit Issue
                                </Typography>
                                <TextField
                                    label="Facility"
                                    fullWidth
                                    variant="outlined"
                                    name="facility"
                                    value={selectedIssue.facility}
                                    onChange={handleEditInputChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Description"
                                    fullWidth
                                    variant="outlined"
                                    name="description"
                                    value={selectedIssue.description}
                                    onChange={handleEditInputChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Image URL"
                                    fullWidth
                                    variant="outlined"
                                    name="image"
                                    value={selectedIssue.image}
                                    onChange={handleEditInputChange}
                                    sx={{ mb: 2 }}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseEditDialog}
                            sx={{ color: "#757575" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            sx={{
                                background: "linear-gradient(to right, #00796b, #48a999)",
                                color: "#fff",
                                "&:hover": {
                                    background:
                                        "linear-gradient(to right, #00574b, #327e67)",
                                },
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default Issues;
