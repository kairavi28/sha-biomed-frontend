import React, { useState } from "react";
import { PhoneInput } from "react-international-phone";
import {
    Box,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Modal,
    Grid,
    Alert,
} from "@mui/material";
import axios from "axios";
import "react-international-phone/style.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

function ComplaintModal({ open, onClose, onSuccess, onError }) {
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        contactNumber: "",
        description: "",
        photos: [],
    });

    const handleClose = () => {
        setError("");
        onClose();
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
            setFormData((prev) => ({
                ...prev,
                photos: [...(prev.photos || []), ...uploadedImages],
            }));
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (!formData.contactNumber || !formData.description) {
            setError("Please fill out all required fields.");
            setIsSubmitting(false);
            return;
        }

        try {
            const storedUser = sessionStorage.getItem("userData");
            const userData = storedUser ? JSON.parse(storedUser) : {};

            const formDataToSend = new FormData();
            formDataToSend.append("firstname", userData.firstname || "");
            formDataToSend.append("lastname", userData.lastname || "");
            formDataToSend.append("email", userData.email || "");

            const facilityNames = (userData.facilities || [])
                .map(f => f.name)
                .join(", ");
            formDataToSend.append("facilities", facilityNames);

            formDataToSend.append("contactNumber", formData.contactNumber);
            formDataToSend.append("description", formData.description);

            formData.photos.forEach((photo) => {
                formDataToSend.append("photos", photo.file);
            });

            await axios.post(
                `${API_BASE_URL}/client-complaint/add`,
                formDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (onSuccess) {
                onSuccess("New complaint submitted successfully!");
            }

            setFormData({ contactNumber: "", description: "", photos: [] });
            handleClose();
        } catch (err) {
            if (onError) {
                onError("Error submitting the request. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const updatedPhotos = [...prev.photos];
            updatedPhotos.splice(index, 1);
            return { ...prev, photos: updatedPhotos };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="complaint-form-title"
            aria-describedby="complaint-form-description"
        >
            <form onSubmit={handleFormSubmit}>
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
                    <Typography
                        id="complaint-form-title"
                        variant="h5"
                        component="h2"
                        sx={{
                            mb: 3,
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#1a2744",
                        }}
                    >
                        File a Complaint
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <PhoneInput
                        label="Contact"
                        name="contactNumber"
                        defaultCountry="ca"
                        placeholder="Enter your phone number"
                        value={formData.contactNumber || ""}
                        onChange={(value) =>
                            setFormData((prev) => ({
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
                        value={formData.description || ""}
                        onChange={handleInputChange}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                            mb: 3,
                            borderRadius: "8px",
                            borderColor: "#1a2744",
                            color: "#1a2744",
                            textTransform: "none",
                        }}
                    >
                        Upload Attachment (Optional)
                        <input hidden accept="image/*" type="file" multiple onChange={handleFileChange} />
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
                                        type="button"
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
                    <Box sx={{ textAlign: "center", display: "flex", gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                flex: 1,
                                borderRadius: "8px",
                                textTransform: "none",
                                backgroundColor: "#D9DE38",
                                color: "#1a2744",
                                fontWeight: 600,
                                "&:hover": { backgroundColor: "#c5ca32" },
                            }}
                            onClick={handleFormSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                flex: 1,
                                borderRadius: "8px",
                                textTransform: "none",
                                borderColor: "#1a2744",
                                color: "#1a2744",
                            }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </form>
        </Modal>
    );
}

export default ComplaintModal;
