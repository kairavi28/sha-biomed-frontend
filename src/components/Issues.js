import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    CardMedia,
    CardActions,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from "@mui/material";
import axios from "axios";
import Link from "@mui/material/Link";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Biomed Waste Communication Channel
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function Issues() {
    const [issues, setIssues] = useState([]);
    const [autoReload, setAutoReload] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);   // eslint-disable-line no-unused-vars
    const [selectedIssue, setSelectedIssue] = useState(null); // For popup details
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls dialog visibility
    const [quoteData, setQuoteData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: 'home'
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setQuoteData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!quoteData.name || !quoteData.email || !quoteData.phone) {
            alert("Please fill in all fields.");
            return;
        }

        axios.post("http://localhost:5000/api/quotes", quoteData)
            .then(() => {
                alert(`Thank you, ${quoteData.name}! We will contact you soon.`);
                setQuoteData({ name: '', email: '', phone: '', serviceType: 'home' });
            })
            .catch(() => {
                alert("There was an error submitting your quote. Please try again.");
            });
    };


    useEffect(() => {
        let intervalId;
        if (autoReload) {
            setLoading(true);
            axios
                .get("http://localhost:5000/api/complaints")
                .then((response) => {
                    setIssues(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load blogs. Please try again.");
                    setLoading(false);
                });

            intervalId = setInterval(() => {
                window.location.reload();
            }, 10000);
        }

        return () => clearInterval(intervalId);
    }, [autoReload]);

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedIssue(null);
    };

    if (loading) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ background: "#f3f4f6" }}
          >
            <CircularProgress />
          </Box>
        );
      }
    
      if (error) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ background: "#f8d7da" }}
          >
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        );
      }

    return (
        <Box
            sx={{
                background: "linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)",
                minHeight: "100vh",
                pb: 4,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                   // background: "",
                    borderRadius: 4,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    py: 4,
                    px: 4,
                }}
            >

                <Typography
                    variant="h5"
                    align="center"
                    fontWeight="bold"
                    sx={{
                        mb: 6,
                        color: "#333",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                    }}
                >
                    Issues Dashboard
                </Typography>
                <Grid container spacing={4}>
                    {issues.map((issue, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    backdropFilter: "blur(10px)",
                                    background: "rgba(255, 255, 255, 0.7)",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                                    "&:hover": {
                                        transform: "scale(1.1)",
                                        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={issue.image}
                                    alt="Issue Image"
                                    sx={{
                                        objectFit: "cover",
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        p: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        fontWeight="bold"
                                        sx={{ mb: 1, color: "#00796b" }}
                                    >
                                        {issue.facility}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            height: "20px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {issue.description}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{ mt: 1, color: "#757575" }}
                                    >
                                        {new Date(issue.createdAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleViewDetails(issue)}
                                        sx={{
                                            background: "linear-gradient(to right, #00796b, #48a999)",
                                            color: "#fff",
                                            "&:hover": {
                                                background: "linear-gradient(to right, #00574b, #327e67)",
                                            },
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Popup Dialog for Viewing Full Complaint */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                {/* <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Details
        </DialogTitle> */}
                <DialogContent>
                    {selectedIssue && (
                        <Box>
                            <img
                                src={selectedIssue.image}
                                alt={selectedIssue.facility}
                                style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Facility: {selectedIssue.facility}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {selectedIssue.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Submitted on:{" "}
                                {new Date(selectedIssue.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            background: "linear-gradient(to right, #00796b, #48a999)",
                            color: "#fff",
                            "&:hover": {
                                background: "linear-gradient(to right, #00574b, #327e67)",
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Footer with Get a Free Quote Section */}
            <Box sx={{
                mt: 6,
                py: 4,
                backgroundColor: '#f1f1f1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Get a Free Quote
                </Typography>
                <Container sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, boxShadow: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={quoteData.name}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                variant="outlined"
                                name="email"
                                value={quoteData.email}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                variant="outlined"
                                name="phone"
                                value={quoteData.phone}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Service Type"
                                fullWidth
                                variant="outlined"
                                name="serviceType"
                                value={quoteData.serviceType}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: '#f9f9f9' }}
                            >
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="business">Business</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                        <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                                sx={{
                                    background: "linear-gradient(to right, #00796b, #48a999)",
                                    color: "#fff",
                                    "&:hover": {
                                        background: "linear-gradient(to right, #00574b, #327e67)",
                                    },
                                }}
                            >
                                Get Free Quote
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <Box sx={{ mt: 4 }}>
                    <Copyright />
                </Box>
            </Box>
            <button onClick={() => setAutoReload(!autoReload)}>
                {autoReload ? "Pause Auto-Reload" : "Resume Auto-Reload"}
            </button>
        </Box >
    );
}

export default Issues;
