import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Modal,
  Card,
  CardContent,
  Snackbar,
  Link,
  Alert
} from "@mui/material";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaRecycle, FaSyringe, FaPills, FaCalendarAlt, FaFileAlt, FaTruck, FaClipboardCheck, FaHospital } from "react-icons/fa";
import { GiNuclearWaste } from "react-icons/gi";
import axios from "axios";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import image1 from "../assets/images/bg_full_home.png";
import image3 from "../assets/images/bg_full_2.png";
import biomedman from "../assets/images/biomedman.png";
import "react-international-phone/style.css";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import FeedbackSlider from "./FeedbackSlider";

const slides = [
  {
    "title": "Worker Safety",
    "description": "Proper packaging limits exposure, ensuring safety and accountability in healthcare."
  },
  {
    "title": "Infection Control",
    "description": "Secure waste containment prevents disease spread, protecting workers and communities."
  },
  {
    "title": "Eco Protection",
    "description": "Responsible disposal safeguards soil, water, wildlife, and promotes sustainability."
  },
  {
    "title": "Legal Compliance",
    "description": "Adhering to guidelines ensures public safety, ethical duty, and prevents penalties."
  },
  {
    "title": "Public Trust",
    "description": "Safe waste handling protects communities, upholds dignity, and fosters confidence."
  }
];

const criticalRoleSlides = [
  {
    "title": "Protection of Healthcare Workers",
    "description": "Proper packaging prevents exposure, ensuring safety and accountability."
  },
  {
    "title": "Preventing Disease Transmission",
    "description": "Secure waste packaging stops infections, protecting workers and communities."
  },
  {
    "title": "Environmental Responsibility",
    "description": "Safe disposal prevents harm to nature, protecting soil, water, and wildlife."
  },
  {
    "title": "Regulatory Compliance",
    "description": "Following guidelines ensures safety, ethical responsibility, and legal compliance."
  },
  {
    "title": "Community Well-being Commitment",
    "description": "Safe waste handling builds trust, protects lives, and upholds dignity."
  }];

const services = [
  { title: "Biomedical Waste Disposal", icon: <FaRecycle size={40} color="#003366" /> },
  { title: "Cytotoxic Waste Disposal", icon: <GiNuclearWaste size={40} color="#003366" /> },
  { title: "Anatomical Waste Disposal", icon: <FaSyringe size={40} color="#003366" /> },
  { title: "Pharmaceutical Waste Recovery", icon: <FaPills size={40} color="#003366" /> },
  { title: "Customizable Pickup Schedules", icon: <FaCalendarAlt size={40} color="#003366" /> },
  { title: "Compliance Assistance", icon: <FaFileAlt size={40} color="#003366" /> },
];

const complaintData = [
  { month: "Apr", complaints: 2 },
  { month: "May", complaints: 0 },
  { month: "Jun", complaints: 0 },
  { month: "Jul", complaints: 0 },
];

