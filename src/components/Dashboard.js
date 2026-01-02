import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaRecycle, FaTruck, FaLeaf, FaBoxOpen } from "react-icons/fa";
import { MdLocalHospital, MdScience, MdCheckCircle, MdWaterDrop, MdVerifiedUser, MdLocalShipping, MdRecycling } from "react-icons/md";
import axios from "axios";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import "react-international-phone/style.css";
import FeedbackSlider from "./FeedbackSlider";
import Footer from "./Footer";
import ComplaintModal from "./ComplaintModal";
import { Link as RouterLink } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

const wasteDisposalCards = [
  { title: "Biomedical", subtitle: "Waste Disposal", icon: <FaRecycle size={36} color="#D9DE38" /> },
  { title: "Container", subtitle: "Waste Disposal", icon: <MdWaterDrop size={36} color="#D9DE38" /> },
  { title: "Anatomical", subtitle: "Waste Disposal", icon: <MdVerifiedUser size={36} color="#D9DE38" /> },
  { title: "Pharmaceutical", subtitle: "Waste Services", icon: <FaBoxOpen size={36} color="#D9DE38" /> },
];

const servicesData = [
  {
    title: "Biomedical Waste Disposal",
    description: "Safe and compliant disposal of all types of biomedical waste following regulatory standards.",
    icon: <FaRecycle size={24} color="#ABB738" />,
  },
  {
    title: "Biohazard Waste Disposal",
    description: "Specialized handling and disposal of biohazardous materials with complete safety protocols.",
    icon: <MdScience size={24} color="#ABB738" />,
  },
  {
    title: "Waste Container Management",
    description: "Supply and management of appropriate waste containers for different waste categories.",
    icon: <FaBoxOpen size={24} color="#ABB738" />,
  },
  {
    title: "Compliance & Reporting",
    description: "Complete documentation and reporting to ensure regulatory compliance at all times.",
    icon: <MdVerifiedUser size={24} color="#ABB738" />,
  },
  {
    title: "Pharmaceutical Waste Services",
    description: "Secure disposal of pharmaceutical waste including expired medications and controlled substances.",
    icon: <FaPrescriptionBottleMedical size={24} color="#ABB738" />,
  },
  {
    title: "Sharps Disposal",
    description: "Safe collection and disposal of needles, syringes, and other sharp medical instruments.",
    icon: <MdLocalHospital size={24} color="#ABB738" />,
  },
  {
    title: "Waste Recycling Solutions",
    description: "Environmentally responsible recycling programs for applicable medical waste streams.",
    icon: <FaLeaf size={24} color="#ABB738" />,
  },
  {
    title: "Contamination Cleanup Activities",
    description: "Emergency response and cleanup services for contamination incidents and spills.",
    icon: <FaTruck size={24} color="#ABB738" />,
  },
  {
    title: "Antimicrobial Waste Disposal",
    description: "Specialized disposal services for antimicrobial waste with proper decontamination.",
    icon: <MdWaterDrop size={24} color="#ABB738" />,
  },
];

