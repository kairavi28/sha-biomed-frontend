import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, MenuItem, Container, Grid, Paper, Snackbar, Alert } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Visually hidden input for file upload
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// Dropdown options for the department
const departments = [
    { value: 'facilityA', label: 'Facility A' },
    { value: 'facilityB', label: 'Facility B' },
    { value: 'facilityC', label: 'Facility C' },
];

function Support() {
    const [formData, setFormData] = useState({
        department: '',
        containerType: '',
        issueDescription: '',
        image: null,
        comments: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Get the first file

        if (file) {
            setFormData({
                ...formData,
                image: file,
            });

            // Generate a URL for the image preview
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Validate form inputs
        if (formData.department && formData.containerType && formData.issueDescription && formData.image) {
            console.log("Form Data Submitted: ", formData);
            setSnackbarMessage('Form submitted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // You can add your form submission logic here
        } else {
            setSnackbarMessage('Please fill all required fields.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container sx={{ mt: 6 }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Report an Issue
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                select
                                label="Department of the Facility"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {departments.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Container Type"
                                name="containerType"
                                value={formData.containerType}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Issue Description"
                                name="issueDescription"
                                value={formData.issueDescription}
                                onChange={handleChange}
                                margin="normal"
                                required
                                multiline
                                rows={3}
                            />

                            <Button
                                component="label"
                                variant="outlined"
                                color="secondary"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                                sx={{ mt: 4 }}
                            >
                                <b>Upload Image</b>
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    required
                                />
                            </Button>

                            {/* Display image preview */}
                            {imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Image Preview"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                label="Any Comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={2}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{ mt: 3 }}
                            >
                                <b>Submit</b>
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Support;
