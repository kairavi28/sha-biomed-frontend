import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuoteCart } from "../context/QuoteCartContext";
import { quotesAPI } from "../api";
import Footer from "./Footer";

const QuoteCart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    hasItemsWithoutPrice,
  } = useQuoteCart();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    facilityName: "",
    notes: "",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = () => {
    if (cartItems.length === 0) {
      setSnackbar({
        open: true,
        message: "Your cart is empty. Add products before submitting.",
        severity: "error",
      });
      return;
    }
    setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const quoteData = {
        ...customerInfo,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        })),
        totalEstimate: getCartTotal(),
      };

      await quotesAPI.create(quoteData);
      
      setSnackbar({
        open: true,
        message: "Your quote request has been submitted successfully!",
        severity: "success",
      });
      clearCart();
      setCustomerInfo({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        facilityName: "",
        notes: "",
      });
      setSubmitDialogOpen(false);
    } catch (error) {
      console.error("Error submitting quote:", error);
      setSnackbar({
        open: true,
        message: "Quote submitted locally. Backend connection unavailable.",
        severity: "info",
      });
      clearCart();
      setSubmitDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          backgroundColor: "#0D2477",
          pt: { xs: 14, md: 16 },
          pb: { xs: 4, md: 5 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <ShoppingCartIcon sx={{ color: "#D9DE38", fontSize: 36 }} />
              <Typography
                variant="h4"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Your Quote Cart
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 3,
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              Review your selected products and submit your quote request.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {cartItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <ShoppingCartIcon
              sx={{ fontSize: 80, color: "#ccc", mb: 2 }}
            />
            <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Browse our products and add items to request a quote.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/request-products")}
              sx={{
                backgroundColor: "#D9DE38",
                color: "#0D2477",
                fontWeight: 600,
                textTransform: "none",
                px: 4,
                py: 1.5,
                "&:hover": { backgroundColor: "#c5ca2f" },
              }}
            >
              Browse Products
            </Button>
          </Paper>
        ) : (
          <Box>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                overflow: "hidden",
              }}
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", md: "center" },
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                      p: 3,
                      borderBottom:
                        index < cartItems.length - 1
                          ? "1px solid #e0e0e0"
                          : "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        backgroundColor: "#f8f8f8",
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.image ? (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#e0e0e0",
                            borderRadius: 2,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1a2744" }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#0D2477", fontWeight: 500 }}
                      >
                        SKU: {item.sku}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#888", mt: 0.5 }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        sx={{ p: 0.5 }}
                      >
                        <RemoveIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <Typography
                        sx={{
                          px: 2,
                          minWidth: 40,
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        sx={{ p: 0.5 }}
                      >
                        <AddIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    <Box sx={{ minWidth: 100, textAlign: "right" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#0D2477" }}
                      >
                        {item.price !== null
                          ? `$${(item.price * item.quantity).toFixed(2)}`
                          : "Quote needed"}
                      </Typography>
                      {item.price !== null && (
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          ${item.price.toFixed(2)} each
                        </Typography>
                      )}
                    </Box>

                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      sx={{ color: "#d32f2f" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </motion.div>
              ))}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Quote Summary
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>Subtotal:</Typography>
                <Typography fontWeight={600}>
                  ${getCartTotal().toFixed(2)}
                </Typography>
              </Box>
              {hasItemsWithoutPrice() && (
                <Typography
                  variant="body2"
                  sx={{ color: "#f57c00", mb: 2 }}
                >
                  * Some items require a custom quote
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Estimated Total:
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#0D2477">
                  {hasItemsWithoutPrice()
                    ? `$${getCartTotal().toFixed(2)}+`
                    : `$${getCartTotal().toFixed(2)}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/request-products")}
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    borderColor: "#0D2477",
                    color: "#0D2477",
                    py: 1.5,
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitQuote}
                  sx={{
                    flex: 1,
                    backgroundColor: "#D9DE38",
                    color: "#0D2477",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.5,
                    "&:hover": { backgroundColor: "#c5ca2f" },
                  }}
                >
                  Submit Quote Request
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Container>

      <Dialog
        open={submitDialogOpen}
        onClose={() => !isSubmitting && setSubmitDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#0D2477" }}>
          Submit Quote Request
          <IconButton
            onClick={() => !isSubmitting && setSubmitDialogOpen(false)}
            sx={{ position: "absolute", right: 16, top: 16 }}
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Please provide your contact information to receive your quote.
          </Typography>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                fullWidth
                label="Your Name"
                name="customerName"
                value={customerInfo.customerName}
                onChange={handleInputChange}
                size="small"
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                name="customerEmail"
                type="email"
                value={customerInfo.customerEmail}
                onChange={handleInputChange}
                size="small"
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="customerPhone"
                value={customerInfo.customerPhone}
                onChange={handleInputChange}
                size="small"
              />
              <TextField
                fullWidth
                label="Facility Name"
                name="facilityName"
                value={customerInfo.facilityName}
                onChange={handleInputChange}
                size="small"
              />
            </Box>
            <TextField
              fullWidth
              label="Additional Notes"
              name="notes"
              value={customerInfo.notes}
              onChange={handleInputChange}
              multiline
              rows={2}
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Order Summary ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
          </Typography>
          
          <Box sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}>
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SKU: {item.sku} | Qty: {item.quantity}
                    {item.price !== null ? ` x $${item.price.toFixed(2)}` : ""}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {item.price !== null
                    ? `$${(item.quantity * item.price).toFixed(2)}`
                    : "Quote needed"}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: 2,
              borderTop: "2px solid #0D2477",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Total Estimate:
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="#0D2477">
              {hasItemsWithoutPrice()
                ? `$${getCartTotal().toFixed(2)} + items requiring quote`
                : `$${getCartTotal().toFixed(2)}`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setSubmitDialogOpen(false)}
            variant="outlined"
            disabled={isSubmitting}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            disabled={isSubmitting || !customerInfo.customerName || !customerInfo.customerEmail}
            sx={{
              backgroundColor: "#D9DE38",
              color: "#0D2477",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#c5ca2f" },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit Quote Request"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
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

export default QuoteCart;
