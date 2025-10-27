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
  CardContent,
  Snackbar,
  Link,
  Alert,
  CardActionArea
} from "@mui/material";
import { motion } from "framer-motion";
import { FaRecycle, FaSyringe, FaPills, FaTruck, FaClipboardCheck, FaHospital } from "react-icons/fa";
import { GiNuclearWaste } from "react-icons/gi";
import axios from "axios";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import image1 from "../assets/images/background_1.png";
import image2 from "../assets/images/background_2.png";
import "react-international-phone/style.css";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import FeedbackSlider from "./FeedbackSlider";
import ContentSlider from "./ContentSlider";
import CallToAction from "./CallToAction";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const API_BASE_URL = process.env.REACT_APP_API_URL;
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
    "title": "Environmental Responsibility",
    "description": "Safe disposal prevents harm to nature, protecting soil, water, and wildlife."
  },
  {
    "title": "Regulatory Compliance",
    "description": "Following guidelines ensures safety, ethical responsibility, and legal compliance."
  },
  {
    "title": "Community Well-being",
    "description": "Safe waste handling builds trust, protects lives, and upholds dignity."
  },
  {
    "title": "Protection of Healthcare Workers",
    "description": "Proper packaging prevents exposure, ensuring safety and accountability."
  },
  {
    "title": "Preventing Disease Transmission",
    "description": "Secure waste packaging stops infections, protecting workers and communities."
  },
];

const services = [
  { title: "Biomedical Waste Disposal", icon: <FaRecycle size={40} color="#003366" /> },
  { title: "Cytotoxic Waste Disposal", icon: <GiNuclearWaste size={40} color="#003366" /> },
  { title: "Anatomical Waste Disposal", icon: <FaPrescriptionBottleMedical size={40} color="#003366" /> },
  { title: "Pharmaceutical Waste Recovery", icon: <FaPills size={40} color="#003366" /> },
];


