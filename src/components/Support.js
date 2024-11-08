import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, MenuItem, Container, Grid, Paper, Snackbar, Alert, Slider } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    const [imagePreview, setImagePreview] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
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
        const files = Array.from(event.target.files); 

        if (files.length > 0) {
            setFormData({
                ...formData,
                image: files,
            });
            setImagePreview(files.map(file => URL.createObjectURL(file)));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (formData.department && formData.containerType && formData.issueDescription && formData.image) {
            console.log("Form Data Submitted: ", formData);
            setSnackbarMessage('Form submitted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage('Please fill all required fields.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSliderChange = (event, newValue) => {
        setImageIndex(newValue);
    };

    return (
        <Box sx={{
            background: 'linear-gradient(to bottom, #ffffff, #e0f7fa, #b3e0ff)',
            minHeight: '100vh', 
            pb: 4,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Container sx={{ mt: 6, display: 'flex' }}>
                <Grid container spacing={10}>
                     {/* Right Side - Image Preview with Slider */}
                     <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '2em', alignItems: 'center' }}>
                            <Typography variant="h6" gutterBottom align="center">
                                Image Preview
                            </Typography>
                            {/* Image Slider */}
                            {imagePreview.length > 0 && (
                                <>
                                    <Box sx={{ textAlign: 'center', mb: 2, maxWidth: '100%' }}>
                                        <img
                                            src={imagePreview[imageIndex]}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    </Box>

                                    <Slider
                                        value={imageIndex}
                                        onChange={handleSliderChange}
                                        min={0}
                                        max={imagePreview.length - 1}
                                        step={1}
                                        marks
                                        valueLabelDisplay="auto"
                                        sx={{ width: '100%' }}
                                    />
                                </>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', borderRadius: '2em', height: '100%' }}>
                            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
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
                                        multiple
                                    />
                                </Button>

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
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Support;
