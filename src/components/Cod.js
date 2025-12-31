import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Footer from "./Footer";
import { motion } from "framer-motion";

function COD() {
  const [cods, setCods] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCod, setCurrentCod] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [expandedFacility, setExpandedFacility] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
      const currentUserId = currentUserSession?.id ? currentUserSession.id : currentUserSession?._id;
      if (!currentUserId) {
        console.error("User ID is undefined");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/user/${currentUserId}`);
        const approvedFacilities = response.data?.facilities
          .filter(facility => facility.approved)
          .map(facility => facility.name);

        setSelectedFacilities(approvedFacilities);
        if (approvedFacilities.length > 0) {
          setExpandedFacility(approvedFacilities[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchCods = async () => {
      try {
        const codsData = {};
        const fetchPromises = selectedFacilities.map(async (facility) => {
          try {
            const response = await axios.get(`${API_BASE_URL}/cod/facility/${facility}`);
            codsData[facility] = response.data.length ? response.data : [];
          } catch (error) {
            console.error(`Error fetching CODs for ${facility}:`, error);
            codsData[facility] = [];
          }
        });
        await Promise.all(fetchPromises);
        setCods((prevCods) => ({
          ...prevCods,
          ...codsData,
        }));
      } catch (error) {
        console.error("Error fetching CODs:", error);
      }
    };

    if (selectedFacilities.length > 0) {
      fetchCods();
    }
  }, [selectedFacilities, API_BASE_URL]);

  const handlePreviewOpen = (cod) => {
    setCurrentCod(cod);
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  const handleAccordionChange = (facility) => (event, isExpanded) => {
    setExpandedFacility(isExpanded ? facility : null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: "#f5f5f5" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 16 }, pb: 6, flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fff'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0D2477",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              Certificate of Destruction
            </Typography>

            {selectedFacilities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" mb={2}>
                  No facility has been selected
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Please navigate to your profile section to add facilities.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#0D2477",
                    "&:hover": { backgroundColor: "#1a3a8f" },
                    textTransform: "none",
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                  }}
                  href="/profile"
                >
                  Go to Profile
                </Button>
              </Box>
            ) : (
              <>
                {selectedFacilities.map((facility) => (
                  <Accordion
                    key={facility}
                    expanded={expandedFacility === facility}
                    onChange={handleAccordionChange(facility)}
                    elevation={0}
                    sx={{
                      border: 'none',
                      '&:before': { display: 'none' },
                      mb: 2,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#0D2477' }} />}
                      sx={{
                        px: 0,
                        '& .MuiAccordionSummary-content': {
                          margin: 0,
                        }
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        color="#0D2477"
                      >
                        {facility}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#fafafa" }}>
                              <TableCell sx={{ fontWeight: 600, color: '#0D2477', py: 2 }}>
                                File Name
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600, color: '#0D2477', py: 2 }}>
                                Preview
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600, color: '#0D2477', py: 2 }}>
                                Download
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600, color: '#0D2477', py: 2 }}>
                                Uploaded At
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cods[facility] && cods[facility].length > 0 ? (
                              cods[facility].map((cod) => (
                                <TableRow
                                  key={cod._id}
                                  sx={{
                                    '&:hover': { backgroundColor: '#fafafa' },
                                    '&:last-child td': { borderBottom: 0 }
                                  }}
                                >
                                  <TableCell sx={{ py: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <DescriptionOutlinedIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                                      <Typography variant="body2" color="text.primary">
                                        {cod.fileName || "N/A"}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2.5 }}>
                                    <IconButton
                                      onClick={() => handlePreviewOpen(cod)}
                                      sx={{
                                        color: '#0D2477',
                                        '&:hover': { backgroundColor: 'rgba(13, 36, 119, 0.08)' }
                                      }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2.5 }}>
                                    <IconButton
                                      component="a"
                                      href={`${API_BASE_URL}/cod/download/${cod._id}`}
                                      download={cod.fileName}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{
                                        color: '#4caf50',
                                        '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' }
                                      }}
                                    >
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 2.5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {cod.createdAt ? new Date(cod.createdAt).toLocaleString() : "N/A"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    No certificates available for this facility.
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )}
          </Paper>
        </motion.div>
      </Container>

      <Footer />

      <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#0D2477', fontWeight: 600 }}>
          Certificate of Destruction
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          {currentCod && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={`${API_BASE_URL}/cod/download/${currentCod._id}`} />
            </Worker>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePreviewClose}
            sx={{
              color: '#0D2477',
              textTransform: 'none',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default COD;
