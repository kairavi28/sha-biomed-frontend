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
import { PersonPinCircle } from "@mui/icons-material";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
      const currentUserId = currentUserSession.id || currentUserSession._id;

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
    const fetchInvoices = async () => {
      try {
        const invoicesData = {};
        const fetchPromises = selectedFacilities.map(async (facility) => {
          try {
            const response = await axios.get(`${API_BASE_URL}/invoice/${facility}`);
            invoicesData[facility] = response.data.length ? response.data : [];
          } catch (error) {
            console.error(`Error fetching invoices for ${facility}:`, error);
            invoicesData[facility] = [];
          }
        });

        await Promise.all(fetchPromises);
        setInvoices((prevInvoices) => ({ ...prevInvoices, ...invoicesData }));
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    if (selectedFacilities.length > 0) {
      fetchInvoices();
    }
  }, [selectedFacilities]);

  const totalAmountDue = Object.values(invoices).flat().reduce((acc, invoice) => acc + (invoice.balanceDue || 0), 0);
  const totalAmountPaid = Object.values(invoices).flat().reduce((acc, invoice) => acc + (invoice.totalAmt || 0) - (invoice.balanceDue || 0), 0);

  const handlePreviewOpen = (invoice) => {
    setCurrentInvoice(invoice);
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: "#f9fafb" }}>
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
      <Container maxWidth="lg">
        {selectedFacilities.length === 0 ? (
          <Card sx={{ maxWidth: 700, mx: "auto", mt: 10, p: 4, textAlign: "center", boxShadow: 3 }}>
            <PersonPinCircle sx={{ fontSize: 50, color: "#092C74", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#092C74", mb: 1 }}>
              Invoices
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              No facility has been selected. Please navigate to your profile section to add facilities.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#092C74",
                "&:hover": { backgroundColor: "#051a4d" },
                textTransform: "none",
                px: 4,
              }}
              href="/profile"
            >
              Go to Profile
            </Button>
          </Card>
        ) : <Card sx={{ boxShadow: 3, p: 4, background: "#ffffff", borderRadius: "1em" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#092C74", mb: 3 }}>Invoice Summary</Typography>
          <Grid container spacing={2} sx={{ mb: 3, p: 2, background: "#e3f2fd", borderRadius: 2, boxShadow: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Total Amount Due:</strong> ${totalAmountDue.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Total Amount Paid:</strong> ${totalAmountPaid.toFixed(2)}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ p: 2, mb: 4, background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: "medium", color: "#856404" }}>
              📌 <strong>Notice:</strong> Invoices are updated every 3 minutes. If you do not see your latest invoice, please wait or contact support.
            </Typography>
          </Box>
          {selectedFacilities.map((facility) => (
            <Box key={facility} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#092C74", mb: 2 }}>Invoices for {facility}</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell><strong>File Name</strong></TableCell>
                      <TableCell><strong>Total Amount</strong></TableCell>
                      <TableCell><strong>Preview</strong></TableCell>
                      <TableCell><strong>Download</strong></TableCell>
                      <TableCell><strong>Balance Due</strong></TableCell>
                      <TableCell><strong>Uploaded At</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices[facility]?.length > 0 ? (
                      invoices[facility].map((invoice) => (
                        <TableRow key={invoice._id} hover>
                          <TableCell>{invoice.fileName || "N/A"}</TableCell>
                          <TableCell>${invoice.totalAmt?.toFixed(2) || "N/A"}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={() => handlePreviewOpen(invoice)}>
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="success"
                              component="a"
                              href={`${API_BASE_URL}/invoices/${invoice.fileName}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>${invoice.balanceDue?.toFixed(2) || "N/A"}</TableCell>
                          <TableCell>{invoice.uploadedAt ? new Date(invoice.uploadedAt).toLocaleString() : "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No invoices available.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
          {/* Dialog for PDF Preview */}
          <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
              {currentInvoice && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={`${API_BASE_URL}/invoices/${currentInvoice.fileName}`} />
                </Worker>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePreviewClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Card>};
      </Container>

    </Box>
  );
};

export default InvoiceList;