function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const handleFormClose = () => setFormOpen(false);
  const [setError] = useState("");
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

  // Handle Snackbar close
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
  }, [API_BASE_URL]);

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

  {/* File a complaint box */ }
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    if (!formData.contactNumber || !formData.description) {
      setError("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      // Use fetched userData from state instead of sessionStorage
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

      const response = await axios.post(
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "linear-gradient(to bottom, white, #f0f8ff)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box sx={{ background: "linear-gradient(to bottom, white, #f0f8ff)", minHeight: "100vh" }}>
        {/* Hero Section with Animation */}
        <Box
          sx={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
            zIndex: 1,
            width: "100vw",           // <-- Add this
            marginLeft: "calc(-50vw + 50%)", // <-- Add this to stretch full width even inside Container
          }}
        >

          <AwesomeSlider
            bullets={false}
            play
            interval={4000}
            style={{ height: "100vh", width: "100vw" }} // <-- Stretch full width
            organicArrows={false}
          >
            {[image1, image2].map((img, index) => (
              <div key={index} className="slide-container">
                <motion.img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover", // Make sure the image fills the area
                  }}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                />

              </div>
            ))}
          </AwesomeSlider>

          {/* Optional overlay text */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              zIndex: 2,
              textAlign: "center",
              px: 2
            }}
          >

          </Box>
        </Box>

        {/* Image slider with content box */}
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>

          </Typography>
          <Grid container spacing={5} alignItems="stretch">
            {/* Right Content Slider */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation
                  autoplay={{ delay: 3000 }}
                  spaceBetween={20}
                  slidesPerView={1}
                  style={{ width: "100%", height: "100%" }}
                >
                  {[
                    { title: "Biohazard Experts", text: "Specialists in safe, compliant waste disposal." },
                    { title: "Saskatchewan-Based", text: "Family-owned, serving communities with excellence." },
                    { title: "Leading Since 1992", text: "Western Canada’s trusted name in biohazard recovery." },
                    { title: "Strategic Locations", text: "Operations in Regina, Saskatoon & Aberdeen, SK." },
                    { title: "Biomed Invex Portal", text: "This Biomed Invex portal would provide you invoices, waybills integrated with the complaint portal." },
                  ].map((slide, index) => (
                    <SwiperSlide key={index}>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: "16px",
                          padding: "35px",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          textAlign: "center",
                          border: "1px solid rgba(216, 232, 247, 0.91)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "320px",
                          transition: "all 0.3s ease-in-out",
                          '&:hover': {
                            transform: "scale(1.03)",
                            boxShadow: "0px 10px 25px rgba(44, 56, 233, 0.5)"
                          }
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            background: " #092C74",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {slide.title}
                        </Typography>
                        <Typography sx={{
                          fontSize: "20px",
                          mb: 2,
                        }} color="textSecondary">
                          {slide.text}
                        </Typography>
                        <Button
                          variant="contained"
                          component="a"
                          href="https://www.biomedwaste.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            mt: 3,
                            background: "linear-gradient(to right, #BAC400, #E0E721)",
                            color: "#092C74",
                            px: 4,
                            py: 1,
                            borderRadius: "12px",
                            boxShadow: "0px 4px 12px rgba(44, 56, 233, 0.4)",
                            '&:hover': { background: "linear-gradient(135deg,rgb(98, 129, 233),rgb(164, 208, 231))" },
                          }}
                        ><b>
                            Learn More</b>
                        </Button>
                        {<Button
                          variant="contained"
                          sx={{
                            mt: 3,
                            background: "linear-gradient(to right, #BAC400, #E0E721)",
                            color: "#092C74",
                            px: 4,
                            py: 1,
                            borderRadius: "12px",
                            boxShadow: "0px 4px 12px rgba(44, 56, 233, 0.4)",
                            '&:hover': { background: "linear-gradient(135deg,rgb(98, 129, 233),rgb(164, 208, 231))" },
                          }}
                          onClick={() => setFormOpen(true)}
                        ><b>
                            File a Complaint </b>
                        </Button>}
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Grid>

            {/* Left Image Slider */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "16px",
                  boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                  padding: "10px",
                  transition: "all 0.3s ease-in-out",
                  '&:hover': { transform: "scale(1.02)", boxShadow: "0px 10px 25px rgba(44, 56, 233, 0.5)" },
                }}
              >
                <Swiper modules={[Autoplay]} autoplay={{ delay: 4000 }} spaceBetween={20} slidesPerView={1} style={{ width: "100%", height: "100%" }}>
                  <SwiperSlide>
                    <ContentSlider />
                  </SwiperSlide>
                </Swiper>
              </Box>
            </Grid>
          </Grid>
        </Container>


        {/* Services Section with Animation */}
        <Container sx={{ mt: 10 }}>
          <Typography variant="h5" sx={{ mt: 4, textAlign: "center", fontWeight: "bold", color: "#003366" }}>
            Biomedical Waste Management Services
          </Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card sx={{ textAlign: "center", boxShadow: 3, p: 3, '&:hover': { transform: "scale(1.00)", boxShadow: "5px 6px 16px rgb(44, 56, 233)", } }}>
                    <CardActionArea component="a" href={`https://biomedwaste.com/services/`} target="_blank" rel="noopener noreferrer">
                      {service.icon}
                      <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#003366" }}>
                        {service.title}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
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

        <Box sx={{ mt: 8, py: 4, background: "rgb(4, 23, 65)", borderRadius: 2 }}>
          <Container sx={{ mt: 6, mb: 6, textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#fff" }}>
              About Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#fff" }}>
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
                  <Card sx={{ textAlign: "center", cursor: "pointer", boxShadow: 3, p: 2, borderRadius: 20, '&:hover': { transform: "scale(1.00)", boxShadow: "5px 6px 16px rgb(44, 56, 233)", } }}>
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
      background-color: #fff;
    }
    .swiper-pagination-bullet-active {
      background-color: #fff;
      transform: scale(1.3);
    }
    .swiper-button-prev, .swiper-button-next {
      color: #fff;
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
        <Container sx={{ mt: 8, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              mb: 10,
              textAlign: "center",
              fontWeight: "bold",
              color: "#003366",
            }}
          >
            Services We Offer
          </Typography>
          <Grid container spacing={4} >
            {/* Services Section */}

            <Grid container spacing={4}>
              {[
                {
                  title: "Biomedical Waste Disposal",
                  description: "We process all types of biohazardous waste, ensuring safe and compliant disposal.",
                  icon: <FaRecycle size={40} color="#003366" />,
                  link: "https://www.biomedwaste.com/",
                },
                {
                  title: "Sharps Container Management",
                  description: "Comprehensive management solutions for sharps containers in medical facilities.",
                  icon: <FaSyringe size={40} color="#003366" />,
                  link: "https://biomedwaste.com/services/secure-a-sharp-service-program/",
                },
                {
                  title: "Pharmaceutical Waste Recovery",
                  description: "Specialized recovery and disposal of expired or unused pharmaceuticals.",
                  icon: <FaHospital size={40} color="#003366" />,
                  link: "https://biomedwaste.com/product-category/recovery/",
                },
                {
                  title: "Customizable Pickup Schedules",
                  description: "Flexible scheduling to suit your waste collection needs. For booking a pickup, fill out a short form from our website.",
                  icon: <FaTruck size={40} color="#003366" />,
                  link: "https://biomedwaste.com/book-a-pickup/",
                },
                {
                  title: "Compliance and Reporting Assistance",
                  description: "Expert support in meeting regulatory compliance and reporting requirements.",
                  icon: <FaClipboardCheck size={40} color="#003366" />,
                  link: "https://biomedwaste.com/contact/",
                },
                {
                  title: "Secure-A-Sharp® Service Program",
                  description: "The Secure-A-Sharp® line of sharps containers, secure needle boxes and accessories are designed to reduce the risk of needle stick injuries in public and private spaces.",
                  icon: <FaSyringe size={40} color="#003366" />,
                  link: "https://biomedwaste.com/services/secure-a-sharp-service-program/",
                },
                {
                  title: "Cytotoxic Waste Disposal",
                  description: "Safe and efficient handling of cytotoxic and hazardous medical waste.",
                  icon: <GiNuclearWaste size={40} color="#003366" />,
                  link: "https://www.biomedwaste.com/",
                },
                {
                  title: "Anatomical Waste Disposal",
                  description: "Ethical and secure disposal of anatomical waste with utmost care.",
                  icon: <FaPrescriptionBottleMedical size={40} color="#003366" />,
                  link: "https://biomedwaste.com/product-category/recovery/",
                },
                {
                  title: "Terra™ Program",
                  description: "Simple, cost-effective sharps management for clinical settings, prioritizing sustainability.",
                  icon: <FaRecycle size={40} color="#003366" />,
                  link: "https://biomedwaste.com/product-category/terra/",
                },
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ height: "100%" }}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <Card sx={{ textAlign: "center", boxShadow: 3, borderRadius: 2, overflow: "hidden", cursor: "pointer", '&:hover': { transform: "scale(1.00)", boxShadow: "5px 6px 16px rgb(44, 56, 233)", } }}>
                        <CardContent>
                          <div style={{ marginBottom: "16px" }}>{item.icon}</div>
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            {/* Animated Image Section */}
          </Grid>
        </Container>

      </Box>
      {/* Proper Waste Packaging Section */}
      <Box sx={{ mt: 8, py: 4, background: "rgb(172, 214, 72)", borderRadius: 2 }}>
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
                <Card sx={{ textAlign: "center", boxShadow: 3, p: 2, borderRadius: 20, '&:hover': { transform: "scale(1.00)", boxShadow: "5px 6px 16px rgb(59, 143, 4)", } }}>
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
          Trusted by Industry Leaders
        </Typography>
        <FeedbackSlider />
      </Container>
      <CallToAction />
      {/* Footer */}
      <Box sx={{ backgroundColor: "#333", color: "#fff", textAlign: "center", py: 4 }}>
        <Typography variant="body2">
          © 2025 Biomed Waste Recovery and Disposal Ltd. All rights reserved.
        </Typography>
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
