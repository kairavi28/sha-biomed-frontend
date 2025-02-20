import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import * as pdfjsLib from "pdfjs-dist/webpack";


const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [facilityName, setFacilityName] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const fileUrl = currentInvoice ? `http://localhost:5000/invoices/${currentInvoice.fileName}` : "";

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
      setFacilityName(userData.facility);
      fetchInvoices(userData.facility);
    }
  }, []);

  const fetchInvoices = async (facility) => {
    try {
      const response = await axios.get(`http://localhost:5000/invoice/${facility}`);
      console.log('FETCH', response.data);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handlePreviewOpen = (invoice) => {
    setCurrentInvoice(invoice);
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
      <CardHeader
        title={
          <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
            Invoices for {facilityName}
          </Typography>
        }
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
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice._id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>{invoice.fileName}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                      {invoice.totalAmt !== null ? `$${invoice.totalAmt.toFixed(2)}` : "N/A"}
                    </TableCell>
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
                    <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                      {invoice.balanceDue !== null ? `$${invoice.balanceDue.toFixed(2)}` : "N/A"}
                    </TableCell>
                    <TableCell>{new Date(invoice.uploadedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No invoices available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Dialog for PDF Preview */}
      <Dialog open={openPreview} onClose={() => handlePreviewClose()} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          {currentInvoice && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={fileUrl} />
            </Worker>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePreviewClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default InvoiceList;
