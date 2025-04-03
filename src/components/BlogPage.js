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
  DialogActions
} from "@mui/material";
import axios from "axios";
import Link from "@mui/material/Link";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [autoReload, setAutoReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  // const [quoteData, setQuoteData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   serviceType: 'home'
  // });

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setQuoteData(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = () => {
  //   if (!quoteData.name || !quoteData.email || !quoteData.phone) {
  //     alert("Please fill in all fields.");
  //     return;
  //   }

  //   axios.post("http://http://35.182.166.248/api//api/quotes", quoteData)
  //     .then(() => {
  //       alert(`Thank you, ${quoteData.name}! We will contact you soon.`);
  //       setQuoteData({ name: '', email: '', phone: '', serviceType: 'home' });
  //     })
  //     .catch(() => {
  //       alert("There was an error submitting your quote. Please try again.");
  //     });
  // };

  useEffect(() => {
    let intervalId;
    if (autoReload) {
      setLoading(true);
      axios
        .get("https://biomedwaste.net/api/blogs")
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
      }, 100000);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f9f9f9",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/images/library.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
          color: "#fff",
        }}>
        <Container>
          <Typography variant="h3" fontWeight="bold">
            Welcome to Our Information Platform
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
            Stay updated with the latest insights, stories, and trends.
          </Typography>
          {/* <Button variant="contained" sx={{
          background: "#00796b",
          "&:hover": { background: "#00574b" },
          }}>
          Learn More
          </Button> */}
        </Container>
      </Box>

      {/* About Us Section */}
      <Box sx={{ py: 8, background: "#ffffff" }}>
        <Container>
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            About Us
          </Typography>
          <Typography align="center" sx={{ color: "#555", mb: 4 }}>
            We are dedicated to providing valuable insights and fostering community engagement through our blog platform. Our mission is to empower individuals and businesses with the information they need to succeed.
          </Typography>
        </Container>
      </Box>
      <Box sx={{ py: 8 }}>
        <Container>

          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{
              mb: 6,
              color: "#333"
            }}
          >
            Explore Our Latest Blogs
          </Typography>

          <Grid container spacing={4}>
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
                  <Box sx={{ flexGrow: 0.5 }}>
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
                      sx={{ color: "#666", lineHeight: 1 }}
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
      </Box>
      <button onClick={() => setAutoReload(!autoReload)}>
        {autoReload ? "Pause Auto-Reload" : "Resume Auto-Reload"}
      </button>
      {/* Footer */}
      <Box sx={{ backgroundColor: "#333", color: "#fff", textAlign: "center", py: 4 }}>
        <Typography variant="body2">
          © 2025 Biomed Waste Recovery and Disposal Ltd. All rights reserved.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link href="/privacy-policy" color="inherit" sx={{ mx: 2 }}>
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" color="inherit" sx={{ mx: 2 }}>
            Terms & Conditions
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default BlogPage;
