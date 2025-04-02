import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";


function COD() {
  const [cods, setCods] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCod, setCurrentCod] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
      const currentUserId = currentUserSession.id ? currentUserSession.id : currentUserSession._id;
      if (!currentUserId) {
        console.error("User ID is undefined");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://www.biomedwaste.net/api/user/${currentUserId}`);
        const approvedFacilities = response.data?.facilities
          .filter(facility => facility.approved)
          .map(facility => facility.name);

        setUserData(response.data);
        setSelectedFacilities(approvedFacilities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCods = async () => {
      try {
        const codsData = {};
        const fetchPromises = selectedFacilities.map(async (facility) => {
          try {
            const response = await axios.get(`http://www.biomedwaste.net/api/cod/${facility}`);
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
  }, [selectedFacilities]);

  const handlePreviewOpen = (cod) => {
    setCurrentCod(cod);
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: "#f3f4f6" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      background: "linear-gradient(to right,rgb(226, 237, 240),rgb(222, 233, 247))",
      minHeight: "100vh",
      py: 5,
      display: "flex",
      flexDirection: "column",
    }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
      <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
        {selectedFacilities.map((facility) => (
          <Box key={facility} sx={{ mb: 3 }}>
            <CardHeader
              title={<Typography variant="h6" color="#092C74" sx={{ fontWeight: "bold" }}>Certificate of Destruction for {facility}</Typography>}
            />
            <CardContent>
              <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell><strong>File Name</strong></TableCell>
                      <TableCell><strong>Preview</strong></TableCell>
                      <TableCell><strong>Download</strong></TableCell>
                      <TableCell><strong>Uploaded At</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(cods[facility] && cods[facility].length > 0) ? (
                      cods[facility].map((cod) => (
                        <TableRow key={cod._id} hover>
                          <TableCell>{cod.fileName || "N/A"}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={() => handlePreviewOpen(cod)}>
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton color="success" component="a" href={`http://www.biomedwaste.net/api/cod/${cod.fileName}`} download target="_blank" rel="noopener noreferrer">
                              <DownloadIcon />
                            </IconButton>

                          </TableCell>
                          <TableCell>{cod.uploadedAt ? new Date(cod.uploadedAt).toLocaleString() : "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No CODs available.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Box>
        ))}
        {/* Dialog for PDF Preview */}
        <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
          <DialogTitle>Certificate of Destruction</DialogTitle>
          <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            {currentCod && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={`http://www.biomedwaste.net/api/cod/${currentCod.fileName}`} />
              </Worker>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Card>
      </Container>
    </Box>
  );
};

export default COD;
