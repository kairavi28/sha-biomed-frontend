import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Modal,
  Card,
  Snackbar,
  Link,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaRecycle, FaTruck, FaLeaf, FaBoxOpen } from "react-icons/fa";
import { MdLocalHospital, MdScience, MdCheckCircle, MdWaterDrop, MdVerifiedUser } from "react-icons/md";
import axios from "axios";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import "react-international-phone/style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

const wasteDisposalCards = [
  { title: "Biomedical", subtitle: "Waste Disposal", icon: <FaRecycle size={36} color="#ABB738" /> },
  { title: "Container", subtitle: "Waste Disposal", icon: <MdWaterDrop size={36} color="#ABB738" /> },
  { title: "Anatomical", subtitle: "Waste Disposal", icon: <MdVerifiedUser size={36} color="#ABB738" /> },
  { title: "Pharmaceutical", subtitle: "Waste Services", icon: <FaBoxOpen size={36} color="#ABB738" /> },
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
  { number: "1", title: "Regulatory Compliance", description: "Following guidelines ensures safety, ethical responsibility, and legal compliance." },
  { number: "2", title: "Environmental Responsibility", description: "Safe disposal prevents harm to nature, protecting soil, water, and wildlife." },
  { number: "3", title: "Protection of Healthcare Workers", description: "Proper packaging prevents exposure, ensuring safety and accountability." },
  { number: "4", title: "Preventing Disease Transmission", description: "Secure waste packaging stops infections, protecting workers and communities." },
  { number: "5", title: "Protecting Human Dignity", description: "Ethical handling of anatomical waste respects patients and families." },
];

const partnerLogos = [
  { name: "Sask Health", logo: "https://via.placeholder.com/150x60?text=Sask+Health" },
  { name: "Canadian Medical", logo: "https://via.placeholder.com/150x60?text=Canadian+Medical" },
  { name: "Veterinary Association", logo: "https://via.placeholder.com/150x60?text=Vet+Association" },
  { name: "Healthcare Standards", logo: "https://via.placeholder.com/150x60?text=Healthcare" },
];

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
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
          py: { xs: 6, md: 8 },
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
                Manage your biomedical waste services, schedule pickups, and access compliance documents all in one place.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={() => setFormOpen(true)}
                  sx={{
                    backgroundColor: "#D9DE38",
                    color: "#1a2744",
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: "24px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#c5ca32",
                    },
                  }}
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
                          backgroundColor: "rgba(171, 183, 56, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdCheckCircle size={24} color="#ABB738" />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", fontSize: "13px" }}
                        >
                          Account Status
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#ABB738", fontWeight: 600 }}
                        >
                          Active & Compliant
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1.5,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Next Pickup
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1a2744", fontWeight: 600 }}
                      >
                        Oct 30, 2025
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1.5,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Active Services
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1a2744", fontWeight: 600 }}
                      >
                        3 Services
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Current Balance
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1a2744", fontWeight: 600 }}
                      >
                        $0.00
                      </Typography>
                    </Box>
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
                fontStyle: "italic",
              }}
            >
              Medical Waste Disposal Across Canada
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666666",
                mt: 4,
                maxWidth: 550,
                mx: "auto",
                px: { xs: 2, md: 0 },
                fontSize: { xs: "0.85rem", md: "0.95rem" },
              }}
            >
              Comprehensive and safe biomedical handling, disposal, and management of biomedical waste
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
                      sx={{ color: "#1a2744", fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#1a2744", fontWeight: 500, fontSize: { xs: "0.85rem", md: "0.9rem" } }}
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
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: "#f8f9fa" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0D2477",
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2.125rem" },
                display: "inline-block",
                position: "relative",
                fontStyle: "italic",
              }}
            >
              About Us
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: { xs: 4, md: 6 },
              maxWidth: 800,
              mx: "auto",
              px: { xs: 2, md: 0 },
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.8,
              mt: 4,
            }}
          >
            Biomed Invex is a leader in biomedical waste management solutions. We help healthcare facilities across Canada maintain the highest standards of safety and regulatory compliance. Proper waste packaging isn't just a regulatory obligation—it's essential for protecting healthcare workers, patients, and the environment.
          </Typography>
          
          {/* First row - 3 cards */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: { xs: 3, md: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "100%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Worker Safety
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
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
                    p: { xs: 3, md: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "100%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Infection Control
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
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
                    p: { xs: 3, md: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "100%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Eco Protection
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
                    Responsible disposal safeguards soil, water, wildlife, and promotes sustainability.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Second row - 2 cards centered */}
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ height: "100%", position: "relative", zIndex: 1 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: { xs: 3, md: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "100%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Legal Compliance
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
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
                    p: { xs: 3, md: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    height: "100%",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#0D2477", mb: 1.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Public Trust
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, fontSize: { xs: "0.85rem", md: "0.9rem" } }}>
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
                fontStyle: "italic",
              }}
            >
              Services We Offer
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#1A1A1A",
              maxWidth: 750,
              mx: "auto",
              px: { xs: 1, md: 0 },
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              fontWeight: "bold",
              mb: { xs: 4, md: 6 },
            }}
          >
            Comprehensive biomedical waste management solutions tailored for your facility's needs
          </Typography>
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
                        fontSize: { xs: "0.85rem", md: "0.9rem" },
                        lineHeight: 1.7,
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
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: "#D9DE38" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#1a2744",
              mb: 2,
              fontSize: { xs: "1.3rem", md: "2.125rem" },
              px: { xs: 2, md: 0 },
              fontStyle: "italic",
            }}
          >
            The Critical Role of Proper Waste Packaging
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#1a2744",
              mb: { xs: 4, md: 6 },
              maxWidth: 700,
              mx: "auto",
              opacity: 0.9,
              px: { xs: 2, md: 0 },
            }}
          >
            Properly packaging waste is essential to safeguarding health, ensuring regulatory compliance, and protecting the environment.
          </Typography>
          <Grid container spacing={3}>
            {criticalRoleItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div whileHover={{ x: 5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#1a2744",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {item.number}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#1a2744", mb: 0.5 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1a2744", opacity: 0.8 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trusted by Industry Leaders Section */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: "#ffffff" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#1a2744",
              mb: { xs: 4, md: 6 },
              fontSize: { xs: "1.5rem", md: "2.125rem" },
            }}
          >
            Trusted by Industry Leaders
          </Typography>
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            style={{ paddingBottom: "40px" }}
          >
            {partnerLogos.map((partner, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 100,
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", fontWeight: 500 }}
                  >
                    {partner.name}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#1a2744", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 700, mb: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                Biomed Recovery & Disposal Ltd.
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
                Western Canada's trusted leader in biomedical waste management since 1992.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={4}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 600, mb: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link href="https://biomedwaste.com/about/" target="_blank" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#D9DE38" }, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                  About Us
                </Link>
                <Link href="https://biomedwaste.com/services/" target="_blank" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#D9DE38" }, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                  Services
                </Link>
                <Link href="https://biomedwaste.com/contact/" target="_blank" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#D9DE38" }, fontSize: { xs: "0.85rem", md: "0.875rem" } }}>
                  Contact
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={12} md={4}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 600, mb: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                Saskatchewan, Canada
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                Phone: 1-800-361-5865
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                Email: info@biomedwaste.com
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 4,
              pt: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
              © 2025 Biomed Recovery and Disposal Ltd. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Complaint Modal */}
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
            <Box sx={{ textAlign: "center", display: "flex", gap: 2 }}>
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
                onClick={handleFormClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

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
