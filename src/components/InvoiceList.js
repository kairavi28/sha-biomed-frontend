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
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentInvoice, setCurrentInvoice] = useState(null);
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
        const response = await axios.get(`http://localhost:5000/user/${currentUserId}`);
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
  
        // Fetch invoices for all facilities
        const fetchPromises = selectedFacilities.map(async (facility) => {
          try {
            const response = await axios.get(`http://localhost:5000/invoice/${facility}`);
            invoicesData[facility] = response.data.length ? response.data : []; 
          } catch (error) {
            console.error(`Error fetching invoices for ${facility}:`, error);
            invoicesData[facility] = []; 
          }
        });
  
        await Promise.all(fetchPromises); // Wait for all requests to complete
  
        setInvoices((prevInvoices) => ({
          ...prevInvoices, 
          ...invoicesData, 
        }));
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: "#f3f4f6" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
      <Box sx={{ mb: 3, p: 2, background: "#e3f2fd", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>Invoice Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Total Amount Due:</strong> ${totalAmountDue.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Total Amount Paid:</strong> ${totalAmountPaid.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Box>
      {selectedFacilities.map((facility) => (
        <Box key={facility} sx={{ mb: 3 }}>
          <CardHeader
            title={<Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>Invoices for {facility}</Typography>}
          />
          <CardContent>
            <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell><strong>File Name</strong></TableCell>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>Preview</strong></TableCell>
                    <TableCell><strong>Download</strong></TableCell>
                    <TableCell><strong>Balance Due</strong></TableCell>
                    <TableCell><strong>Uploaded At</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {(invoices[facility] && invoices[facility].length > 0) ? (
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
                          <IconButton color="success" component="a" href={`http://localhost:5000/invoices/${invoice.fileName}`} download>
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
          </CardContent>
        </Box>
      ))}
      {/* Dialog for PDF Preview */}
      <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          {currentInvoice && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={`http://localhost:5000/invoices/${currentInvoice.fileName}`} />
            </Worker>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default InvoiceList;