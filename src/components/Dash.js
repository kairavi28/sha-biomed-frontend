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
import { FaRecycle, FaSyringe, FaPills, FaCalendarAlt, FaFileAlt, FaTruck, FaClipboardCheck, FaHospital } from "react-icons/fa";
import axios from "axios";
import "react-international-phone/style.css";
import { useNavigate } from "react-router-dom";
// import newImage from "../assets/images/new_image.png";

const services = [
  {
    title: "Biomedical Waste Disposal",
    description: "Biomed processes all kinds of biohazardous waste.",
    icon: <FaRecycle size={40} color="#003366" />,
  },
  {
    title: "Sharps Container Management",
    description: "Sharps Container Management",
    icon: <FaSyringe size={40} color="#003366" />,
  },
  {
    title: "Pharmaceutical Waste Recovery",
    description: "Safely recover and dispose of pharmaceutical waste.",
    icon: <FaPills size={40} color="#003366" />,
  },
  {
    title: "Customizable Pickup Schedules",
    description: "Flexible schedules tailored to your needs.",
    icon: <FaCalendarAlt size={40} color="#003366" />,
  },
  {
    title: "Compliance and Reporting Assistance",
    description: "Expert assistance with compliance and reporting.",
    icon: <FaFileAlt size={40} color="#003366" />,
  },
];

function Dash() {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [facilityName, setFacilityName] = useState();
  const userSession = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userSession ? userSession.id : null;
  const [formData, setFormData] = useState({
    contactNumber: "",
    description: "",
    photos: [],
  });

  useEffect(() => {
    if (userSession) {
      setLoading(false);
      setFacilityName(userSession.facility);
    }
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: "#f3f4f6" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          background: "#003366",
          color: "white",
          pb: 6,
          pt: 4,
        }}
      >
        {/* <img
          src={newImage}
          alt="New Banner"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        /> */}
        <Typography variant="h4" sx={{ mt: 3, fontWeight: "bold" }}>
          Professional Biohazard Waste Management
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#A9AC2B", "&:hover": { backgroundColor: "#8C9A1B" } }}
          onClick={() => setFormOpen(true)}
        >
          File a Complaint
        </Button>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", boxShadow: 3, p: 2 }}>
                <CardContent>
                  {service.icon}
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Dash;