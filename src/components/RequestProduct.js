import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const RequestProduct = () => {
  const [complaints, setComplaints] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [productList, setProductList] = useState([
    { id: 1, name: "Product A", price: 50 },
    { id: 2, name: "Product B", price: 80 },
    { id: 3, name: "Product C", price: 120 },
  ]);

  const [quantities, setQuantities] = useState({});
  const [quoteItems, setQuoteItems] = useState([]);

  const handleComplaintChange = (event) => {
    setComplaints(event.target.value);
  };

  const handleRequestProduct = () => {
    if (!complaints) {
      setSnackbar({ open: true, message: "Please enter your complaint.", severity: "error" });
      return;
    }

    // You can integrate this with your backend here
    setSnackbar({ open: true, message: "Request submitted successfully!", severity: "success" });
    setComplaints("");
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const handleAddToQuote = (product) => {
    const quantity = parseInt(quantities[product.id]) || 1;
    const exists = quoteItems.find((item) => item.id === product.id);
    if (!exists) {
      setQuoteItems([...quoteItems, { ...product, quantity }]);
    }
    setSnackbar({ open: true, message: `${product.name} added to quote.`, severity: "success" });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 20, borderRadius: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Request a Product
      </Typography>

      {/* Complaints Section */}
      <TextField
        label="Describe your complaint"
        fullWidth
        multiline
        rows={4}
        value={complaints}
        onChange={handleComplaintChange}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRequestProduct}
        sx={{ mb: 4 }}
      >
        Submit Request
      </Button>

      {/* Product List Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        🛒 Product List
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Select products and quantities to request a quote.
      </Typography>

      <Grid container spacing={3}>
        {productList.map((product) => (
          <Grid item xs={12} md={4} key={product.id}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography color="text.secondary">Price: ${product.price}</Typography>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                value={quantities[product.id] || ""}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleAddToQuote(product)}
              >
                Add to Quote
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quote Summary */}
      {quoteItems.length > 0 && (
        <Paper elevation={2} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            📋 Quote Summary
          </Typography>
          {quoteItems.map((item) => (
            <Typography key={item.id}>
              {item.name} x {item.quantity} = ${item.quantity * item.price}
            </Typography>
          ))}
          <Typography variant="subtitle1" fontWeight="bold" mt={2}>
            Total: ${quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </Typography>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RequestProduct;
