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
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuoteCart } from "../context/QuoteCartContext";
import Footer from "./Footer";

const categories = [
    { name: "All Products", count: 62 },
    { name: "Promotional Products", count: 2 },
    { name: "Secure-A-Sharp®", count: 14 },
    { name: "Terra™", count: 8 },
    { name: "Recovery", count: 20 },
    { name: "AP Medical", count: 5 },
    { name: "Accessories", count: 13 },
    { name: "Uncategorized", count: 1 },
];

const initialProducts = [
    { id: 1, name: "Biohazard Temporary Tattoo", sku: "PCTT1", description: "Promotional biohazard temporary tattoo", price: null, category: "Promotional Products", image: "https://biomedwaste.com/wp-content/uploads/2019/07/ACTT1-001b.png" },
    { id: 2, name: "Biomed Blue Ball Cap", sku: "PBBC1", description: "Promotional Biomed branded blue ball cap", price: null, category: "Promotional Products", image: "https://biomedwaste.com/wp-content/uploads/2019/07/ABBC1-004b.png" },
    { id: 3, name: "1-Litre Needle Drop-Box", sku: "SMDB1", description: "Compact needle drop-box for secure disposal", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/8.5-inches-2.png" },
    { id: 4, name: "5-Litre Needle Drop-Box", sku: "SMDB5", description: "Mid-size needle drop-box for public areas", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SMDB5-1.png" },
    { id: 5, name: "72-Litre Needle Drop Box", sku: "SYDB72", description: "Large capacity needle drop box", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SYDB72a.png" },
    { id: 6, name: "Carson 1-Litre Sharps Container", sku: "SYSC1", description: "Compact sharps container with rotor lid - 50 per case", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/10/SYSC1.2.png" },
    { id: 7, name: "Carson 3-Litre Sharps Container", sku: "SYSC3", description: "Mid-sized sharps container with handle - 36 per case", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/10/SYSC2.2.png" },
    { id: 8, name: "Carson 5-Litre Sharps Container", sku: "SYSC5", description: "Portable sharps container for clinics - 24 per case", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/10/SYSC3.3.png" },
    { id: 9, name: "Carson 5-Litre Red Sharps Container", sku: "SRSC5", description: "Red sharps container - 24 per case", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2019/07/SRSC5-1.png" },
    { id: 10, name: "Carson 72-Litre Sharps Container", sku: "SYSC72", description: "Large capacity sharps container - Part of reusable program", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SYDB72a.png" },
    { id: 11, name: "Single-Use Needle Clean Up Kit", sku: "SYDK5", description: "Complete kit for safe needle cleanup", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SMDB5-1.png" },
    { id: 12, name: "1-Litre Aluminum Wall-Mounted Bracket", sku: "SMWB1", description: "Wall mount bracket for 1L containers", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SMWB1-001.png" },
    { id: 13, name: "5-Litre Aluminum Wall-Mounted Bracket", sku: "SMWB5", description: "Wall mount bracket for 5L containers", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SMWB5-001.png" },
    { id: 14, name: "Outdoor Pole Mount for 5-Litre Needle Drop-Box", sku: "SMPM5", description: "Outdoor pole mount for public areas", price: null, category: "Secure-A-Sharp®", image: "https://biomedwaste.com/wp-content/uploads/2018/11/SMPM5-002c.png" },
    { id: 15, name: "Terra™ 4-Litre Reusable Sharps Container with Handle", sku: "TYSC4", description: "Terra™ reusable 4L sharps container with handle", price: null, category: "Terra™", image: "https://biomedwaste.com/wp-content/uploads/2018/11/TYSC4-1.png" },
    { id: 16, name: "Terra™ 8-Litre Reusable Sharps Container with Handle", sku: "TYSC8", description: "Terra™ reusable 8L sharps container with handle", price: null, category: "Terra™", image: "https://biomedwaste.com/wp-content/uploads/2018/11/020-TYSC8-TCTL8b.png" },
    { id: 17, name: "Terra™ 40-Litre Sharps Container – (TYSC40)", sku: "TYSC40", description: "TYSC40 reusable containers only available as part of our reusable service program", price: null, category: "Terra™", image: "https://biomedwaste.com/wp-content/uploads/2019/07/2019-07-04-TYSC40-005b.png" },
    { id: 18, name: "Turbine Safety Lid for Terra™ 4L & 8L", sku: "TCTL8", description: "Safety turbine lid for Terra containers", price: null, category: "Terra™", image: "https://biomedwaste.com/wp-content/uploads/2018/11/TCTL8-001.png" },
    { id: 19, name: "Hinged Lab Lid for Terra™ 4L & 8L", sku: "TCLL8", description: "Hinged lab lid for Terra containers", price: null, category: "Terra™", image: "https://biomedwaste.com/wp-content/uploads/2019/06/TCLL8-1b.jpg" },
    { id: 20, name: "Terra™ 68-Litre Sharps Container – (TYSC68)", sku: "TYSC68", description: "TYSC68 reusable containers only available as part of our reusable service program", price: null, category: "Terra™", image: "https://biomedwaste.com/wp-content/uploads/2019/07/2019-07-05-TYSC68-006b.png" },
    { id: 23, name: "115-Litre Blue Plastic Drum", sku: "RBPD115", description: "Large blue plastic drum for waste", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2019/06/RBPD115-001b.png" },
    { id: 24, name: "208-Litre Blue Plastic Drum", sku: "RBPD208", description: "Extra-large blue plastic drum", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2019/06/RBPD115-001b.png" },
    { id: 25, name: "76-Litre BioBox™ Fibreboard Container", sku: "RWBW76", description: "Fibreboard general waste container - 10 per bundle", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/Biobox1b-2023-1.png" },
    { id: 26, name: "68-Litre Blue Tub Plastic Container", sku: "RBBW68", description: "Plastic general waste container", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2019/07/2019-07-02-RBBW68-005b.png" },
    { id: 27, name: "22-Litre Red Anatomical Biohazard Pail", sku: "RRAP22", description: "Red pail for anatomical waste - 40 per case, 96 per pallet", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RRAP22-002.png" },
    { id: 28, name: "22-Litre Yellow Biohazard Pail", sku: "RYBP22", description: "Yellow pail for biohazard waste - 40 per case, 96 per pallet", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYBP22-002.png" },
    { id: 29, name: "5.5-Litre Red Anatomical Biohazard Pail", sku: "RRAP6", description: "Small red anatomical waste pail - 36 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RRAP6-002.png" },
    { id: 30, name: "20-Litre White Glass Only Pail", sku: "RWGP20", description: "White pail for glass waste only", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RWGP20-002.png" },
    { id: 31, name: "11-Litre Yellow Biohazard Pail", sku: "RYBP11", description: "Medium yellow biohazard pail", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYBP11-002.png" },
    { id: 32, name: "4.55-Litre Yellow Biohazard Pail with Flip-Top Lid", sku: "RYBP5-RYPL6", description: "Small yellow pail with flip-top - 48 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYBP5-002.png" },
    { id: 33, name: "4.55-Litre Yellow Biohazard Pail with Gasket Lid", sku: "RYBP5-RYGL6", description: "Small yellow pail with gasket lid - 48 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYBP5-002.png" },
    { id: 34, name: "4.55-Litre Yellow Biohazard Pail with Hinged Safety Lid", sku: "RYBP5-RYHL6", description: "Small yellow pail with hinged lid - 48 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYBP5-002.png" },
    { id: 35, name: "Yellow Gasket Lid for 22-Litre Pails", sku: "RYGL22", description: "Replacement gasket lid for 22L pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYGL22-001.png" },
    { id: 36, name: "Yellow 5-Inch Plug Lid for 20L/22L Pails", sku: "RYPL22", description: "Plug lid for 20L and 22L pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYPL22-001.png" },
    { id: 37, name: "Yellow 70mm Screw-Cap Lid for 20L/22L Pails", sku: "RYCL22", description: "Screw-cap lid for 20L and 22L pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYCL22-001.png" },
    { id: 38, name: "Red Gasket Lid for 22-Litre Pails", sku: "RRGL22", description: "Red gasket lid for anatomical pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYGL22-001.png" },
    { id: 39, name: "White Gasket Lid for 20-Litre Pails", sku: "RWGL22", description: "White gasket lid for 20L pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYGL22-001.png" },
    { id: 40, name: "White Gasket Lid for 11-Litre Pails", sku: "RWGL11", description: "White gasket lid for 11L pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYGL22-001.png" },
    { id: 41, name: "White 3-inch Plug Lid for 11-Litre Pails", sku: "RWPL11", description: "Plug lid for 11L pails - 40 per case", price: null, category: "Recovery", image: "https://biomedwaste.com/wp-content/uploads/2018/11/RYPL22-001.png" },
    { id: 42, name: "AP Medical 5-Litre Yellow Sharps Container", sku: "APYSC5", description: "Yellow sharps container with turbine lid", price: null, category: "AP Medical", image: "https://biomedwaste.com/wp-content/uploads/2022/01/5L-AP-Yel-6-ed.png" },
    { id: 43, name: "AP Medical 5-Litre Red Sharps Container", sku: "APRSC5", description: "Red sharps container with turbine lid", price: null, category: "AP Medical", image: "https://biomedwaste.com/wp-content/uploads/2022/01/5L-AP-Red-8-ed-1.png" },
    { id: 44, name: "AP Medical 5-Litre Grey Wall Bracket", sku: "APGWB5", description: "Grey wall bracket for 5L containers", price: null, category: "AP Medical", image: "https://biomedwaste.com/wp-content/uploads/2022/01/APGWB5.png" },
    { id: 45, name: "AP Medical 60-Litre Container with Lid", sku: "AP60MONO", description: "60L hermetically sealed medical waste container", price: null, category: "AP Medical", image: "https://biomedwaste.com/wp-content/uploads/2018/11/AP60MONO-001b.png" },
    { id: 47, name: "Blue Pharmaceutical Adhesive Label", sku: "ABPS1", description: "Adhesive label for pharmaceutical waste - per sheet of 5", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2018/12/Pharma1.png" },
    { id: 48, name: "Grey Cytotoxic Linen Adhesive Label", sku: "AGCSL1", description: "Adhesive label for cytotoxic linen - per sheet of 5", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2021/05/AGCSL1b.png" },
    { id: 49, name: "Grey Cytotoxic Adhesive Label", sku: "AGCS1", description: "Adhesive label for cytotoxic waste - per sheet of 5", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2018/12/001-AGCS1b.png" },
    { id: 50, name: "Grey Universal Heavy Weight Sorbent Pad", sku: "AGHSP", description: "Universal heavy weight sorbent pad", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/07/AMLK30-004b.png" },
    { id: 51, name: "Orange Category A Adhesive Label", sku: "AOCA1", description: "Adhesive label for Category A waste", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2018/12/001-ARAS1b.png" },
    { id: 52, name: "Orange Category B Adhesive Label", sku: "AOCB1", description: "Adhesive label for Category B waste", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2018/12/001-ARAS1b.png" },
    { id: 53, name: "Red Anatomical Adhesive Label", sku: "ARAS1", description: "Adhesive label for anatomical waste", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2018/12/001-ARAS1b.png" },
    { id: 54, name: "Yellow COD Adhesive Label", sku: "AYDS1", description: "Yellow COD adhesive label", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/06/001-AYDS1b.png" },
    { id: 55, name: "Adhesive Red Special Risk Material Sticker", sku: "ASRMS", description: "Special risk material sticker - sold per sheet (four stickers)", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/06/001-AYDS1b.png" },
    { id: 56, name: "30mm Single-Locking Padlock with Two Keys", sku: "AMLK30", description: "Security padlock for containers", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/07/AMLK30-004b.png" },
    { id: 57, name: "20cm Standard Duty White Cable Tie (Zip Tie)", sku: "AWZT20", description: "Cable tie for container security", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/07/AMLK30-004b.png" },
    { id: 58, name: "22L Yellow Biohazard Liner", sku: "ALBH22", description: "Yellow biohazard liner (21.5\" x 29\") - 700 per case", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/07/AMLK30-004b.png" },
    { id: 59, name: "76L Yellow Biohazard Liner", sku: "ALBH76", description: "Yellow biohazard liner (34\" x 47\") - 10 in a roll, 200 in a case", price: null, category: "Accessories", image: "https://biomedwaste.com/wp-content/uploads/2019/07/AMLK30-004b.png" },
    { id: 60, name: "Custom Medical Waste Solution", sku: "CUSTOM", description: "Contact us for custom solutions", price: null, category: "Uncategorized", image: null },
];

const RequestProduct = () => {
    const navigate = useNavigate();
    const { addToCart, getCartCount } = useQuoteCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [sortOption, setSortOption] = useState("default");
    const [quantities, setQuantities] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleQuantityChange = (productId, delta) => {
        setQuantities(prev => {
            const current = prev[productId] || 1;
            const newVal = Math.max(1, current + delta);
            return { ...prev, [productId]: newVal };
        });
    };

    const handleAddToQuote = (product) => {
        const quantity = quantities[product.id] || 1;
        addToCart(product, quantity);
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
        setSnackbar({ open: true, message: `${product.name} added to cart.`, severity: "success" });
    };

    const handleViewCart = () => {
        navigate("/cart");
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredProducts = initialProducts
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortOption) {
                case "price-low":
                    if (a.price === null) return 1;
                    if (b.price === null) return -1;
                    return a.price - b.price;
                case "price-high":
                    if (a.price === null) return 1;
                    if (b.price === null) return -1;
                    return b.price - a.price;
                case "name":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#fff" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "#0D2477",
                    mt: { xs: "100px", md: "110px" },
                    py: { xs: 10, md: 12 },
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
                            onClick={handleViewCart}
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
                            View Cart {getCartCount() > 0 && `(${getCartCount()})`}
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
                                                {product.image ? (
                                                    <Box
                                                        component="img"
                                                        src={product.image}
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
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            height: 140,
                                                            backgroundColor: "#e8e8e8",
                                                            borderRadius: 1,
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#1a2744",
                                                    mb: 0.5,
                                                    fontSize: "0.95rem",
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {product.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: "#0D2477", fontWeight: 500, display: "block", mb: 0.5 }}
                                            >
                                                SKU: {product.sku}
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
                                                {product.price !== null ? `$${product.price.toFixed(2)}` : "Contact for price"}
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
                        <Box sx={{ mt: 4, p: 2, backgroundColor: "#fff3cd", borderRadius: 2, border: "1px solid #ffc107" }}>
                            <Typography variant="body2" sx={{ color: "#856404", fontStyle: "italic", textAlign: "center" }}>
                                Please contact your 3sHealth representative for accurate up to date pricing for your facility.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

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
