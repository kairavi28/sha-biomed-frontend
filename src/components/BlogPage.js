import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
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

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [autoReload, setAutoReload] = useState(true);
  const [loading, setLoading] = useState(true);  // eslint-disable-line no-unused-vars
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
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
        .get("http://localhost:5000/api/blogs")
        .then((response) => {
          setBlogs(response.data);
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


  const handleOpen = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBlog(null);
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
    <Box sx={{ background: 'linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)', minHeight: "100vh", pb: 4, overflowX: 'hidden' }}>
      <Container>
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
          Explore Our Blogs
        </Typography>
        <Grid container spacing={6}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Paper
                elevation={5}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "#00796b",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    {blog.description.length > 100
                      ? `${blog.description.slice(0, 100)}...`
                      : blog.description}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#888",
                    fontStyle: "italic",
                    mb: 2,
                  }}
                >
                  Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: "linear-gradient(to right, #00796b, #48a999)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(to right, #00574b, #327e67)",
                    },
                  }}
                  onClick={() => handleOpen(blog)}
                >
                  Read More
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Dialog for Blog Details */}
        {selectedBlog && (
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="blog-dialog-title"
            aria-describedby="blog-dialog-description"
          >
            <DialogTitle id="blog-dialog-title">{selectedBlog.title}</DialogTitle>
            <DialogContent id="blog-dialog-description">
              <Box
                sx={{
                  mb: 3,
                  height: "300px",
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.8,
                }}
              >
                {selectedBlog.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                variant="contained"
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
        )}
      </Container>


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
    </Box>
  );
}

export default BlogPage;