const testimonials = [
  { name: "John Doe", feedback: "Biomed’s services exceeded our expectations!" },
  { name: "Jane Smith", feedback: "Highly reliable and professional team!" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const handleFormOpen = () => setFormOpen(true);
  const handleFormClose = () => setFormOpen(false);
  const [setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [facilityName, setFacilityName] = useState();
  const userSession = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userSession ? userSession.id : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contactNumber: "",
    description: "",
    photos: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      setLoading(false);
      setFacilityName(userData.facility);
    }

    setSnackbar({
      open: true,
      message: `Hello ${userData.facility}!`,
      severity: "success",
    });
  }, [userId]);

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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // ✅ Now it's properly defined

    if (!formData.contactNumber || !formData.description) {
      setError("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("facility", facilityName);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("description", formData.description);

      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo.file);
      });

      setLoading(true);

      const response = await axios.post(
        `http://35.182.166.248/api/client-complaint/add`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSnackbar({
        open: true,
        message: "New complaint submitted successfully!",
        severity: "success",
      });

      setFormData({ contactNumber: "", description: "", photos: [] });
      localStorage.removeItem("formData");
      setLoading(false);
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


  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos.splice(index, 1);
      const updatedForm = { ...prev, photos: updatedPhotos };
      localStorage.setItem("formData", JSON.stringify(updatedForm));
      return updatedForm;
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
    <Box sx={{ background: "linear-gradient(to bottom, white, #f0f8ff)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box sx={{ background: "linear-gradient(to bottom, white, #f0f8ff)", minHeight: "100vh" }}>
        {/* Hero Section with Animation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Box sx={{ position: "relative", textAlign: "center", color: "white", pb: 6, pt: 4 }}>
            <AwesomeSlider bullets={false} play interval={4000} style={{ height: "500px" }}>
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
                </div>))}
            </AwesomeSlider>
            <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>Leading Biohazard Waste Disposal</Typography>
          </Box>
        </motion.div>

        {/* Services Section with Animation */}
        <Container>
          <Typography variant="h5" sx={{ mt: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>Our Services</Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card sx={{ textAlign: "center", boxShadow: 3, p: 3 }}>
                    {service.icon}
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#003366" }}>{service.title}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Complaints Chart */}
        <Container sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#003366" }}>Monthly Complaints Overview</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#003366" />
            </BarChart>
          </ResponsiveContainer>

          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#A9AC2B", "&:hover": { backgroundColor: "#8C9A1B" } }}
            onClick={() => setFormOpen(true)}
          >
            File a Complaint
          </Button>
        </Container>
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
                value={formData.description || ""}
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
          onClick={() => navigate("/blogs")}
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

        <Box sx={{ mt: 8, py: 4, background: "linear-gradient(to right, #e0e721, #bac400, #306be3)", borderRadius: 2 }}>
          <Container sx={{ mt: 6, mb: 6, textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#003366" }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#003366" }}>
              Properly packaging waste is essential to safeguarding health, ensuring regulatory compliance, and protecting the environment.
              This portal provides the tools and knowledge you need to adopt effective packaging practices that promote safety and sustainability.
            </Typography>
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {slides.map((item, index) => (
                <SwiperSlide key={index}>
                  <Card sx={{ textAlign: "center", boxShadow: 3, p: 2, borderRadius: 20 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 3, color: "#003366" }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="swiper-pagination">

              <style>
                {`
    .swiper-pagination {
      position: absolute;
      bottom: -30px; /* Adjust to move dots lower */
      left: 50%;
      transform: translateX(-50%);
    }
    .swiper-pagination-bullet {
      width: 20px;
      height: 20px;
      left: 577px;
      position: relative;
      background-color: #306be3;
    }
    .swiper-pagination-bullet-active {
      background-color: #306be3;
      transform: scale(1.3);
    }
    .swiper-button-prev, .swiper-button-next {
      color: #306be3;
      width: 40px;
      height: 40px;
    }
    .swiper-button-prev {
      left: -50px;
    }
    .swiper-button-next {
      right: -50px;
    }
  `}
              </style></div>
          </Container>
        </Box>
        <Container sx={{ mt: 8 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Services Section */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#003366",
                }}
              >
                Services We Offer
              </Typography>
              <Grid container spacing={4}>
                {[
                  {
                    title: "Biomedical Waste Disposal",
                    description:
                      "We process all types of biohazardous waste, ensuring safe and compliant disposal.",
                    icon: <FaRecycle size={40} color="#003366" />,
                  },
                  {
                    title: "Sharps Container Management",
                    description:
                      "Comprehensive management solutions for sharps containers in medical facilities.",
                    icon: <FaSyringe size={40} color="#003366" />,
                  },
                  {
                    title: "Pharmaceutical Waste Recovery",
                    description:
                      "Specialized recovery and disposal of expired or unused pharmaceuticals.",
                    icon: <FaHospital size={40} color="#003366" />,
                  },
                  {
                    title: "Customizable Pickup Schedules",
                    description: "Flexible scheduling to suit your waste collection needs.",
                    icon: <FaTruck size={40} color="#003366" />,
                  },
                  {
                    title: "Compliance and Reporting Assistance",
                    description:
                      "Expert support in meeting regulatory compliance and reporting requirements.",
                    icon: <FaClipboardCheck size={40} color="#003366" />,
                  },
                  {
                    title: "Secure-A-Sharp® Service Program",
                    description:
                      "Providing peace of mind to restaurants, service stations, and small businesses.",
                    icon: <FaSyringe size={40} color="#003366" />,
                  },
                  {
                    title: "Cytotoxic Waste Disposal",
                    description:
                      "Safe and efficient handling of cytotoxic and hazardous medical waste.",
                    icon: <FaRecycle size={40} color="#003366" />,
                  },
                  {
                    title: "Anatomical Waste Disposal",
                    description: "Ethical and secure disposal of anatomical waste with utmost care.",
                    icon: <FaHospital size={40} color="#003366" />,
                  },
                  {
                    title: "Terra™ Reusable Sharps Container Program",
                    description:
                      "Simple, cost-effective sharps management for clinical settings, prioritizing sustainability.",
                    icon: <FaRecycle size={40} color="#003366" />,
                  },
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        sx={{
                          textAlign: "center",
                          boxShadow: 3,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <CardContent>
                          <div style={{ marginBottom: "16px" }}>{item.icon}</div>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#003366" }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {/* Animated Image Section */}
            <Grid item xs={12} md={4}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  src={biomedman}
                  alt="Animated Illustration"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "16px",
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>

      </Box>
      {/* Proper Waste Packaging Section */}
      <Box sx={{ mt: 8, py: 4, background: "linear-gradient(to right, #e0e721, #bac400, #306be3)", borderRadius: 2 }}>
        <Container sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#092d74" }}>
            The Critical Role of Proper Waste Packaging
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 4, color: "#092d74" }}>
            Properly packaging waste is essential to safeguarding health, ensuring regulatory compliance, and protecting the environment.
            This portal provides the tools and knowledge you need to adopt effective packaging practices that promote safety and sustainability.
          </Typography>
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {criticalRoleSlides.map((item, index) => (
              <SwiperSlide key={index}>
                <Card sx={{ textAlign: "center", boxShadow: 3, p: 2, borderRadius: 20 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 3, color: "#003366" }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination-second">

            <style>
              {`
    .swiper-pagination {
      position: absolute;
    }
    .swiper-pagination-bullet {
      width: 20px;
      height: 20px;
      left: 577px;
      position: relative;
      background-color: #306be3;
    }
    .swiper-pagination-bullet-active {
      background-color: #306be3;
      transform: scale(1.3);
    }
    .swiper-button-prev, .swiper-button-next {
      color: #306be3;
      width: 40px;
      height: 40px;
    }
    .swiper-button-prev {
      left: -50px !important;
    }
    .swiper-button-next {
      right: -50px;
    }
  `}
            </style></div>
        </Container>
      </Box>

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
        <FeedbackSlider />
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

export default Dashboard;
