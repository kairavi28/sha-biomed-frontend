import React, { useState } from "react";
import { PhoneInput } from "react-international-phone";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Modal,
  Card,
  CardContent,
  CardMedia,
  Link
} from "@mui/material";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { keyframes } from "@emotion/react";
import image1 from "../assets/images/bg_full_home.png";
import image3 from "../assets/images/bg_full_2.png";
import image_1 from "../assets/images/1.jpg";
import image_2 from "../assets/images/2.jpg";
import image_3 from "../assets/images/3.jpg";
import "react-international-phone/style.css";
import axios from "axios";

const newCardHoverAnimation = keyframes`
  from {
    transform: scale(1) rotateY(0deg);
  }
  to {
    transform: scale(1.1) rotateY(15deg);
  }
`;

const updates = [
  { title: "New Waste Guidelines", description: "Updated policies for 2025.", date: "Jan 10, 2025" },
  { title: "Expanded Services", description: "Now operating in additional locations!", date: "Jan 5, 2025" },
];

const testimonials = [
  { name: "John Doe", feedback: "Biomed’s services exceeded our expectations!" },
  { name: "Jane Smith", feedback: "Highly reliable and professional team!" },
];

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
function Dashboard() {
  const [formOpen, setFormOpen] = useState(false);
  const handleFormOpen = () => setFormOpen(true);
  const handleFormClose = () => setFormOpen(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contactNumber: "",
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


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('hello- on dashboard page', console.log('Data stored in session:', sessionStorage.getItem('userData')));
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("contactNumber", formData.contactNumber);
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
      await axios.post("http://localhost:5000/api/client-complaint/add", formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Issue submitted successfully.");
      setFormData({ contactNumber: "", description: "", photos: [] });
      localStorage.removeItem("formData");
    } catch (error) {
      console.error("Error submitting issue:", error);
      alert("Failed to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
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

  const handleInputChange = (event) => {
    console.log(event.target);
    const { value } = event.target;

    // setFormData((prev) => {
    //   const updatedForm = { ...prev, [name]: value };
    //   localStorage.setItem("formData", JSON.stringify(updatedForm));
    //   return updatedForm;
    // });
  };

  return (
    <Box sx={{ background: "linear-gradient(to bottom, white, #f0f8ff)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          background: "linear-gradient(to bottom, #003366, rgba(0, 51, 102, 0.8))",
          color: "white",
          pb: 6,
          pt: 4,
        }}
      >
        <AwesomeSlider
          style={{
            height: "500px",
            borderRadius: "10px",
          }}
          bullets={false}
          play={true}
          interval={4000}
        >
          {[image1, image3].map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </AwesomeSlider>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
          Leading Biohazard Waste Disposal
        </Typography>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "#A9AC2B", color: "white", fontSize: "bold" },
          }}
          onClick={handleFormOpen}
        >
          Make a complaint
        </Button>

        <Modal
          open={formOpen}
          onClose={handleFormClose}
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
                value={formData.contactNumber}
          
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
                value={formData.description}
                onChange={handleInputChange}
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
                  onClick={handleFormSubmit}
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
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "#A9AC2B", color: "white", fontSize: "bold" },
          }}
        >
          Read a blog
        </Button>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "#A9AC2B", color: "white", fontSize: "bold" },
          }}
        >
          Ask a Question
        </Button>
      </Box>

      {/* About Section */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          About Biomed
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "30+ Years of Expertise",
              description: "Trusted leaders in biohazard waste recovery since 1992.",
            },
            {
              title: "Certified & Compliant",
              description: "Fully licensed to handle all types of biohazardous waste.",
            },
            {
              title: "Sustainable Solutions",
              description: "Innovative systems that prioritize the environment.",
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: "center", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Improperly Packaged Waste Section */}
      <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
        <Container sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
            Importance of Proper Waste Packaging
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 4 }}>
            Improperly packaged waste can lead to contamination, legal issues, and harm to the environment. This portal is
            designed to educate users on the best practices for properly packaging waste to ensure safety and compliance
            with regulations.
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2, textAlign: "center" }}
                >
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    "{testimonial.feedback}"
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                    - {testimonial.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container></Box>

      {/* Services Section */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {[image_1, image_2, image_3].map((image, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  "&:hover": { animation: `${newCardHoverAnimation} 0.5s ease-in-out forwards` },
                }}
              >
                <img src={image} alt={`Service ${index}`} style={{ width: "100%", borderRadius: "8px" }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  Service {index + 1}
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Learn More
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
          What Our Clients Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2, textAlign: "center" }}
              >
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "{testimonial.feedback}"
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  - {testimonial.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

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
    </Box>
  );
}

export default Dashboard;
