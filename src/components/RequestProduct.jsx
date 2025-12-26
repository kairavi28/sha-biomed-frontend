import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
  Container,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import Footer from "./Footer";

import productImage from "../assets/images/product-placeholder.jpg";

const categories = [
  { name: "All Products", count: 8 },
  { name: "Promotional Products", count: null },
  { name: "Secure-A-Sharp®", count: null },
  { name: "Terra™", count: null },
  { name: "Recovery", count: null },
  { name: "AP Medical", count: null },
  { name: "Accessories", count: null },
  { name: "Uncategorized", count: null },
];

const initialProducts = [
  { id: 1, name: "Product Name Goes Here", description: "Description of product", price: 50, category: "All Products" },
  { id: 2, name: "Product Name Goes Here", description: "Description of product", price: 50, category: "All Products" },
  { id: 3, name: "Product Name Goes Here", description: "Description of product", price: 50, category: "All Products" },
  { id: 4, name: "Product Name Goes Here", description: "Description of product", price: 50, category: "All Products" },
  { id: 5, name: "Product Name Goes Here", description: "Description of product", price: 50, category: "All Products" },
  { id: 6, name: "Product Name Goes Here", description: "Description of product", price: 50, category: "All Products" },
];

const RequestProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortOption, setSortOption] = useState("default");
  const [quantities, setQuantities] = useState({});
  const [quoteItems, setQuoteItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const newVal = Math.max(1, current + delta);
      return { ...prev, [productId]: newVal };
    });
  };

  const handleAddToQuote = (product) => {
    const quantity = quantities[product.id] || 1;
    const existingIndex = quoteItems.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      const updated = [...quoteItems];
      updated[existingIndex].quantity += quantity;
      setQuoteItems(updated);
    } else {
      setQuoteItems([...quoteItems, { ...product, quantity }]);
    }
    
    setSnackbar({ open: true, message: `${product.name} added to quote.`, severity: "success" });
  };

  const handleRemoveFromQuote = (productId) => {
    setQuoteItems(quoteItems.filter(item => item.id !== productId));
  };

  const handleSubmitRequest = () => {
    if (quoteItems.length === 0) {
      setSnackbar({ open: true, message: "Please add at least one product to your quote.", severity: "error" });
      return;
    }
    setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    setSnackbar({ open: true, message: "Your quote request has been submitted successfully!", severity: "success" });
    setQuoteItems([]);
    setQuantities({});
    setSubmitDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <Typography
              variant="h4"
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Request a Product or Service
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 3,
                maxWidth: 500,
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              Tell us what you need and we'll provide a customized quote for your facility.
            </Typography>
            <Button
              variant="contained"
              onClick={handleSubmitRequest}
              sx={{
                backgroundColor: "#D9DE38",
                color: "#0D2477",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 1,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#c5ca2f",
                },
              }}
            >
              Submit Request
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 100 } }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#1a2744", mb: 2 }}
              >
                Search Products
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#1a2744", mb: 2 }}
              >
                Product Categories
              </Typography>
              <Box>
                {categories.map((cat, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedCategory(cat.name)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 0.75,
                      cursor: "pointer",
                      color: selectedCategory === cat.name ? "#D9DE38" : "#555",
                      "&:hover": { color: "#D9DE38" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: selectedCategory === cat.name ? "#D9DE38" : "#999",
                        mr: 1.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: selectedCategory === cat.name ? 600 : 400,
                      }}
                    >
                      {cat.name} {cat.count && `(${cat.count})`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: "#666" }}>
                Showing {filteredProducts.length} of {initialProducts.length} results
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  sx={{
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ddd",
                    },
                  }}
                >
                  <MenuItem value="default">Default sorting</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="name">Name: A to Z</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: product.id * 0.05 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#fff",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#f8f8f8",
                          borderRadius: 1,
                          p: 2,
                          mb: 2,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: 160,
                        }}
                      >
                        <Box
                          component="img"
                          src={productImage}
                          alt={product.name}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: 140,
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </Box>

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#1a2744",
                          mb: 0.5,
                          fontSize: "0.95rem",
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#888", mb: 1, fontSize: "0.8rem" }}
                      >
                        {product.description}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: "#0D2477",
                          mb: 2,
                        }}
                      >
                        Price: ${product.price}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ddd",
                            borderRadius: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(product.id, -1)}
                            sx={{ p: 0.5 }}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography
                            sx={{
                              px: 1.5,
                              minWidth: 30,
                              textAlign: "center",
                              fontSize: "0.875rem",
                            }}
                          >
                            {quantities[product.id] || 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(product.id, 1)}
                            sx={{ p: 0.5 }}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>

                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAddToQuote(product)}
                          sx={{
                            flex: 1,
                            backgroundColor: "#0D2477",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            py: 1,
                            "&:hover": {
                              backgroundColor: "#1a3a8f",
                            },
                          }}
                        >
                          Add to Quote
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="textSecondary">
                  No products found matching your criteria.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#0D2477" }}>
          Confirm Quote Request
          <IconButton
            onClick={() => setSubmitDialogOpen(false)}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            You are about to submit a quote request for the following items:
          </Typography>
          {quoteItems.map((item) => (
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
                  Qty: {item.quantity} x ${item.price}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  ${item.quantity * item.price}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFromQuote(item.id)}
                  sx={{ color: "#d32f2f" }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
          {quoteItems.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 2, borderTop: "2px solid #0D2477" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Total Estimate:
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="#0D2477">
                ${quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setSubmitDialogOpen(false)}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            disabled={quoteItems.length === 0}
            sx={{
              backgroundColor: "#D9DE38",
              color: "#0D2477",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#c5ca2f" },
            }}
          >
            Submit Quote Request
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default RequestProduct;
