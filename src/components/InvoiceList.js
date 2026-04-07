import React, { useCallback, useMemo, useState, useEffect } from "react";
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
  TextField,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Container,
  Grid,
  Chip,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PersonPinCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [openDispute, setOpenDispute] = useState(false);
  const [disputeInvoice, setDisputeInvoice] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputes, setDisputes] = useState([]);
  const [openDisputeDetails, setOpenDisputeDetails] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [openSupportingDoc, setOpenSupportingDoc] = useState(false);
  const [supportingDocUrl, setSupportingDocUrl] = useState("");
  const [supportingDocMeta, setSupportingDocMeta] = useState(null);
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const getCurrentUserIdFromSession = () => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.id || parsed?._id || null;
    } catch {
      return null;
    }
  };

  const disputeStatusColor = (status) => {
    if (status === "resolved") return "success";
    if (status === "rejected") return "error";
    if (status === "reviewing") return "warning";
    return "default";
  };

  const supportingDocDisplayName = (meta) =>
    meta?.originalName || meta?.fileName || meta?.filename || "Supporting Document";

  const supportingDocMimeType = (meta) => meta?.mimeType || meta?.contentType || "";

  const buildSupportingDocUrl = (dispute) => {
    const id = dispute?._id || dispute?.id;
    if (!id) return "";
    return `${API_BASE_URL}/dispute/${encodeURIComponent(id)}/supporting-document`;
  };

  const canViewSupportingDoc = (dispute) => Boolean(dispute?.supportingDocument && buildSupportingDocUrl(dispute));

  const disputeStatusByInvoiceNumber = useMemo(() => {
    const byInvoice = new Map();

    for (const dispute of disputes || []) {
      const invoiceNumber = dispute?.invoiceNumber;
      if (!invoiceNumber) continue;

      const current = byInvoice.get(invoiceNumber);
      const currentTime = current
        ? new Date(current?.resolvedAt || current?.disputeDate || 0).getTime()
        : -Infinity;
      const candidateTime = new Date(dispute?.resolvedAt || dispute?.disputeDate || 0).getTime();

      if (!current || candidateTime >= currentTime) {
        byInvoice.set(invoiceNumber, dispute?.status || "pending");
      }
    }

    return Object.fromEntries(byInvoice.entries());
  }, [disputes]);

  const fetchDisputes = useCallback(async () => {
    const currentUserId = getCurrentUserIdFromSession();
    if (!currentUserId) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/dispute/customer/${currentUserId}`);
      const fetched = Array.isArray(response.data) ? response.data : [];
      setDisputes(fetched);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const raw = sessionStorage.getItem("userData");
      if (!raw) {
        setLoading(false);
        return;
      }

      let currentUserSession = null;
      try {
        currentUserSession = JSON.parse(raw);
      } catch {
        setLoading(false);
        return;
      }
      const currentUserId = currentUserSession?.id || currentUserSession?._id;

      if (!currentUserId) {
        console.error("User ID is undefined");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/${currentUserId}`,
        );
        const approvedFacilities = response.data?.facilities
          .filter((facility) => facility.approved)
          .map((facility) => facility.name);

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
            const response = await axios.get(
              `${API_BASE_URL}/invoice/${facility}`,
            );
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
      // Avoid refreshing while user is actively reviewing a PDF/doc in a dialog.
      if (openPreview || openSupportingDoc) return;

      fetchInvoices();
      const interval = setInterval(fetchInvoices, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [selectedFacilities, openPreview, openSupportingDoc]);

  useEffect(() => {
    // Avoid refreshing while user is actively reviewing a PDF/doc in a dialog.
    if (openPreview || openSupportingDoc) return;

    fetchDisputes();
    const interval = setInterval(fetchDisputes, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDisputes, openPreview, openSupportingDoc]);

  const openDisputeDetailsDialog = (dispute) => {
    setSelectedDispute(dispute);
    setOpenDisputeDetails(true);
  };

  const closeDisputeDetailsDialog = () => {
    setOpenDisputeDetails(false);
    setSelectedDispute(null);
  };

  const openSupportingDocDialog = (dispute) => {
    const url = buildSupportingDocUrl(dispute);
    if (!url) return;
    setSupportingDocUrl(url);
    setSupportingDocMeta(dispute?.supportingDocument || null);
    setOpenSupportingDoc(true);
  };

  const closeSupportingDocDialog = () => {
    setOpenSupportingDoc(false);
    setSupportingDocUrl("");
    setSupportingDocMeta(null);
  };

  const totalAmountDue = Object.values(invoices)
    .flat()
    .reduce((acc, invoice) => acc + (invoice.balanceDue || 0), 0);
  const totalAmountPaid = Object.values(invoices)
    .flat()
    .reduce(
      (acc, invoice) =>
        acc + (invoice.totalAmt || 0) - (invoice.balanceDue || 0),
      0,
    );

  const handlePreviewOpen = (invoice) => {
    setCurrentInvoice(invoice);
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#f5f5f5" }}
      >
        <CircularProgress sx={{ color: "#0D2477" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 14, md: 18 }, pb: { xs: 6, md: 8 }, flex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              p: { xs: 3, md: 4 },
              background: "#fff",
            }}
          >
            {selectedFacilities.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <PersonPinCircle
                  sx={{ fontSize: 60, color: "#0D2477", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a2744", mb: 1 }}
                >
                  No Facilities Selected
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 3, maxWidth: 400, mx: "auto" }}
                >
                  No facility has been selected. Please navigate to your profile
                  section to add facilities.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#0D2477",
                    "&:hover": { backgroundColor: "#092058" },
                    textTransform: "none",
                    px: 4,
                    py: 1,
                    borderRadius: "25px",
                    fontWeight: 600,
                  }}
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </Button>
              </Box>
            ) : (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#0D2477",
                    mb: 3,
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                  }}
                >
                  Invoice Summary
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <Box
                        sx={{
                          background: "#EBF4FF",
                          borderRadius: 2,
                          p: 3,
                          border: "1px solid #D6E8FF",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#5A6B7F", mb: 0.5 }}
                        >
                          Total Amount Due:
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: "#0D2477",
                            fontSize: { xs: "1.5rem", md: "2rem" },
                          }}
                        >
                          ${totalAmountDue.toFixed(2)}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Box
                        sx={{
                          background: "#E8F5E9",
                          borderRadius: 2,
                          p: 3,
                          border: "1px solid #C8E6C9",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#5A7F5E", mb: 0.5 }}
                        >
                          Total Amount Paid:
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: "#2E7D32",
                            fontSize: { xs: "1.5rem", md: "2rem" },
                          }}
                        >
                          ${totalAmountPaid.toFixed(2)}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                </Grid>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 2,
                      mb: 4,
                      background: "#F5F5F5",
                      borderRadius: 2,
                      border: "1px solid #E0E0E0",
                    }}
                  >
                    <InfoOutlinedIcon sx={{ color: "#666", fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, color: "#333" }}
                      >
                        Notice:
                      </Box>{" "}
                      Invoices are updated every 3 minutes. If you do not see
                      your latest invoice, please wait or contact support.
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <Box
                    sx={{
                      mb: 4,
                      p: 2.5,
                      borderRadius: 2,
                      border: "1px solid #E0E0E0",
                      background: "#fff",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: "#0D2477" }}>
                        Invoice Disputes
                      </Typography>
                      <Chip
                        label={`${(disputes || []).length} total`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: "#0D2477", color: "#0D2477" }}
                      />
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {(disputes || []).length === 0 ? (
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        No disputes filed yet.
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                        {disputes.slice(0, 5).map((d) => (
                          <Box
                            key={d?._id || `${d?.invoiceNumber}-${d?.disputeDate}`}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 2,
                              p: 1.5,
                              borderRadius: 1.5,
                              background: "#FAFAFA",
                              border: "1px solid #EEE",
                            }}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 700, color: "#1a2744" }} noWrap>
                                Invoice #{d?.invoiceNumber || "N/A"}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666" }} noWrap>
                                {d?.facility || "N/A"}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={(d?.status || "pending").toUpperCase()}
                                size="small"
                                color={disputeStatusColor(d?.status)}
                                variant={d?.status === "pending" ? "outlined" : "filled"}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ textTransform: "none", borderColor: "#0D2477", color: "#0D2477" }}
                                onClick={() => openDisputeDetailsDialog(d)}
                              >
                                View
                              </Button>
                            </Box>
                          </Box>
                        ))}

                        {(disputes || []).length > 5 ? (
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            Showing latest 5 disputes.
                          </Typography>
                        ) : null}
                      </Box>
                    )}
                  </Box>
                </motion.div>

                {selectedFacilities.map((facility, facilityIndex) => (
                  <motion.div
                    key={facility}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + facilityIndex * 0.1,
                    }}
                  >
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "#1a2744",
                          mb: 2,
                          fontSize: { xs: "0.95rem", md: "1rem" },
                        }}
                      >
                        Invoices of {facility}
                      </Typography>

                      <TableContainer sx={{ overflowX: "auto" }}>
                        <Table sx={{ minWidth: { xs: 600, md: "auto" } }}>
                          <TableHead>
                            <TableRow
                              sx={{ borderBottom: "2px solid #e0e0e0" }}
                            >
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Invoice Number
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Total Amount
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Preview
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Download
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Balance Due
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Uploaded At
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Action
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 600,
                                  color: "#0D2477",
                                  fontSize: "0.9rem",
                                  py: 2,
                                }}
                              >
                                Status
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {invoices[facility]?.length > 0 ? (
                              invoices[facility].map((invoice) => (
                                <TableRow
                                  key={invoice._id}
                                  sx={{
                                    borderBottom: "1px solid #f0f0f0",
                                    "&:hover": { backgroundColor: "#fafafa" },
                                  }}
                                >
                                  <TableCell sx={{ py: 2.5 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                      }}
                                    >
                                      <DescriptionOutlinedIcon
                                        sx={{ color: "#999", fontSize: 20 }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "#1a2744",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {invoice.fileName || "N/A"}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ py: 2.5 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#1a2744" }}
                                    >
                                      ${invoice.totalAmt?.toFixed(2) || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2.5 }}>
                                    <IconButton
                                      onClick={() => handlePreviewOpen(invoice)}
                                      sx={{
                                        color: "#0D2477",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(13, 36, 119, 0.08)",
                                        },
                                      }}
                                    >
                                      <VisibilityIcon sx={{ fontSize: 22 }} />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2.5 }}>
                                    <IconButton
                                      onClick={async () => {
                                        try {
                                          const response = await fetch(`${API_BASE_URL}/invoice/file/${invoice.fileName}`);
                                          const blob = await response.blob();
                                          const url = window.URL.createObjectURL(blob);
                                          const link = document.createElement('a');
                                          link.href = url;
                                          link.download = invoice.fileName;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                          window.URL.revokeObjectURL(url);
                                        } catch (error) {
                                          console.error('Download failed:', error);
                                          setSnackbar({ open: true, message: "Failed to download file. Please try again.", severity: "error" });
                                        }
                                      }}
                                      sx={{
                                        color: "#2E7D32",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(46, 125, 50, 0.08)",
                                        },
                                      }}
                                    >
                                      <DownloadIcon sx={{ fontSize: 22 }} />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell sx={{ py: 2.5 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#1a2744" }}
                                    >
                                      ${invoice.balanceDue?.toFixed(2) || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 2.5 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#666" }}
                                    >
                                      {invoice.uploadedAt
                                        ? new Date(
                                            invoice.uploadedAt,
                                          ).toLocaleString()
                                        : "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2.5 }}>
                                    {(() => {
                                      const disputeStatus = disputeStatusByInvoiceNumber[invoice.fileName];
                                      const isUnderReview = disputeStatus === "pending" || disputeStatus === "reviewing";
                                      const isResolved = disputeStatus === "resolved";
                                      const disableDispute = isUnderReview || isResolved;

                                      const label = isResolved ? "Resolved" : isUnderReview ? "Under Review" : "Dispute";
                                      const color = disableDispute ? "#999" : "#d32f2f";
                                      const borderColor = disableDispute ? "#ccc" : "#d32f2f";

                                      return (
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      disabled={disableDispute}
                                      onClick={() => {
                                        setDisputeInvoice({ ...invoice, facility });
                                        setOpenDispute(true);
                                      }}
                                      sx={{
                                        color,
                                        borderColor,
                                        textTransform: "none",
                                        fontSize: "0.75rem",
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 2,
                                        "&:hover": {
                                          borderColor: "#b71c1c",
                                          backgroundColor: "rgba(211, 47, 47, 0.04)",
                                        },
                                        "&.Mui-disabled": {
                                          color: "#999",
                                          borderColor: "#ddd",
                                        },
                                      }}
                                    >
                                      {label}
                                    </Button>
                                      );
                                    })()}
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2.5 }}>
                                    {(() => {
                                      const disputeStatus = disputeStatusByInvoiceNumber[invoice.fileName];
                                      const isUnderReview = disputeStatus === "pending" || disputeStatus === "reviewing";
                                      const isResolved = disputeStatus === "resolved";

                                      if (isResolved) {
                                        return (
                                          <Chip
                                            label="Resolved"
                                            size="small"
                                            sx={{
                                              backgroundColor: "#E8F5E9",
                                              color: "#2E7D32",
                                              fontWeight: 600,
                                              fontSize: "0.7rem",
                                            }}
                                          />
                                        );
                                      }

                                      if (isUnderReview) {
                                        return (
                                          <Chip
                                            label="Under Review"
                                            size="small"
                                            sx={{
                                              backgroundColor: "#FFF3E0",
                                              color: "#E65100",
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                        }}
                                      />
                                        );
                                      }

                                      return (
                                      <Chip
                                        label="Active"
                                        size="small"
                                        sx={{
                                          backgroundColor: "#E8F5E9",
                                          color: "#2E7D32",
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                        }}
                                      />
                                      );
                                    })()}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={8}
                                  align="center"
                                  sx={{ py: 4 }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    No invoices available.
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </motion.div>
                ))}

                <Dialog
                  open={openDispute}
                  onClose={() => setOpenDispute(false)}
                  maxWidth="sm"
                  fullWidth
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      p: 2,
                      background: "#fefefe",
                      boxShadow: 5,
                    },
                  }}
                >
                  <DialogTitle
                    sx={{
                      fontWeight: "bold",
                      color: "#d32f2f",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    File a Dispute
                  </DialogTitle>

                  <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Invoice Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {disputeInvoice?.fileName || "N/A"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Reason for Dispute{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        variant="outlined"
                        placeholder="Please describe the issue or concern with this invoice..."
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        sx={{
                          background: "#fafafa",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </DialogContent>

                  <DialogActions
                    sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}
                  >
                    <Button
                      onClick={() => setOpenDispute(false)}
                      variant="outlined"
                      color="inherit"
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ textTransform: "none", borderRadius: 2 }}
                      onClick={async () => {
                        setDisputeLoading(true);
                        try {
                          const disputePayload = {
                            customerId: userData?._id,
                            customerName:
                              userData?.firstname + " " + userData?.lastname,
                            facility: disputeInvoice?.facility,
                            invoiceNumber: disputeInvoice?.fileName,
                            disputeDescription: disputeReason,
                            disputeDate: new Date().toISOString(),
                          };
                          await axios.post(
                            `${API_BASE_URL}/invoice/dispute`,
                            disputePayload,
                          );

                          await fetchDisputes();
                          setSnackbar({ open: true, message: "Dispute filed successfully!", severity: "success" });
                          setOpenDispute(false);
                          setDisputeReason("");
                        } catch (err) {
                          console.error("Error filing dispute:", err);
                          setSnackbar({ open: true, message: "Failed to file dispute. Please try again.", severity: "error" });
                        } finally {
                          setDisputeLoading(false);
                        }
                      }}
                      disabled={!disputeReason.trim() || disputeLoading}
                    >
                      {disputeLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Dispute'}
                    </Button>
                </DialogActions>
                </Dialog>

                <Dialog
                  open={openDisputeDetails}
                  onClose={closeDisputeDetailsDialog}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle sx={{ fontWeight: 700, color: "#1a2744" }}>
                    Dispute Details
                  </DialogTitle>
                  <DialogContent sx={{ pt: 1.5 }}>
                    {selectedDispute ? (
                      <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
                          <Typography sx={{ fontWeight: 800, color: "#0D2477" }}>
                            Invoice #{selectedDispute?.invoiceNumber || "N/A"}
                          </Typography>
                          <Chip
                            label={(selectedDispute?.status || "pending").toUpperCase()}
                            size="small"
                            color={disputeStatusColor(selectedDispute?.status)}
                            variant={selectedDispute?.status === "pending" ? "outlined" : "filled"}
                          />
                        </Box>

                        <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                          Facility:{" "}
                          <Box component="span" sx={{ fontWeight: 700, color: "#333" }}>
                            {selectedDispute?.facility || "N/A"}
                          </Box>
                        </Typography>

                        <Typography variant="body2" sx={{ color: "#666", mb: 2, whiteSpace: "pre-wrap" }}>
                          <Box component="span" sx={{ fontWeight: 700, color: "#333" }}>
                            Dispute:
                          </Box>{" "}
                          {selectedDispute?.disputeDescription || "N/A"}
                        </Typography>

                        {selectedDispute?.resolution ? (
                          <Typography variant="body2" sx={{ color: "#666", mb: 2, whiteSpace: "pre-wrap" }}>
                            <Box component="span" sx={{ fontWeight: 700, color: "#333" }}>
                              Resolution:
                            </Box>{" "}
                            {selectedDispute.resolution}
                          </Typography>
                        ) : null}

                        {canViewSupportingDoc(selectedDispute) ? (
                          <Button
                            variant="contained"
                            sx={{
                              textTransform: "none",
                              backgroundColor: "#0D2477",
                              "&:hover": { backgroundColor: "#092058" },
                            }}
                            onClick={() => openSupportingDocDialog(selectedDispute)}
                          >
                            View Supporting Document
                          </Button>
                        ) : (
                          <Alert severity="info">No supporting document attached yet.</Alert>
                        )}
                      </>
                    ) : (
                      <Typography color="text.secondary">No dispute selected.</Typography>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={closeDisputeDetailsDialog}
                      sx={{ color: "#0D2477", fontWeight: 600, textTransform: "none" }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={openSupportingDoc}
                  onClose={closeSupportingDocDialog}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle sx={{ fontWeight: 700, color: "#1a2744" }}>
                    {supportingDocDisplayName(supportingDocMeta)}
                  </DialogTitle>
                  <DialogContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80vh",
                    }}
                  >
                    {supportingDocUrl ? (
                      (() => {
                        const mime = supportingDocMimeType(supportingDocMeta);
                        if (mime.startsWith("image/")) {
                          return (
                            <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
                              <img
                                src={supportingDocUrl}
                                alt={supportingDocDisplayName(supportingDocMeta)}
                                style={{ maxWidth: "100%", maxHeight: "100%", display: "block", margin: "0 auto" }}
                              />
                            </Box>
                          );
                        }

                        if (mime === "application/pdf" || mime.endsWith("/pdf")) {
                          return (
                            <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                              <Box sx={{ width: "100%", height: "100%" }}>
                                <Viewer fileUrl={supportingDocUrl} />
                              </Box>
                            </Worker>
                          );
                        }

                        return (
                          <Box sx={{ textAlign: "center" }}>
                            <Typography sx={{ color: "#666", mb: 2 }}>
                              This file type can't be previewed here.
                            </Typography>
                          </Box>
                        );
                      })()
                    ) : (
                      <Typography color="text.secondary">No document URL available.</Typography>
                    )}

                    {supportingDocUrl ? (
                      <Button
                        variant="text"
                        sx={{ mt: 2, color: "#0D2477", textTransform: "none" }}
                        onClick={() => window.open(supportingDocUrl, "_blank", "noopener,noreferrer")}
                      >
                        Open in New Tab
                      </Button>
                    ) : null}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={closeSupportingDocDialog}
                      sx={{ color: "#0D2477", fontWeight: 600, textTransform: "none" }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={openPreview}
                  onClose={handlePreviewClose}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle sx={{ fontWeight: 600, color: "#1a2744" }}>
                    Invoice Preview
                  </DialogTitle>
                  <DialogContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80vh",
                    }}
                  >
                    {currentInvoice && (
                      <>
                        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                          <Box sx={{ width: '100%', height: '100%' }}>
                            <Viewer
                              fileUrl={`${API_BASE_URL}/invoice/file/${currentInvoice.fileName}`}
                              onDocumentLoadError={(error) => {
                                console.error('PDF load error:', error);
                              }}
                            />
                          </Box>
                        </Worker>
                        <Button
                          variant="text"
                          sx={{ mt: 2, color: '#0D2477' }}
                          onClick={() => window.open(`${API_BASE_URL}/invoice/file/${currentInvoice.fileName}`, '_blank')}
                        >
                          Open in New Tab
                        </Button>
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handlePreviewClose}
                      sx={{
                        color: "#0D2477",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Paper>
        </motion.div>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default InvoiceList;