const criticalRoleItems = [
  { title: "Environmental Responsibility", description: "Safe disposal protects harm to nature, promoting eco-friendly solutions." },
  { title: "Regulatory Compliance", description: "Following guidelines ensures safety, ethical responsibility, and legal compliance." },
  { title: "Community Well-Being", description: "Safe waste handling builds trust, protects lives, and upholds dignity." },
  { title: "Protection of Healthcare Workers", description: "Proper packaging reduces exposure, ensuring safety and accountability." },
  { title: "Preventing Disease Transmission", description: "Secure waste packaging stops infectious, protecting workers and communities." },
];

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const handleFormClose = () => {
    setFormOpen(false);
    setError("");
  };
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const storedUser = sessionStorage.getItem("userData");
        if (!storedUser) {
          console.error("No user data found in sessionStorage");
          setLoading(false);
          return;
        }

        let currentUserSession;
        try {
          currentUserSession = JSON.parse(storedUser);
        } catch (e) {
          console.error("Invalid JSON in sessionStorage:", storedUser);
          sessionStorage.removeItem("userData");
          setLoading(false);
          return;
        }

        const currentUserId = currentUserSession.id || currentUserSession._id;
        if (!currentUserId) {
          console.error("User ID is undefined inside interval");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/user/${currentUserId}`);
        setUserData(response.data);

        if (response.data?.facilities?.some(facility => facility.approved)) {
          setSnackbar({
            open: true,
            message: `Hello ${response.data.firstname}!`,
            severity: "success",
          });
        }
      } catch (err) {
        console.error("Error checking facility approval:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
    setLoading(true);
    if (!formData.contactNumber || !formData.description) {
      setError("Please fill out all required fields.");
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstname", userData.firstname);
      formDataToSend.append("lastname", userData.lastname);
      formDataToSend.append("email", userData.email);

      const facilityNames = (userData.facilities || [])
        .map(f => f.name)
        .join(", ");
      formDataToSend.append("facilities", facilityNames);

      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("description", formData.description);

      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo.file);
      });

      setLoading(false);

      await axios.post(
        `${API_BASE_URL}/client-complaint/add`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSnackbar({
        open: true,
        message: "New complaint submitted successfully!",
        severity: "success",
      });

      setFormData({ contactNumber: "", description: "", photos: [] });
      localStorage.removeItem("formData");
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#f3f4f6" }}
      >
        <CircularProgress sx={{ color: "#1a2744" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "auto", md: "400px" },
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mt: { xs: "100px", md: "110px" },
          py: { xs: 10, md: 12 },
          px: { xs: 2, md: 4 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(26, 39, 68, 0.85)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, px: { xs: 2, md: 6 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "inline-block",
                  backgroundColor: "#D9DE38",
                  color: "#1a2744",
                  px: 2,
                  py: 0.5,
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Welcome Back
              </Box>
              <Typography
                variant="h3"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Welcome to Biomed<br />Invex Portal
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  mb: 4,
                  lineHeight: 1.7,
                  maxWidth: "450px",
                }}
              >
                Manage your biomedical waste services, and access compliance documents all in one place.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "#D9DE38",
                    color: "#1a2744",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: "25px",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    "&:hover": {
                      background: "#c5ca2e",
                    },
                  }}
                  onClick={() => setComplaintModalOpen(true)}
                >
                  File a Complaint
                </Button>
                <Button
                  variant="outlined"
                  href="https://biomedwaste.com/services/"
                  target="_blank"
                  sx={{
                    borderColor: "#1a2744",
                    backgroundColor: "#1a2744",
                    color: "#ffffff",
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: "24px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#2a3754",
                      borderColor: "#2a3754",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    p: 0,
                    overflow: "hidden",
                    maxWidth: "380px",
                    ml: { xs: 0, md: "auto" },
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "rgba(13, 36, 119, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdCheckCircle size={24} color="#0D2477" />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", fontSize: "13px" }}
                        >
                          Quick Actions
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#0D2477", fontWeight: 600 }}
                        >
                          Get Started
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      component={RouterLink}
                      to="/request-products"
                      sx={{
                        justifyContent: "flex-start",
                        py: 1.5,
                        px: 2,
                        mb: 1,
                        borderRadius: "8px",
                        textTransform: "none",
                        color: "#1a2744",
                        "&:hover": { backgroundColor: "rgba(13, 36, 119, 0.05)" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "6px", backgroundColor: "#D9DE38", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MdLocalShipping size={18} color="#1a2744" />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Request Products</Typography>
                      </Box>
                    </Button>
                    <Button
                      fullWidth
                      component={RouterLink}
                      to="/instruction"
                      sx={{
                        justifyContent: "flex-start",
                        py: 1.5,
                        px: 2,
                        mb: 1,
                        borderRadius: "8px",
                        textTransform: "none",
                        color: "#1a2744",
                        "&:hover": { backgroundColor: "rgba(13, 36, 119, 0.05)" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "6px", backgroundColor: "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MdRecycling size={18} color="#0D2477" />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Waste Packaging Guide</Typography>
                      </Box>
                    </Button>
                    <Button
                      fullWidth
                      component={RouterLink}
                      to="/cod"
                      sx={{
                        justifyContent: "flex-start",
                        py: 1.5,
                        px: 2,
                        borderRadius: "8px",
                        textTransform: "none",
                        color: "#1a2744",
                        "&:hover": { backgroundColor: "rgba(13, 36, 119, 0.05)" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "6px", backgroundColor: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MdCheckCircle size={18} color="#4caf50" />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>View Certificates</Typography>
                      </Box>
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Medical Waste Disposal Across Canada Section */}
      <Box
        sx={{
          py: { xs: 5, md: 8 },
          background: "#ffffff",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0D2477",
                mb: 1,
                fontSize: { xs: "1.4rem", md: "2rem" },
                display: "inline-block",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  height: "4px",
                  // backgroundColor: "#D9DE38",
                },
              }}
            >
              Medical Waste Disposal Across Saskatchewan
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#1A1A1A",
                mt: 2,
                maxWidth: 750,
                mx: "auto",
                px: { xs: 1, md: 0 },
                fontSize: { xs: "0.9rem", md: "1.0rem" },
                fontWeight: "bold"
              }}
            >
              Comprehensive solutions for safe handling, disposal, and management of biomedical waste
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {wasteDisposalCards.map((item, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card
                    sx={{
                      backgroundColor: "#ffffff",
                      border: "3px solid #D9DE38",
                      borderRadius: "20px",
                      p: { xs: 2.5, md: 3.5 },
                      textAlign: "center",
                      minHeight: { xs: 150, md: 180 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: 55,
                        height: 55,
                        borderRadius: "50%",
                        backgroundColor: "rgba(171, 183, 56, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ color: "#1A1A1A", fontWeight: 700, lineHeight: 1.4, fontSize: { xs: "0.9rem", md: "1.0rem" } }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#1A1A1A", fontWeight: 700, lineHeight: 1.4, fontSize: { xs: "0.9rem", md: "1.0rem" } }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box sx={{ py: { xs: 10, md: 12 }, backgroundColor: "#f8f9fa" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0D2477",
                fontSize: { xs: "1.5rem", md: "2.125rem" },
                display: "inline-block",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  color: "#0D2477",
                },
              }}
            >
              About Us
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#1A1A1A",
              mb: { xs: 4, md: 6 },
              maxWidth: 800,
              mx: "auto",
              px: { xs: 2, md: 0 },
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7
            }}
          >
            Invex is our digital platform designed for our customers, enabling healthcare facilities and partner businesses to efficiently manage their waste services. Through Invex, clients can access critical business services, maintain regulatory compliance, ensure proper waste segregation and packaging, and track their waste from pickup to disposal—helping protect healthcare workers, patients, and the environment.
          </Typography>

          {/* First row - 3 cards */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    border: "1px solid #D9D9D9",
                    p: { xs: 2, md: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "70%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Worker Safety
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1A1A1A", lineHeight: 1.6, fontSize: { xs: "0.9rem", md: "1.0rem" } }}>
                    Proper packaging limits exposure, ensuring safety and accountability in healthcare.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    border: "1px solid #D9D9D9",
                    p: { xs: 2, md: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "70%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Infection Control
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1A1A1A", lineHeight: 1.6, fontSize: { xs: "0.9rem", md: "1.0rem" } }}>
                    Secure waste containment prevents disease spread, protecting workers and communities.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    border: "1px solid #D9D9D9",
                    p: { xs: 2, md: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "70%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Eco Protection
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1A1A1A", lineHeight: 1.6, fontSize: { xs: "0.9rem", md: "1.0rem" } }}>
                    Responsible disposal safeguards soil, water, wildlife, and promotes sustainability.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Second row - 2 cards centered */}
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 2.0 }}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    border: "1px solid #D9D9D9",
                    p: { xs: 2, md: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "70%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Legal Compliance
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1A1A1A", lineHeight: 1.6, fontSize: { xs: "0.9rem", md: "1.0rem" } }}>
                    Adhering to guidelines ensures public safety, ethical duty, and prevents penalties.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    border: "1px solid #D9D9D9",
                    p: { xs: 2, md: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "70%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Public Trust
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1A1A1A", lineHeight: 1.6, fontSize: { xs: "0.9rem", md: "1.0rem" } }}>
                    Safe waste handling protects communities, upholds dignity, and fosters confidence.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services We Offer Section */}
      <Box
        sx={{
          py: { xs: 5, md: 8 },
          background: "#ffffff",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0D2477",
                fontSize: { xs: "1.4rem", md: "2rem" },
                display: "inline-block",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                },
              }}
            >
              Services We Offer
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "#1A1A1A",
                maxWidth: 750,
                mx: "auto",
                mt: 2,
                px: { xs: 1, md: 0 },
                fontSize: { xs: "0.9rem", md: "1.0rem" },
                fontWeight: "bold",
                mb: { xs: 4, md: 6 },
              }}
            >
              Comprehensive biomedical waste management solutions tailored for your facility's needs
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {servicesData.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: { xs: 2.5, md: 3 },
                      borderRadius: "16px",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "#FEFEFE",
                    }}
                  >
                    <Box
                      sx={{
                        width: 55,
                        height: 55,
                        borderRadius: "50%",
                        backgroundColor: "rgba(171, 183, 56, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#0D2477", mb: 1, fontSize: { xs: "1rem", md: "1.1rem" } }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1A1A1A",
                        fontSize: { xs: "0.9rem", md: "1.0rem" },
                        lineHeight: 1.6,
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Critical Role of Proper Waste Packaging Section */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: "#EAED97" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#0D2477",
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2.25rem" },
              px: { xs: 2, md: 0 },
            }}
          >
            The Critical Role of Proper Waste Packaging
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#1A1A1A",
              mt: 2,
              maxWidth: 600,
              mx: "auto",
              px: { xs: 1, md: 0 },
              fontSize: { xs: "0.9rem", md: "1.0rem" },
              fontWeight: "bold"
            }}
          >
            Ensuring safe, compliant, and responsible disposal of medical waste through proper packaging practices
          </Typography>
          <Box sx={{ display: "flex", mt: 3, flexDirection: "column", gap: 2, maxWidth: 800, mx: "auto" }}>
            {criticalRoleItems.map((item, index) => (
              <motion.div key={index} whileHover={{ x: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: { xs: 2.5, md: 3 },
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 0.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 0,
                        height: 0,
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderLeft: "12px solid #ABB738",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#0D2477", mb: 0.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Trusted by Industry Leaders Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#ffffff" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: "#0D2477",
                mb: 2,
                fontSize: { xs: "1.5rem", md: "2.25rem" },
                px: { xs: 2, md: 0 },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "3px",
                  borderRadius: "2px",
                },
              }}
            >
              Trusted by Industry Leaders
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "#1A1A1A",
                mt: 2,
                maxWidth: 600,
                mx: "auto",
                px: { xs: 1, md: 0 },
                fontSize: { xs: "0.9rem", md: "1.0rem" },
                fontWeight: "bold"
              }}
            >
              Partnering with healthcare and industry leaders across Canada
            </Typography>
          </Box>
          <FeedbackSlider />
        </Container>
      </Box>
      {/* Footer */}
      <Footer />

      {/* Complaint Modal */}
      <ComplaintModal
        open={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        onSuccess={(message) => {
          setSnackbar({ open: true, message, severity: "success" });
        }}
        onError={(message) => {
          setSnackbar({ open: true, message, severity: "error" });
        }}
      />

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
    </Box>
  );
}

export default Dashboard;
